// Access token
let accessToken = null;

// Create Axios API client
const apiClient = axios.create({
	baseUrl: '/api',
	withCredentials: true,
});

// Add access token to authorization header via interceptor
apiClient.interceptors.request.use((config) => {
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	// Return updated config
	return config;
});

// Handle invalid access token
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		// Get original request from config
		const originalRequest = error.config;

		// Call refresh endpoint on unauthenticated response only once
		if (error.response?.status === 401 && !originalRequest._retried) {
			// Set retried flag on original request
			originalRequest._retried = true;

			try {
				// POST refresh access token
				const response = await axios.post('/auth/refresh', null, {
					withCredentials: true,
				});

				// Set new access token
				accessToken = response.data.accessToken;

				// Set new access token in original request authorization header
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;

				// Retry original request with new access token
				return apiClient(originalRequest);
			} catch (refreshError) {
				// Handle invalid refresh token error
				accessToken = null;
				window.location.href = '/';
				return Promise.reject(refreshError);
			}
		}

		// Return original response
		return Promise.reject(error);
	}
);

// Set access token
export const setAccessToken = (token) => {
	accessToken = token;
};

// Clear access token
export const clearAccessToken = () => {
	accessToken = null;
};

// Export api client
export default apiClient;
