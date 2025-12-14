import apiClient, { clearAccessToken } from '../services/apiClient.js';

// Fetch and display all user expenses
window.addEventListener('DOMContentLoaded', async () => {
	let expenses;
	try {
		// GET all expenses
		const response = await apiClient.get('/expenses');
		expenses = response.data.payload;
	} catch (error) {
		// Handle fetch expenses failed
		console.error(error.message);
		return alert('Failed to load expenses');
	}

	// Load expenses into the UI
	loadExpenses(expenses);
});

// Handle create button click event
const createButton = document.getElementById('create-button');
createButton.addEventListener('click', () => {
	// Redirect to create page
	window.location.href = '/expense';
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

// Handle search form submit event
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', async (event) => {
	// Prevent default form submission
	event.preventDefault();

	// Get form data
	const formData = new FormData(searchForm);
	const category = formData.get('category');
	const fromDate = formData.get('from-date');
	const toDate = formData.get('to-date');

	// Build query parameters
	const params = {};
	if (category) params.category = category;
	if (fromDate) params.fromDate = fromDate;
	if (toDate) params.toDate = toDate;

	let expenses;
	try {
		// GET filtered expenses
		const response = await apiClient.get('/expenses', { params });
		expenses = response.data.payload;
	} catch (error) {
		// Handle fetch filtered expenses failed error
		console.error(error.message);
		return alert('Failed to load expenses');
	}

	// Load filtered expenses into the UI
	loadExpenses(expenses);
});

// Helper: Load expenses list
const expensesList = document.getElementById('expenses-list');
const loadExpenses = (expenses) => {
	// Clear existing expenses
	expensesList.innerHTML = '';

	if (expenses.length === 0) {
		// Show no expenses message
		const noExpensesMessage = document.createElement('p');
		noExpensesMessage.classList.add('expense-empty-message');
		noExpensesMessage.innerText = 'No expenses found. Click "Create" to add one.';
		expensesList.appendChild(noExpensesMessage);
		return;
	}

	// Populate expenses list
	expenses.forEach((expense) => {
		// Create list item element
		const listItem = document.createElement('li');
		listItem.classList.add('expense-item');

		// Handle list item click event
		listItem.addEventListener('click', () => {
			// Redirect to expense detail page
			window.location.href = `/expense/${expense._id}`;
		});

		// Expense category
		const category = document.createElement('p');
		category.classList.add('expense-category');
		category.innerText = expense.category;
		listItem.appendChild(category);

		// Expense purchase date
		const purchaseDate = document.createElement('small');
		purchaseDate.classList.add('expense-date');
		purchaseDate.innerText = `Purchase Date: ${new Date(expense.purchasedAt).toLocaleDateString(
			'en-GB'
		)}`;
		listItem.appendChild(purchaseDate);

		// Expense cost
		const cost = document.createElement('p');
		cost.classList.add('expense-cost');
		cost.innerText = `Cost: $${expense.cost.toFixed(2)}`;
		listItem.appendChild(cost);

		// Expense description
		const description = document.createElement('p');
		description.classList.add('expense-description');
		description.innerText = expense.description;
		listItem.appendChild(description);

		// Append expense to the list
		expensesList.appendChild(listItem);
	});
};
