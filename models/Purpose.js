import mongoose from "mongoose";

const PurposeSchema = new mongoose.Schema({
    purpose_key: {
        type: String,
        required: true,
        unique: true
    },
    purpose_name: {
        type: String,
    },
    purpose_count: {
        type: Number,
        required: true
    },
    purpose_year: {
        type: Number,
        required: true
    },
})

export default mongoose.model('Purpose', PurposeSchema);