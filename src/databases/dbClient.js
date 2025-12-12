import mongoose from 'mongoose';

// Initialize mongodb client connection
export const initDb = async () => {
	// Load mongodb uri from environment
	const uri = process.env.MONGODB_URI;

	// Establish connection
	const client = await mongoose.connect(uri);

	// Handle connection success
	client.connection.on('connect', () => {
		console.log('MongoDB connection successful');
	});

	// Handle connection failure
	client.connection.on('error', () => {
		throw new Error('MongoDB connection attempt failed');
	});
};                     
