import mongoose from "mongoose";

const EarlyPaymentsSchema = new mongoose.Schema({

    date_earlyPayment:{
        type: String,
        required: true
    },
    summ_earlyPayment:{
        type: Number,
        required: true
    },
    EPcredit_name: {
        type: String,
        required: false
    }
})

export default mongoose.model('EarlyPayments', EarlyPaymentsSchema)