import bcrypt from 'bcrypt';
import * as JWT from '../utils/jwt.js';

import UserModel from '../models/userModel.js';

// Register user
export const register = async (req, res) => {
	// Hashing salt
	const SALT = 8;

	// Spread request body
	const { name, email, password } = req.body;

	try {
		// Hash password with salt
		const hashedPassword = await bcrypt.hash(password, SALT);

		// Create new user in database
		const newUser = await UserModel.create({
			name,
			email,
			password: hashedPassword,
		});

		// Get User id from new user
		const userId = newUser._id;

		// Respond with success
		console.log(`User id ${userId} registered successfully on ${new Date().toLocaleString()}`);
		return res.status(201).json({
			success: true,
			message: 'User registration successful',
		});
	} catch (error) {
		// Handle database query error
		console.error(`Database server error: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

// Login user
export const login = async (req, res) => {
	// Get refresh token from cookie
	const token = req.cookies.sessionToken;

	if (token) {
		try {
			// Decode token
			const decoded = JWT.verifySessionToken(token);

			// Handle existing token error
			console.error(
				`User id ${
					decoded.userId
				} login attempt unsuccessful on ${new Date().toLocaleString()} : User already authenticated`
			);
			return res.status(400).json({
				success: false,
				message: 'Already authenticated',
			});
		} catch (error) {
			// Handle invalid or expired token error
			console.debug(
				`User login attempt with invalid or expired session token on ${new Date().toLocaleString()}`
			);
		}
	}

	// Spread request body
	const { email, password } = req.body;

	let user;
	try {
		// Verify user email in database
		user = await UserModel.findOne({ email });
	} catch (error) {
		// Handle database query error
		console.error(`Database server error: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	// Handle user email not found error
	if (!user) {
		console.error(
			`User login attempt unsuccessful on ${new Date().toLocaleString()} : Email ${email} not found`
		);
		return res.status(404).json({
			success: false,
			message: 'Invalid login attempt',
		});
	}

	// Get user id from user
	const userId = user._id;

	// Verify password
	const correctPassword = await bcrypt.compare(password, user.password);
	if (!correctPassword) {
		//Handle incorrect password error
		console.error(
			`User id ${userId} login attempt unsuccessful on ${new Date().toLocaleString()} :  Incorrect password`
		);
		return res.status(401).json({
			success: false,
			message: 'Invalid login attempt',
		});
	}

	// Generate new tokens
	const accessToken = JWT.generateAccessToken({ userId });
	const refreshToken = JWT.generateRefreshToken({ userId });
	const sessionToken = JWT.generateSessionToken({ userId });

	// Store refresh token in request cookie header
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
		path: '/',
	});

	// Store session token in request cookie header
	res.cookie('sessionToken', sessionToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
		path: '/',
	});

	// Respond with success
	console.log(`User id ${userId} logged in successfully on ${new Date().toLocaleString()}`);
	return res.status(200).json({
		success: true,
		message: 'User login successful',
		accessToken,
	});
};

// Logout user
export const logout = (req, res) => {
	// Clear refresh and session tokens from cookie
	res.clearCookie('refreshToken');
	res.clearCookie('sessionToken');

	// Respond with success
	console.log(`User id ${req.userId} logged out successfully on ${new Date().toLocaleString()}`);
	return res.status(200).json({
		success: true,
		message: 'User logout successful',
	});
};

// Refresh access token
export const refresh = (req, res) => {
	// Get token from cookie
	const token = req.cookies.refreshToken;

	// Handle missing token error
	if (!token) {
		console.error(
			`Unauthenticated request at ${
				req.path
			} on ${new Date().toLocaleString()} : Missing refresh token`
		);
		return res.status(401).json({
			success: false,
			message: 'Unauthenticated',
		});
	}

	let decoded;
	try {
		// Verify refresh token
		decoded = JWT.verifyRefreshToken(token);
	} catch (error) {
		// Remove invalid refresh token from cookie
		res.clearCookie('refreshToken');

		// Handle invalid or expired token error
		console.error(
			`Access token refresh failed on ${new Date().toLocaleString()} : ${error.message}`
		);
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token',
		});
	}

	// Generate new access token
	let accessToken;
	try {
		accessToken = JWT.generateAccessToken({ userId: decoded.userId });
	} catch (error) {
		// Handle access token generation failure
		console.error(
			`User id ${decoded.userId} access token refresh failed on ${new Date().toLocaleString()} : ${
				error.message
			}`
		);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	// Respond with new access token
	console.log(
		`User id ${decoded.userId} access token refresh successful on ${new Date().toLocaleString()}`
	);
	return res.status(200).json({
		success: true,
		message: 'Refresh successful',
		accessToken,
	});
};
