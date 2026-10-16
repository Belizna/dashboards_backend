import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true
        },

        comment: {
            type: String,
            default: ''
        }
    }
);

export default mongoose.model('Expense', expenseSchema);