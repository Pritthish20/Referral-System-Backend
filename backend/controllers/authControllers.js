import { User } from "../models/userModel.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import { validateReferral } from "../utils/validateReferral.js";
import { generateUniqueReferralCode } from "../utils/generateReferralCode.js";
import jwt from "jsonwebtoken";
import { handleReferralNotifications } from "../services/notifyReferral.js";

// ✅ Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (referralCode && referralCode.length !== 8) {
    return res
      .status(400)
      .json({ message: "Referral code must be 8 characters" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let referredBy = null;

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (!referrer || !referrer.isActive || referrer.isBlocked) {
        return res.status(400).json({
          message:
            "Referral code is invalid or belongs to an inactive/blocked user",
        });
      }

      if (!validateReferral(referrer)) {
        return res
          .status(400)
          .json({ message: "Referrer limit exceeded (max 8)" });
      }

      referredBy = referrer._id;
    }

    const generatedReferralCode = await generateUniqueReferralCode();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      referralCode: generatedReferralCode,
      referredBy,
    });

    await newUser.save();

    // Attach to referrer's referral list if referred
    if (referredBy) {
      const referrer = await User.findById(referredBy);
      referrer.referrals.push(newUser._id);
      await referrer.save();

      const io = req.app.get("io"); 
    await handleReferralNotifications({ newUser, referrer, io });
    }

    res.status(201).json({
      message: "User registered successfully. Please log in.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referralCode,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isActive || user.isBlocked) {
      return res.status(403).json({
        message: "Your account is inactive or blocked. Please contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // 🔐 Generate access token using your helper
    const accessToken = generateToken(user._id);

    await generateRefreshToken(res, user); // sets cookie and updates DB

    // 🎯 Return access token + user info
    res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// To refresh token  agter every 7 days and store in db
export const handleRefreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (
      !user ||
      user.refreshToken !== token ||
      user.refreshTokenExpires < Date.now()
    ) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    await generateRefreshToken(res, user); // rotate and set new refresh token
    const newAccessToken = generateToken(
      user._id,
      process.env.JWT_ACCESS_SECRET
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res
      .status(403)
      .json({ message: "Refresh token failed", error: err.message });
  }
};

// ✅ Logout user (clear JWT cookie)
export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      if (user && user.refreshToken === token) {
        user.refreshToken = null;
        user.refreshTokenExpires = null;
        await user.save();
      }
    }

    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Logout failed", error: err.message });
  }
};
