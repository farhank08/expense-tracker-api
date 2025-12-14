import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { authView } from '../middlewares/authenticator.js';
import * as JWT from '../utils/jwt.js';

// Resolve file path in ES Module
const __filepath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filepath);
const viewsDir = path.resolve(__dirname, '../../', 'public', 'views');

// Initialize express router
const router = Router();

// Serve login page
router.get('/login', (req, res, next) => {
	// Get session token from cookie
	const token = req.cookies.sessionToken;

	if (!token) {
		// Serve login page for missing session token
		return res.sendFile(path.join(viewsDir, 'login.html'), (error) => {
			if (error) return next();
		});
	}

	try {
		// Verify session token
		JWT.verifySessionToken(token);

		// Redirect to index page on valid session token
		return res.redirect('/');
	} catch (error) {
		// Serve login page for invalid session token
		return res.sendFile(path.join(viewsDir, 'login.html'), (error) => {
			if (error) return next();
		});
	}
});

// Serve index page
router.get('/', authView, (req, res, next) => {
	return res.sendFile(path.join(viewsDir, 'index.html'), (error) => {
		if (error) return next();
	});
});

// Serve expense create page
router.get('/expense', authView, (req, res, next) => {
	return res.sendFile(path.join(viewsDir, 'expense.html'), (error) => {
		if (error) return next();
	});
});

// Serve expense edit page
router.get('/expense/:id', authView, (req, res, next) => {
	return res.sendFile(path.join(viewsDir, 'expense.html'), (error) => {
		if (error) return next();
	});
});

// Export router
export default router;
