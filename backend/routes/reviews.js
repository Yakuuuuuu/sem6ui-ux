import express from 'express';
import { getProductReviews, addProductReview, deleteReview } from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all reviews for a product
router.get('/:productId', getProductReviews);
// Add a review (auth required)
router.post('/:productId', auth, addProductReview);
// Delete a review (auth required)
router.delete('/:id', auth, deleteReview);

export default router; 