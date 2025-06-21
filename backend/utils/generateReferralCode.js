import crypto from 'crypto';
import { User } from '../models/userModel.js';

export const generateUniqueReferralCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = crypto.randomBytes(4).toString('hex'); // 8-char hex
    const existing = await User.findOne({ referralCode: code });
    if (!existing) exists = false;
  }

  return code;
};
