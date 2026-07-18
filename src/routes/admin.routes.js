import { Router } from 'express';
import {
    showAdminVehicles,
    showAddVehicleForm,
    handleAddVehicle,
    showEditVehicleForm,
    handleUpdateVehicle,
    handleDeleteVehicle,
    showAdminUsers,
    handleDeleteUser
} from '../controllers/admin.controller.js';
import { requireLogin, checkAdmin } from '../middleware/auth.js';

const router = Router();

// Admin routes - manage vehicles
router.get('/admin/vehicles', requireLogin, checkAdmin, showAdminVehicles);
router.get('/admin/vehicles/add', requireLogin, checkAdmin, showAddVehicleForm);
router.post('/admin/vehicles/add', requireLogin, checkAdmin, handleAddVehicle);
router.get('/admin/vehicles/:id/edit', requireLogin, checkAdmin, showEditVehicleForm);
router.post('/admin/vehicles/:id/update', requireLogin, checkAdmin, handleUpdateVehicle);
router.post('/admin/vehicles/:id/delete', requireLogin, checkAdmin, handleDeleteVehicle);

// Admin routes - manage users
router.get('/admin/users', requireLogin, checkAdmin, showAdminUsers);
router.post('/admin/users/:id/delete', requireLogin, checkAdmin, handleDeleteUser);

export default router;