import express from 'express';
import {
  makePurchase,
  getReferralStats,
  getReferralTree,
  getMyReferralCode,
  getEarningsHistory
} from '../controllers/userControllers.js';
import { authenticate } from '../middlewares/authMiddlewares.js';
import { checkUserStatus } from '../middlewares/checkUserStatus.js';

const router = express.Router();

router.get('/referral-tree', authenticate,checkUserStatus, getReferralTree);
router.post('/purchase', authenticate,checkUserStatus, makePurchase);
router.get('/analytics', authenticate,checkUserStatus, getReferralStats);
router.get('/referral-code',authenticate,checkUserStatus,getMyReferralCode)
router.get('/my-history', authenticate,checkUserStatus,getEarningsHistory);

export default router;
