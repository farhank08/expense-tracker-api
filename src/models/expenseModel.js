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
		title: {
			type: String,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
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
		purchasedAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Expense', expenseSchema);
