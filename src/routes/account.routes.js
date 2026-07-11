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
router.get('/account/login', showLoginForm);
router.post('/account/login', login);
router.get('/account/register', showRegisterForm);
router.post('/account/register', register);
router.get('/account/dashboard', requireLogin, showDashboard);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/account/logout', logout);
router.post('/logout', logout);
router.post('/account/logout', logout);

export default router;