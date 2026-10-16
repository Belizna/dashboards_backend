import mongoose from "mongoose";

const MirfSchema = new mongoose.Schema({
    book_name: {
        type: String,
        required: true,
    },
    compilation: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    is_presence: {
        type: String,
        required: true
    },
    is_read:
    {
        type: String,
        required: true
    },
    image:
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

export default mongoose.model('Mirf', MirfSchema);