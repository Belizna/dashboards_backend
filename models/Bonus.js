import mongoose from "mongoose";

const BonusSchema = new mongoose.Schema({
    date_bonus :{
        type: String,
        required: true,
        unique: true
    },
    time_bonus: {
        type: Number,
        required: true,
    },
    summ_bonus: {
        type: Number,
        required: true
    },
    status_bonus :{
        type: String,
    },
})

export default mongoose.model('Bonus', BonusSchema);