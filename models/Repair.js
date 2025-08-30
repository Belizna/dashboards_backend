import mongoose from "mongoose";

const RepairSchema = new mongoose.Schema({
    date_repair :{
        type: String,
        required: true,
    },
    name_repair: {
        type: String,
        required: true
    },
    category_repair: {
        type: String,
        required: true
    },
    sum_repair: {
        type: Number,
        required: true
    }
})

export default mongoose.model('Repair', RepairSchema);