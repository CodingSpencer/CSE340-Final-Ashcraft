import { Router } from 'express';
import {
    showCreateReviewForm,
    handleCreateReview,
    showMyReviews,
    showEditReviewForm,
    handleUpdateReview,
    handleDeleteMyReview,
    handleDeleteReview
} from '../controllers/review.controller.js';
import { requireLogin, checkAdminOrEmployee } from '../middleware/auth.js';

const router = Router();

// Customer routes - add a review
router.get('/inventory/:vehicleId/review', requireLogin, showCreateReviewForm);
router.post('/inventory/:vehicleId/review', requireLogin, handleCreateReview);

// Customer routes - view and manage own reviews
router.get('/my-reviews', requireLogin, showMyReviews);
router.get('/my-reviews/:id/edit', requireLogin, showEditReviewForm);
router.post('/my-reviews/:id/update', requireLogin, handleUpdateReview);
router.post('/my-reviews/:id/delete', requireLogin, handleDeleteMyReview);

// Admin/Employee routes - delete a review
router.post('/admin/reviews/:id/delete', requireLogin, checkAdminOrEmployee, handleDeleteReview);

export default router;