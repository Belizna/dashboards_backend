import mongoose from "mongoose";

const PulseScratchSchema = new mongoose.Schema({
    date_pulse :{
        type: Date,
        required: true,
    },
    name_pulse: {
        type: String,
        required: false
    },
    category_pulse: {
        type: String,
        required: true
    },
    id_object: {
        type: String,
        required: true
    }
})

export default mongoose.model('PulseScratch', PulseScratchSchema);