import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDb } from './src/databases/dbClient.js';
import UserRouter from './src/routers/apiRouters/userRouter.js';
import ExpenseRouter from './src/routers/apiRouters/expenseRouter.js';
import ViewRouter from './src/routers/viewRouter.js';

// Load environment variables
dotenv.config();

try {
	// Connect to database
	await initDb();
} catch (error) {
	// Handle database connection error
	console.error(error.message);

	// Exit with error
	process.exit(1);
}

// Resolve file path in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, 'public');

// Port for server
const port = process.env.PORT || 5000;

// Create new express server app
const app = express();

// Parse json responses
app.use(express.json());

// Parse cookie in request object
app.use(cookieParser());

// Handle automatic browser favicon request
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Serve static files
app.use(express.static(publicDir));

// Serve User API routes
app.use('/api', UserRouter);

// Serve Expense API routes
app.use('/api', ExpenseRouter);

// Serve view routes
app.use('/', ViewRouter);

// Handle unhandled routes
app.use((req, res) => {
	console.error(`Unhandled route ${req.path}`);
	return res.status(404).json({
		success: false,
		message: 'Route not found',
	});
});

// Listen on server port
const server = app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
	try {
		// Close express server application
		await new Promise((resolve) => server.close(resolve));
		console.log('Server shutdown successful');
	} catch (error) {
		// Handle server shutdown error
		console.error(`Shutdown error: ${error.message}`);
	}

	try {
		// Close mongoose client
		await mongoose.disconnect();
		console.log('Database shutdown successful');
	} catch (error) {
		// Exit with error
		console.error(`Database shutdown failed: ${error.message}`);
		process.exit(1);
	} finally {
		process.exit(0);
	}
});
