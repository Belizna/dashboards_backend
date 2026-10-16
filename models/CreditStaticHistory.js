import mongoose from "mongoose";

const CreditStaticHistorySchema = new mongoose.Schema({
    //процент выплаты по месяцам
    procent_date :[],
    //процент выплаты суммы
    procent_summ: [],
    //процент экономии
    procent_econom: [],
})

export default mongoose.model('CreditStaticHistory', CreditStaticHistorySchema);