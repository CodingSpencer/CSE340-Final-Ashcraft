import { Router } from 'express';
import controller from '../controllers/account.controller.js';
import { requireLogin } from '../middleware/auth.js';
import { showDashboard } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/login', controller.showLoginForm);
router.post('/login', controller.login);
router.get('/register', controller.showRegisterForm);
router.post('/register', controller.register);
router.get('/account/login', controller.showLoginForm);
router.post('/account/login', controller.login);
router.get('/account/register', controller.showRegisterForm);
router.post('/account/register', controller.register);
router.get('/account/dashboard', requireLogin, showDashboard);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/account/logout', controller.logout);
router.post('/logout', controller.logout);
router.post('/account/logout', controller.logout);

export default router;