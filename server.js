import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

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

// Listen on server port
const server = app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
	try {
		await new Promise((resolve) => server.close(resolve));
	} catch (error) {
		console.error(`Shutdown error: ${error.message}`);
	} finally {
		process.exit(0);
	}
});
