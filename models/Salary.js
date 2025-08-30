import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
    date_salary :{
        type: String,
        required: true,
        unique: true
    },
    summ_salary: {
        type: Number,
        required: true
    },
    company: {
        type: String,
        required: true,
    }
})

export default mongoose.model('Salary', SalarySchema);