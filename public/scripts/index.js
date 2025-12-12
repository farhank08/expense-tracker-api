let accessToken;
window.addEventListener('DOMContentLoaded', async (event) => {
	try {
		const response = await axios.get('/auth/refresh');
		accessToken = response.data.accessToken;
	} catch (error) {
		console.error(error.message);
	}
});

const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', async (event) => {
	try {
		const response = await axios.post('/auth/logout', null, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		alert('Logout successful');
		window.location.href = '/login';
	} catch (error) {
		console.error(error.message);
	}
});
