import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    number_card: {
        type: Number,
        required: true,
    },
    name_card :{
        type: String,
        required: true,
        unique: false
    },
    level_card: {
        type: String,
        required: true,
    },
    collection_card: {
        type: String,
        required: true,
    },
    status_card: {
        type: String,
        required: true,
    },
})

export default mongoose.model('Card', CardSchema);