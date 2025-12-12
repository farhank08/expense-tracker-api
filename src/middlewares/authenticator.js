import * as JWT from '../utils/jwt.js';

// API authenticator
export const authApi = (req, res, next) => {
	// Get access token from authorization header
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1]; // 'Bearer 123'

	if (!token) {
		// Handle missing access token error
		console.error(`Missing access token at ${req.path} on ${new Date().toLocaleString()}`);
		return res.status(401).json({
			success: false,
			message: 'Unathenticated',
		});
	}

	try {
		// Verify access token
		const decoded = JWT.verifyAccessToken(token);

		// Attach User id to request
		req.userId = decoded.userId;

		// Reroute on success
		return next();
	} catch (error) {
		// Handle invalid or expired access token
		console.error(
			`Invalid access token at ${req.path} on ${new Date().toLocaleString()} : ${error.message}`
		);
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token',
		});
	}
};

// View authenticator
export const authView = async (req, res, next) => {
	// Get session token from cookie
	const sessionToken = req.cookies.sessionToken;

	if (!sessionToken) {
		// Redirect to login page
		console.error(`Missing session token at ${req.path} on ${new Date().toLocaleString()}`);
		return res.redirect('/login');
	}

	try {
		// Verify session token
		JWT.verifySessionToken(sessionToken);

		// Reroute on success
		return next();
	} catch (error) {
		// Remove invalid or expired session token from cookie
		res.clearCookie('sessionToken');

		// Handle invalid or expired session token error
		console.warn(
			`Invalid session token at ${req.path} on ${new Date().toLocaleString()} : ${error.message}`
		);
		console.log('Attempting session token refresh....');
	}

	// Get refresh token from cookie
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		// Handle missing refresh token error
		console.error(`Missing refresh token at ${req.path} on ${new Date().toLocaleString()}`);

		// Redirect to login page
		console.log('Redirecting to login page');
		return res.redirect('/login');
	}

	let decoded;
	try {
		// Verify refresh token
		decoded = JWT.verifyRefreshToken(refreshToken);
	} catch (error) {
		// Remove invalid or expired refresh token from cookie
		res.clearCookie('refreshToken');

		// Handle invalid or expired refresh token error
		console.error(
			`Invalid refresh token at ${req.path} on ${new Date().toLocaleString()} : ${error.message}`
		);

		// Redirect to login page
		console.log('Redirecting to login page');
		return res.redirect('/login');
	}

	let newSessionToken;
	try {
		// Generate new session token
		newSessionToken = JWT.generateSessionToken({ userId: decoded.userId });
	} catch (error) {
		// Clear all tokens from cookie
		res.clearCookie('refreshToken');
		res.clearCookie('sessionToken');

		// Handle session token generation failed error
		console.error(
			`Failed to sign new session token for User id ${decoded.userId} at ${
				req.path
			} on ${new Date().toLocaleString()} : ${error.message}`
		);

		// Redirect to login page
		console.log('Redirecting to login page');
		return res.redirect('/login');
	}

	// Set new session token in cookie
	res.cookie('sessionToken', newSessionToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === true,
		sameSite: 'strict',
		maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
		path: '/',
	});

	// Reroute on success
	return next();
};
