import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
    summ_loan: {
        type: Number,
        required: true
    },
    bank: {
        type: String,
        required: true,
    }
})

export default mongoose.model('Loan', LoanSchema);