import mongoose from "mongoose";

const BonusDaysSchema = new mongoose.Schema({
    date_bonus :{
        type: String,
        required: true,
        unique: true
    },
    time_bonus: {
        type: Number,
        required: true,
    }
})

export default mongoose.model('BonusDays', BonusDaysSchema);