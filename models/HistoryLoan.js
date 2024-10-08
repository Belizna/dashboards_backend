import mongoose from "mongoose";

const HistoyLoanSchema = new mongoose.Schema({
    date_loan :{
        type: String,
        required: true,
    },
    summ_loan: {
        type: Number,
        required: true
    },
})

export default mongoose.model('HistoryLoan', HistoyLoanSchema);