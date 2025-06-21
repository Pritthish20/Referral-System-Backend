import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  handleRefreshToken
} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', handleRefreshToken);
router.post('/logout', logoutUser);


export default router;
