import GamesModel from '../models/Games.js'
import PulseModel from '../models/Pulse.js'

export const delete_games = async (req,res) => {
    try {
        const delete_games = await GamesModel.
        findByIdAndDelete(req.params.id)

        await PulseModel.deleteMany({id_object: req.params.id})

        res.status(200).json({delete_games})
        
    }catch(err) {
        res.status(500).json({
            err
        })
}
}

export const edit_games = async(req,res) => {
    try {
        
        const games = await GamesModel.findById(req.params.id)
        
        if(games.presence === 'Не Пройдено' && req.body.presence === 'Пройдено')
        {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.game_name,
                category_pulse: 'games',
                time_pulse: req.body.time_game,
                id_object: req.params.id

            })
            
            await pulseDoc.save()
        }
        else if(games.presence === 'Пройдено' && req.body.presence === 'Не Пройдено')
        {
            await PulseModel.deleteMany({id_object:req.params.id})
        }
        else {
            await PulseModel.updateMany({id_object: req.params.id}, 
                {
                    name_pulse: req.body.game_name,
                    time_pulse: req.body.time_game,
                })
        }

        const libraryGames = await GamesModel.findByIdAndUpdate(req.params.id, {
            game_name : req.body.game_name,
            summ_game: req.body.summ_game,
            compilation:req.body.compilation,
            date_game :((req.body.date_game).substr(0, 10)).split("-").reverse().join("-"),
            presence: req.body.presence,
            time_game: Number(req.body.time_game)
        })

        res.status(200).json({
            libraryGames,
        })

    }catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const add_games = async(req,res) => {
    try {

        var daysUTC_3 = new Date(req.body.date_game)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const libraryGamesdoc = new GamesModel({
            game_name : req.body.game_name,
            summ_game: req.body.summ_game,
            compilation:req.body.compilation,
            date_game : daysUTC_3,
            presence: req.body.presence,
            time_game: req.body.time_game
        })

        const libraryGames = await libraryGamesdoc.save()

        const pulseDoc = new PulseModel({
            date_pulse: new Date((req.body.date_game)),
            name_pulse: req.body.game_name,
            category_pulse: 'games_price',
            sum_pulse: req.body.summ_game,
            id_object: libraryGames._id.toString()
        })
        
        await pulseDoc.save()

        res.status(200).json({
            libraryGames
        })

    }catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const get_games =  async (req,res) => {
    try {
        const libraryGames = await GamesModel.find({
            compilation: req.params.library_name
        })

        if(!libraryGames)
        {
            return res.status(404).send({message: 'Игр не найдено'})
        }


        res.status(200).json({
            libraryGames
        })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}