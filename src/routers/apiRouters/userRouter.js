import { Router } from 'express';

import * as UserController from '../../controllers/userController.js';

// Initialize express router
const router = Router();

// User login route
router.post('/login', UserController.login);

// User logout route
router.post('/logout', UserController.logout);

// User register route
router.post('/register', UserController.register);

// Export router
export default router;
