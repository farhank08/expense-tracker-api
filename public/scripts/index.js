import apiClient, { clearAccessToken } from '../services/apiClient.js';

// Handle logout button click event
const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', async (event) => {
	try {
		// POST logout user
		await apiClient.post('/auth/logout');

		// Clear access token from api client
		clearAccessToken();

		// Redirect to login page
		alert('Logout successful');
		window.location.href = '/login';
	} catch (error) {
		// Handle logout failed
		console.error(error.message);
		alert('Logout unsuccessful');
	}
});
