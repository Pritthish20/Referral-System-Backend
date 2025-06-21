import { Earning } from '../models/earningModel.js';
import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Create admin user (meant for internal/admin-only use)
export const createAdminUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = crypto.randomBytes(4).toString('hex');

    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      referralCode,
      isAdmin: true, // ✅ Special admin flag
      isActive: true
    });

    await adminUser.save();

    res.status(201).json({
      message: 'Admin user created successfully',
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create admin', error: err.message });
  }
};

export const getAllEarnings = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const earnings = await Earning.find({})
      .populate('earnerId', 'name email')        // User who earned
      .populate('sourceUserId', 'name email')    // User who triggered the earning
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Earning.countDocuments();

    res.status(200).json({
      earnings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch earnings history',
      error: err.message,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId, isActive, isBlocked } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (typeof isBlocked !== 'undefined') user.isBlocked = isBlocked;

    await user.save();

    res.status(200).json({
      message: 'User status updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        isBlocked: user.isBlocked,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user status', error: err.message });
  }
};

export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select('name email referralCode isActive isBlocked');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};
