import mongoose from "mongoose";

const MiniatureSchema = new mongoose.Schema({
    miniature_name :{
        type: String,
        required: true,
    },
    date_buy_miniature: {
        type: String,
        required: false,
    },
    price_miniature: {
        type: Number,
        required: true,
    },
    collection_miniature:{
        type: String,
        required: true
    },
    count_miniatures:{
        type: Number,
        required: true
    },
    count_miniatures_color:{
        type: Number,
        required: true
    },
    procent_miniatures_color:{
        type: Number,
        required: true
    },
})

export default mongoose.model('Miniature', MiniatureSchema);