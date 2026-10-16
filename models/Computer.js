import mongoose from "mongoose";

const ComputerSchema = new mongoose.Schema({
    components_name: {
        type: String,
        required: true,
        unique: true
    },
    components_summ: {
        type: Number,
        required: true
    },
    category:
    {
        type: String,
        required: true
    },
    categorychapter:
    {
        type: String,
        required: true
    },
    date_buy: {
        type: String,
        required: true
    }
})

export default mongoose.model('Computer', ComputerSchema);