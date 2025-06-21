// middlewares/checkUserStatus.js
import {User} from '../models/userModel.js';

export const checkUserStatus = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ message: 'Account is blocked.' });
  }

  next();
};
