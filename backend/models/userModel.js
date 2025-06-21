import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  earnings: { type: Number, default: 0 },
  refreshToken: { type: String, default: null },
  refreshTokenExpires: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
},{timestamps: true});

export const User = mongoose.model('User', userSchema);
