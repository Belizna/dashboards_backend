import mongoose from "mongoose";

const BookmarksSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    cycle: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

export default mongoose.model('Bookmarks', BookmarksSchema);