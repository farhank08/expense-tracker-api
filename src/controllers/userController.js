import bcrypt from 'bcrypt';

import UserModel from '../models/userModel.js';

// Load jwt secret from environment
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Hash salt
const SALT = 8;

// Login user
export const login = async (req, res) => {
	// Spread request body
	const { email, password } = req.body;

	try {
		// Verify user email in database
		const user = await UserModel.findOne({ email });
		if (!user) {
			//Handle user email not found error
			console.error(`Login attempt failed: User email ${email} not found`);
			return res.status(404).json({
				success: false,
				message: 'User email not found',
			});
		}

		// Get user id from user
		const userId = user._id;

		// Verify password
		const correctPassword = await bcrypt.compare(password, user.password);
		if (!correctPassword) {
			//Handle incorrect password error
			console.error(`Login attempt failed: User email ${email} not found`);
			return res.status(400).json({
				success: false,
				message: 'Invalid login attempt',
			});
		}

		// Generate new access token
		const token = jwt.sign({ userId: userId }, jwtSecretKey, (error) => {
			if (error) {
				// Handle jsonwebtoken sign failure
				console.error(`Failed to sign access token for User id ${userId}: ${error.message}`);
				return res.status(500).json({
					success: false,
					message: 'Internal server error',
				});
			}
		});

		// Store token in request cookie header
		res.cookie('accessToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
		});

		// Respond with success
		console.log(`User id ${userId} logged in successfully at ${Date.now().toLocaleString()}`);
		return res.status(200).json({
			success: true,
			message: 'User login successful',
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

// Logout user
export const logout = async (req, res) => {
	// Get token from cookie
	const token = req.cookie.accessToken;
	if (!token) {
		// Handle user not logged in error
		console.error(
			`User id ${
				token.userId
			} logout unsuccessful at ${Date.now().toLocaleString()}: User is not logged in`
		);
		return res.status(400).json({
			success: false,
			message: 'User not logged in',
		});
	}

	// Clear cookie
	req.clearCookie('accessToken');

	// Respond with success
	console.log(`User id ${userId} logged out successfully at ${Date.now().toLocaleString()}`);
	return res.status(200).json({
		success: true,
		message: 'User logout successful',
	});
};

// TODO: Register user
export const register = async (req, res) => {
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

		// Get user id from user
		const userId = newUser._id;

		// Generate new access token
		const token = jwt.sign({ userId: userId }, jwtSecretKey, (error) => {
			if (error) {
				// Handle jsonwebtoken sign failure
				console.error(`Failed to sign access token for new User id ${userId}: ${error.message}`);
				return res.status(500).json({
					success: false,
					message: 'Internal server error',
				});
			}
		});

		// Store token in request cookie header
		res.cookie('accessToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
		});

		// Respond with success
		console.log(`User id ${userId} registered successfully at ${Date.now().toLocaleString()}`);
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
