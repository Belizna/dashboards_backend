import mongoose from "mongoose";

const BookFilterSchema = new mongoose.Schema({
    compilation: {
        type: String,
        required: true,
        unique: true
    },
    key: {
        type: String,
    }
})

export default mongoose.model('BooksFilter', BookFilterSchema);