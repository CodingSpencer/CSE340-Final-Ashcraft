import { Router } from 'express';
import {
    showRentalForm,
    handleCreateRental,
    showMyRentals,
    showAllRentals,
    handleUpdateRentalStatus,
    handleCancelMyRental
} from '../controllers/rental.controller.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

// Customer routes - rent a vehicle
router.get('/inventory/:id/rent', requireLogin, showRentalForm);
router.post('/inventory/:id/rent', requireLogin, handleCreateRental);

// Customer routes - view and manage own rentals
router.get('/my-rentals', requireLogin, showMyRentals);
router.post('/my-rentals/:id/cancel', requireLogin, handleCancelMyRental);

// Admin/Employee routes - manage all rentals
router.get('/admin/rentals', requireLogin, showAllRentals);
router.post('/admin/rentals/:id/status', requireLogin, handleUpdateRentalStatus);

export default router;