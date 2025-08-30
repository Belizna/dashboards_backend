import mongoose from "mongoose";

const PaymentsSchema = new mongoose.Schema({
    date_payment: {
        type:String, 
        required:true
    },
    summ_payment: {
        type:Number,
        required: true,
    },
    status_payment:{
        type: String, 
        required: true,
        default: 'Не оплачено'
    },
    Pcredit_name: {
        type: String,
        required: false
    }
})

export default mongoose.model('Payments', PaymentsSchema)