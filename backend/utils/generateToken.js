import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  };

export const generateRefreshToken = async (res, user) => {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ userId: user._id, jti }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  user.refreshToken = token;
  user.refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  await user.save();

  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
