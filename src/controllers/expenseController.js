import ExpenseModel from '../models/expenseModel.js';

// Get all expenses
export const getExpenses = async (req, res) => {
	// Get user id from request
	const userId = req.userId;

	// Spread queries from request
	const { category, fromDate, toDate } = req.query;

	// Add user id to database filter
	const filter = { userId };

	// Add category to filter
	if (category) filter.category = category;

	if (fromDate || toDate) {
		// Create purchasedAt object in filter for date ranges
		filter.purchasedAt = {};

		if (fromDate) {
			// Add compare function to purchasedAt filter
			filter.purchasedAt.$gte = new Date(fromDate);
		}

		if (toDate) {
			// Add compare function to purchasedAt filter
			filter.purchasedAt.$lte = new Date(toDate);
		}
	}

	// Get expenses from database in descending order
	let expenses;
	try {
		expenses = await ExpenseModel.find(filter).sort({ purchasedAt: -1 });
	} catch (error) {
		// Handle database filter error
		console.error(
			`User id ${userId} request at ${req.method} ${
				req.path
			} failed on ${new Date().toLocaleString()}\n${error.message}`
		);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	// Respond with expenses
	console.log(
		`User id ${userId} request at ${req.method} ${
			req.path
		} successful on ${new Date().toLocaleString()}`
	);
	return res.status(200).json({
		success: true,
		message: 'Expenses found',
		payload: expenses,
	});
};

// Get expense by id
export const getExpenseById = async (req, res) => {
	// Get user id from request
	const userId = req.userId;

	// Get expense id from request path
	const expenseId = req.path.split('/').filter(Boolean)[1]; // ['expenses', 123]

	// Create filter to find expense
	const filter = {
		_id: expenseId,
		userId,
	};

	// Get expense with id from database
	let expense;
	try {
		expense = await ExpenseModel.findOne(filter);
	} catch (error) {
		// Handle database query error
		console.error(
			`User id ${userId} request at ${req.method} ${
				req.path
			} failed on ${new Date().toLocaleString()}\n${error.message}`
		);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	// Handle expense not found error
	if (!expense) {
		console.error(
			`User id ${userId} request at ${req.method} ${
				req.path
			} failed on ${new Date().toLocaleString()} : Expense not found`
		);
		return res.status(404).json({
			success: false,
			message: 'Expense not found',
		});
	}

	// Respond with expenses
	console.log(
		`User id ${userId} request at ${req.method} ${
			req.path
		} successful on ${new Date().toLocaleString()}`
	);
	return res.status(200).json({
		success: true,
		message: 'Expense found',
		payload: expense,
	});
};

// Create new expense
export const createExpense = async (req, res) => {
	// Get user id from request
	const userId = req.userId;

	// Create query to create expense
	const query = {
		...req.body,
		userId,
	};

	// Create new expense in database using request data
	let newExpense;
	try {
		newExpense = await ExpenseModel.create(query);
	} catch (error) {
		// Handle database query error
		console.error(
			`User id ${userId} request at ${req.method} ${
				req.path
			} failed on ${new Date().toLocaleString()}\n${error.message}`
		);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	// Respond with new expense
	console.log(
		`User id ${userId} request at ${req.method} ${
			req.path
		} successful on ${new Date().toLocaleString()}`
	);
	return res.status(201).json({
		success: true,
		message: 'Expense created',
		payload: newExpense,
	});
};

// Update expense
export const updateExpense = async (req, res) => {
	// Get user id from request
	const userId = req.userId;

	// Get expense id from request path
	const expenseId = req.path.split('/').filter(Boolean)[1]; // ['expenses', 123]

	// Create filter to find expense
	const filter = {
		_id: expenseId,
		userId,
	};

	// Update expense in database
	let updatedExpense;
	try {
		updatedExpense = await ExpenseModel.findOneAndUpdate(
			filter,
			{
				$set: req.body,
			},
			{ new: true }
		);
	} catch (error) {
		// Handle database query error
		console.error(
			`User id ${userId} request at ${req.method} ${
				req.path
			} failed on ${new Date().toLocaleString()}\n${error.message}`
		);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	// Respond with updated expense
	console.log(
		`User id ${userId} request at ${req.method} ${
			req.path
		} successful on ${new Date().toLocaleString()}`
	);
	return res.status(200).json({
		success: true,
		message: 'Expense updated',
		payload: updatedExpense,
	});
};

// Delete expense
export const deleteExpense = async (req, res) => {
	// Get user id from request
	const userId = req.userId;

	// Get expense id from request path
	const expenseId = req.path.split('/').filter(Boolean)[1]; // ['expenses', 123]

	// Create filter to find expense
	const filter = {
		_id: expenseId,
		userId,
	};

	// Delete expense from database
	let result;
	try {
		result = await ExpenseModel.deleteOne(filter);
	} catch (error) {
		// Handle database query error
		console.error(
			`User id ${userId} request at ${req.method} ${
				req.path
			} failed on ${new Date().toLocaleString()}\n${error.message}`
		);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	// Handle expense not found error
	if (result.deletedCount === 0) {
		console.error(
			`User id ${userId} request at ${req.method} ${
				req.path
			} failed on ${new Date().toLocaleString()} : Expense not found`
		);
		return res.status(404).json({
			success: false,
			message: 'Expense not found',
		});
	}

	// Respond with success
	console.log(
		`User id ${userId} request at ${req.method} ${
			req.path
		} successful on ${new Date().toLocaleString()}`
	);
	return res.status(200).json({
		success: true,
		message: 'Expense deleted',
	});
};
