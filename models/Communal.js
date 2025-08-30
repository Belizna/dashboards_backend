import mongoose from "mongoose";

const CommunalSchema = new mongoose.Schema({
    date_communal :{
        type: String,
        required: true,
        unique: true
    },
    summ_communal: {
        type: Number,
        required: true
    },
})

export default mongoose.model('Communal', CommunalSchema);