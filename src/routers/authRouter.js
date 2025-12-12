import { Router } from 'express';

import * as AuthController from '../controllers/authController.js';
import { authApi } from '../middlewares/authenticator.js';

// Initialize express router
const router = Router();

// POST User login route
router.post('/login', AuthController.login);

// POST User logout route
router.post('/logout', authApi, AuthController.logout);

// POST User register route
router.post('/register', AuthController.register);

// POST Refresh session route
router.post('/refresh', AuthController.refresh);

// Export router
export default router;
