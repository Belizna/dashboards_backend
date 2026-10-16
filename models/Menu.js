import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
    key: { type: String, },
    label: { type: String, },
    icon: { type: String, },
    children: []
})

export default mongoose.model('Menu', MenuSchema);