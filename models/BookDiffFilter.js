import mongoose from "mongoose";

const BookDiffFilterSchema = new mongoose.Schema({
    compilation: {
        type: String,
        required: true,
        unique: true
    },
    key: {
        type: String,
    }
})

export default mongoose.model('BooksDiffFilter', BookDiffFilterSchema);