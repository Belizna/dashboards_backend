import mongoose from "mongoose";


const WriteBooksDiffSchema = new mongoose.Schema({
    book_name :{
        type: String,
        required: true,
        unique: true
    },
    format: {
        type: String,
    },
    collection_book: {
        type: String,
    },
    presence: {
        type: String,
        required: true
    },
    compilation:
    {
        type: String,
        required: true
    },
    author:
    {
        type: String,
        required: false
    }
})

export default mongoose.model('WriteBooksDiff', WriteBooksDiffSchema);
