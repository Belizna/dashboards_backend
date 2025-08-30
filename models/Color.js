import mongoose from "mongoose";

const ColorSchema = new mongoose.Schema({
    name_color :{
        type: String,
        required: true,
        unique: false
    },
    date_color: {
        type: String,
        required: true,
    },
    collection_color: {
        type: String,
        required: true,
    },
    summ_color: {
        type: Number,
        required: true
    },
})

export default mongoose.model('Color', ColorSchema);