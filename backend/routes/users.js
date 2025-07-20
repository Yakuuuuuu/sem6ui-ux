import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import { updateUserProfile, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users
router.get('/', getAllUsers);

// PUT /api/users/profile
router.put('/profile', auth, updateUserProfile);

// GET /api/users/profile
router.get('/profile', auth, getUserProfile);

export default router;
