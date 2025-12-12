const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const formData = new FormData(loginForm);
	const email = formData.get('email');
	const password = formData.get('password');

	let response;
	try {
		response = await axios.post('/auth/login', {
			email,
			password,
		});
	} catch (error) {
		// TODO: Handle login failed error
	}

	window.location.href = '/';
});
