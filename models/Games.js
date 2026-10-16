import mongoose from 'mongoose'

const GamesSchema = new mongoose.Schema({
    game_name :{
        type: String,
        required: true,
        unique: true
    },
    summ_game: {
        type: Number,
    },
    compilation:
    {
        type: String,
        required: true
    },
    date_game :{
        type: String,
    },
    presence: {
        type: String,
        required: true
    },
    time_game: {
        type: Number
    },

})

export default mongoose.model('Games', GamesSchema)