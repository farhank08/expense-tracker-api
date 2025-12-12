import apiClient, { setAccessToken } from '../services/apiClient.js';

// Handle login form submit
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (event) => {
	// Prevent default execution
	event.preventDefault();

	// Get form data
	const formData = new FormData(loginForm);
	const email = formData.get('email');
	const password = formData.get('password');

	let response;
	try {
		// POST login user
		response = await apiClient.post('/auth/login', {
			email,
			password,
		});
	} catch (error) {
		// Handle login failed error
		console.error(error.message);
		alert('Login attempt failed!');
		return;
	}

	// Spread access token from response data
	const { accessToken } = response.data;

	// Set access token in api client
	setAccessToken(accessToken);

	// Redirect to index page
	window.location.href = '/';
});
