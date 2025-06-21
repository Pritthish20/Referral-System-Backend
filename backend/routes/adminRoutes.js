import express from 'express';
import {getAllEarnings,updateUserStatus,getAllUsersAdmin, createAdminUser} from '../controllers/adminControllers.js';
import { authenticate, authenticateAsAdmin } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/create', createAdminUser);
router.get('/earnings',authenticate, authenticateAsAdmin,getAllEarnings);
router.patch('/change-status',authenticate, authenticateAsAdmin,updateUserStatus);
router.get('/users',authenticate, authenticateAsAdmin,getAllUsersAdmin);

export default router;
