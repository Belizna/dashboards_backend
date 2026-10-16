import mongoose from "mongoose";

const BeybladeSchema = new mongoose.Schema({
    name_beyblade: {
        type: String,
        required: true,
        unique: true
    },
    summ_beyblade: {
        type: Number,
    },
    series: {
        type: String,
        required: true
    },
    status_beyblade: {
        type: String,
    },
    hashImage_beyblade: {
        type: String,
    },
})

export default mongoose.model('Beyblade', BeybladeSchema);