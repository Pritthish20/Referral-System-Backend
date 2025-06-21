import { User } from '../models/userModel.js';
import { Purchase } from '../models/purchaseModel.js';
import { distributeEarnings } from '../services/earningServices.js';
import { Earning } from '../models/earningModel.js';

// ✅ Make a purchase and trigger earnings
export const makePurchase = async (req, res) => {
  const { amount, profit } = req.body;

  if (!amount || !profit) {
    return res.status(400).json({ message: 'Amount and profit required' });
  }

  if (amount < 1000) {
    return res.status(400).json({ message: 'Amount must be over 1000 Rs' });
  }

  try {
    const purchase = await Purchase.create({
      userId: req.user._id,
      amount,
      profit,
    });

    const io = req.app.get('io');
    await distributeEarnings(req.user._id, purchase._id, profit, io);

    res.status(201).json({ message: 'Purchase recorded', purchase });
  } catch (err) {
    res.status(500).json({ message: 'Purchase failed', error: err.message });
  }
};


// ✅ Get referral analytics
export const getReferralStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'referrals',
      populate: { path: 'referrals', model: 'User' },
    });

    const level1 = user.referrals.length;
    const level2 = user.referrals.reduce((acc, r) => acc + r.referrals.length, 0);

    res.status(200).json({
      level1,
      level2,
      totalReferrals: level1 + level2,
      earnings: user.earnings,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get stats', error: err.message });
  }
};


// ✅ Get full referral tree
export const getReferralTree = async (req, res) => {
  try {
    const buildTree = async (userId, depth = 2) => {
      const user = await User.findById(userId).select('name referrals').populate('referrals', 'name referrals');
      if (!user || depth === 0) return null;

      const children = await Promise.all(
        user.referrals.map(async (child) => {
          const subTree = await buildTree(child._id, depth - 1);
          return {
            _id: child._id,
            name: child.name,
            referrals: subTree?.referrals || [],
          };
        })
      );

      return { _id: user._id, name: user.name, referrals: children };
    };

    const tree = await buildTree(req.user._id);
    res.status(200).json(tree);
  } catch (err) {
    res.status(500).json({ message: 'Failed to build referral tree', error: err.message });
  }
};

// ✅ Get my referral code
export const getMyReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('referralCode');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ referralCode: user.referralCode });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch referral code', error: err.message });
  }
};

// ✅ Get my earnings history
export const getEarningsHistory = async (req, res) => {
  try {
    const earnings = await Earning.find({ earnerId: req.user._id })
      .populate('sourceUserId', 'name email')
      .populate('purchaseId', 'amount profit createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: earnings.length, earnings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch earnings history', error: err.message });
  }
};