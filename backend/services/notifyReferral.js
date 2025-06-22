import { User } from '../models/userModel.js';
import { notifyOrSave } from '../utils/notifyOrSave.js';

export const handleReferralNotifications = async ({ newUser, referrer, io }) => {
  if (!referrer || !referrer._id || !io) return;

  // ✅ Level 1 Notification
  const level1Message = `${newUser.name} joined using your referral code`;

  await notifyOrSave({
    userId: referrer._id,
    type: 'referral',
    message: level1Message,
    data: {
      referralName: newUser.name,
      level: 1,
    },
    io,
  });

  // ✅ Level 2 Notification
  const level2 = await User.findById(referrer.referredBy);
  if (level2 && level2.isActive && !level2.isBlocked) {
    const level2Message = `${newUser.name} joined via your Level 1 referral ${referrer.name}`;

    await notifyOrSave({
      userId: level2._id,
      type: 'referral',
      message: level2Message,
      data: {
        referralName: newUser.name,
        level: 2,
      },
      io,
    });
  }
};
