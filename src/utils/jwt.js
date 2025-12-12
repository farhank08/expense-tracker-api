import jwt from 'jsonwebtoken';

// Set token expiries
const ACCESS_TOKEN_EXPIRY = '10m';
const REFRESH_TOKEN_EXPIRY = '7d';
const SESSION_TOKEN_EXPIRY = '1h';

// Generate new access token
export const generateAccessToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRY,
	});
};

// Generate new refresh token
export const generateRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRY,
	});
};

// Generate new session token
export const generateSessionToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SESSION_SECRET, {
		expiresIn: SESSION_TOKEN_EXPIRY,
	});
};

// Verify access token
export const verifyAccessToken = (token) => {
	return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
	return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Verify refresh token
export const verifySessionToken = (token) => {
	return jwt.verify(token, process.env.JWT_SESSION_SECRET);
};
