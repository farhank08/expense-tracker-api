import mongoose from 'mongoose';

const categoryEnums = [
	'Groceries',
	'Leisure',
	'Electronics',
	'Utilities',
	'Clothing',
	'Health',
	'Others',
];

const expenseSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: true,
			enum: categoryEnums,
			default: 'Others',
		},
		cost: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			trim: true,
		},
		purchasedAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		userId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Expense', expenseSchema);
