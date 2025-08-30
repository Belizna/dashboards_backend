import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema({
    id: { type: String, },
    value: {
        title: String
    },
    children: []
})

export default mongoose.model('Person', PersonSchema);