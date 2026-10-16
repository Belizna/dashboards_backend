import mongoose from "mongoose";

const AuthorFilterSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        unique: true
    },
    key: {
        type: String,
    }
})

export default mongoose.model('AuthorFilter', AuthorFilterSchema);