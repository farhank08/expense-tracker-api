import apiClient, { clearAccessToken } from '../services/apiClient.js';

// Get id from url parameters
const path = window.location.pathname;
const pathSegments = path.split('/');
const expenseId = pathSegments[2] || null;

// Load expense details if editing an existing expense
if (expenseId) {
	window.addEventListener('DOMContentLoaded', async () => {
		let expense;
		try {
			// GET expense details
			const response = await apiClient.get(`/expenses/${expenseId}`);
			expense = response.data.payload;
		} catch (error) {
			// Handle server request error
			console.error('Failed to load expense details:', error.message);
			return alert('Failed to load expense details');
		}

		// Populate form fields with expense details
		document.getElementById('expense-category').value = expense.category;
		document.getElementById('expense-cost').value = parseFloat(expense.cost).toFixed(2);
		if (expense.description)
			document.getElementById('expense-description').value = expense.description;
		document.getElementById('expense-date').value = new Date(expense.purchasedAt)
			.toISOString()
			.split('T')[0];

		// Handle delete button click event
		const deleteButton = document.createElement('button');
		deleteButton.type = 'button';
		deleteButton.classList.add('danger');
		deleteButton.innerText = 'Delete';

		deleteButton.addEventListener('click', async () => {
			// Confirm delete action
			const confirmDelete = confirm('Are you sure you want to delete this expense?');
			if (!confirmDelete) return;

			try {
				// DELETE expense
				await apiClient.delete(`/expenses/${expenseId}`);
				alert('Expense deleted successfully');
			} catch (error) {
				console.error(error.message);
				return alert('Failed to delete expense');
			}

			// Redirect to dashboard
			window.location.href = '/';
		});

		const expenseFormActions = document.getElementById('expense-form-actions');
		expenseFormActions.appendChild(deleteButton);
	});
}

// Handle back button click event
const backButton = document.getElementById('back-button');
backButton.addEventListener('click', () => {
	// Redirect to index page
	window.location.href = '/';
});

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

// Add id to expense form if existing expense
const expenseForm = document.getElementById('expense-form');
if (expenseId) {
	const expenseIdLabel = document.createElement('small');
	expenseIdLabel.className = 'expense-id';
	expenseIdLabel.innerText = `Expense ID: ${expenseId}`;
	expenseForm.prepend(expenseIdLabel);
}

// Handle form submission event
expenseForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	// Get form data
	const formData = new FormData(expenseForm);
	const expenseData = {
		category: formData.get('category'),
		cost: parseFloat(formData.get('cost')).toFixed(2),
		description: formData.get('description'),
		purchasedAt: formData.get('date'),
	};

	try {
		if (!expenseId) {
			// POST create expense
			await apiClient.post('/expenses', expenseData);
			alert('Expense created successfully');
		} else {
			// PUT update expense
			await apiClient.put(`/expenses/${expenseId}`, expenseData);
			alert('Expense updated successfully');
		}
	} catch (error) {
		console.error(error.message);
		return alert('Failed to save expense');
	}

	// Redirect to dashboard
	window.location.href = '/';
});

// Handle clear button click event
const clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', () => {
	// Clear form fields
	expenseForm.reset();
});
