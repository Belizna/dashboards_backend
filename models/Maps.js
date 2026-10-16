import mongoose from "mongoose";


const MapsSchema = new mongoose.Schema({
    adress: {
        type: String,
        required: true
    },
    date_maps :{
        type: String,
        required: true
    },
    coordinates: {
        type: Array,
        required: true
    },
    image_hash: {
        type: String,
        required: true
    }
})

export default mongoose.model('Maps', MapsSchema);
