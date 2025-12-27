import mongoose from "mongoose";

const BookDiffSchema = new mongoose.Schema({
    book_name :{
        type: String,
        required: true,
        unique: true
    },
    summ_book: {
        type: Number,
    },
    presence: {
        type: String,
        required: true
    },
    compilation:
    {
        type: String,
        required: true
    }
})

export default mongoose.model('BooksDiff', BookDiffSchema);