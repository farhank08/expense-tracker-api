import { Router } from 'express';

import * as ExpenseController from '../controllers/expenseController.js';

// Initialize express router
const router = Router();

// Get (filtered) expenses route
router.get('/expenses', ExpenseController.getExpenses);

// Get expense by id route
router.get('/expenses/:id', ExpenseController.getExpenseById);

// Create expense route
router.post('/expenses', ExpenseController.createExpense);

// Update expense by id route
router.put('/expenses/:id', ExpenseController.updateExpense);

// Delete expense by id route
router.delete('/expenses/:id', ExpenseController.deleteExpense);

// Export router
export default router;
