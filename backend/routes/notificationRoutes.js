// routes/notificationRoutes.js
import express from 'express';
import { authenticate } from '../middlewares/authMiddlewares.js'
import { checkUserStatus } from '../middlewares/checkUserStatus.js';
import { getNotifications, markNotificationsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authenticate, checkUserStatus, getNotifications);
router.put('/mark', authenticate, checkUserStatus,markNotificationsRead);

export default router;
