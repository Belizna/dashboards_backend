import mongoose from "mongoose";

const NormaSchema = new mongoose.Schema({
    month_norma :{
        type: String,
        required: true,
        unique: true
    },
    time_norma: {
        type: Number,
    }
})

export default mongoose.model('Norma', NormaSchema);