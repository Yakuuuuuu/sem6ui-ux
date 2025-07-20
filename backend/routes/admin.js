import express from 'express';
import { getSalesAnalytics, getUserGrowthAnalytics } from '../controllers/adminController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/analytics/sales', getSalesAnalytics);
router.get('/analytics/users', getUserGrowthAnalytics);

export default router;
