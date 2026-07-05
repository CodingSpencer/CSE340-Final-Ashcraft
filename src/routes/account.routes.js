import { Router } from 'express';
import {
    login,
    logout,
    showLoginForm,
    showRegisterForm,
    register
} from '../controllers/account.controller.js';
import { requireLogin } from '../middleware/auth.js';
import { showDashboard } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/login', showLoginForm);
router.post('/login', login);
router.get('/register', showRegisterForm);
router.post('/register', register);
router.post('/logout', logout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;