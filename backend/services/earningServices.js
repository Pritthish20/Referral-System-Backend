import { User } from '../models/userModel.js';
import { Earning } from '../models/earningModel.js';
import { Notification } from '../models/notificationModel.js';

const DIRECT_PERCENT = 0.05;
const INDIRECT_PERCENT = 0.01;

export const distributeEarnings = async (userId, purchaseId, profit, io) => {
  const user = await User.findById(userId).populate('referredBy');
  if (!user) return;

  const level1 = user.referredBy;
  if (level1 && level1.isActive && !level1.isBlocked) {
    const level1Earning = profit * DIRECT_PERCENT;
    level1.earnings += level1Earning;
    await level1.save();

    await Earning.create({
      earnerId: level1._id,
      sourceUserId: userId,
      purchaseId,
      amount: level1Earning,
      level: 1,
    });

    const socketRoom1 = io.sockets.adapter.rooms.get(level1._id.toString());
    if (socketRoom1 && socketRoom1.size > 0) {
      io.to(level1._id.toString()).emit('earningsUpdate', {
        amount: level1Earning,
        from: user.name,
        level: 1,
      });
    } else {
      await Notification.create({
        userId: level1._id,
        type: 'earning',
        message: `You earned ₹${level1Earning} from ${user.name} (Level 1)`,
        data: {
          from: user.name,
          amount: level1Earning,
          level: 1,
        },
      });
    }

    // Level 2 logic
    const level2 = await User.findById(level1.referredBy);
    if (level2 && level2.isActive && !level2.isBlocked) {
      const level2Earning = profit * INDIRECT_PERCENT;
      level2.earnings += level2Earning;
      await level2.save();

      await Earning.create({
        earnerId: level2._id,
        sourceUserId: userId,
        purchaseId,
        amount: level2Earning,
        level: 2,
      });

      const socketRoom2 = io.sockets.adapter.rooms.get(level2._id.toString());
      if (socketRoom2 && socketRoom2.size > 0) {
        io.to(level2._id.toString()).emit('earningsUpdate', {
          amount: level2Earning,
          from: user.name,
          level: 2,
        });
      } else {
        await Notification.create({
          userId: level2._id,
          type: 'earning',
          message: `You earned ₹${level2Earning} from ${user.name} (Level 2)`,
          data: {
            from: user.name,
            amount: level2Earning,
            level: 2,
          },
        });
      }
    }
  }
};
