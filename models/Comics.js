import mongoose from "mongoose";

const ComicsSchema = new mongoose.Schema({
    name_comics :{
        type: String,
        required: true,
    },
    collection_comics: {
        type: String,
        required: true,
    },
    count_chapters:{
        type: Number,
        required: true
    },
    count_read_chapters:{
        type: Number,
        required: true
    },
    procent_read_chapters:{
        type: Number,
        required: false
    },
})

export default mongoose.model('Comics', ComicsSchema);