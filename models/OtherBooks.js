import mongoose from "mongoose";

const OtherBooksSchema = new mongoose.Schema({
    book_name :{
        type: String,
        required: true,
        unique: true
    },
    author_book: {
        type: Number,
    },
    cycle_book: {
        type: String,
        required: true
    },
    status_book:
    {
        type: String,
        required: true
    }
})

export default mongoose.model('OtherBooks', OtherBooksSchema);