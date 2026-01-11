import mongoose from "mongoose";

const TopsScratchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    image_key:
    {
        type: String,
        required: true
    },
    category:
    {
        type: String,
        required: true
    }
})

export default mongoose.model('TopsScratch', TopsScratchSchema);