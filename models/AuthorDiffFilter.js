import mongoose from "mongoose";

const AuthorDiffFilterSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        unique: true
    },
    key: {
        type: String,
    }
})

export default mongoose.model('AuthorDiffFilter', AuthorDiffFilterSchema);