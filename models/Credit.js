import mongoose from "mongoose";

const CreditSchema = new mongoose.Schema({
    //наименование средита
    credit_name :{
        type: String,
        required: true,
        unique: true
    },//сумма кредита
    summ_credit: {
        type: Number,
        required: true
    },//дата оформления
    date_credit: {
        type: String,
        required: true
    },//процент
    percent :{
        type: Number,
        required: true
    },//срок в месяцах
    term : {
        type:Number,
        required: true
    },//общий долг с процентами 
    duty: {
        type: Number,
        required: false
    }
})

export default mongoose.model('Credit', CreditSchema);