import ComicsModel from "../models/Comics.js"
import PulseModel from "../models/Pulse.js"

export const comics_get = async(req,res) => {
    try{
        const comics = await ComicsModel.find({
            collection_comics: req.params.collection_comics
        })

        res.status(200).json({comics})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const comics_add = async(req,res) => {
    try{
        const comicsDoc = new ComicsModel({
            name_comics: req.body.name_comics,
            collection_comics: req.body.collection_comics,
            count_chapters: req.body.count_chapters,
            count_read_chapters: req.body.count_read_chapters,
            procent_read_chapters: Number((req.body.count_read_chapters * 100 / 
            req.body.count_chapters).toFixed(2)),
        })
        
        const comics = await comicsDoc.save()

        res.status(200).json({comics})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const comics_edit = async(req,res) => {
    try{

        const comics = await ComicsModel.findById(req.params.id)

        if(comics.count_read_chapters < req.body.count_read_chapters)
        {
            for(let i = 1; i <= (req.body.count_read_chapters - comics.count_read_chapters); i++)
            {
                const pulseDoc = new PulseModel({
                    date_pulse: Date.now(),
                    name_pulse: `${req.body.name_comics} глава ${comics.count_read_chapters+i}`,
                    category_pulse: 'comics',
                    id_object: req.params.id
                })
                
                await pulseDoc.save()
            }
        }
        else if (comics.count_read_chapters > req.body.count_read_chapters)
        {
            for(let i = 0; i < (comics.count_read_chapters - req.body.count_read_chapters); i++)
            {
                await PulseModel.deleteOne({id_object:req.params.id})   
            }
        }
        else {
            await PulseModel.updateMany({id_object: req.params.id}, 
                {
                    name_pulse: req.body.name_comics,
                })
        }

        const comics_edit = await ComicsModel.findByIdAndUpdate(req.params.id, {
            name_comics: req.body.name_comics,
            count_chapters: req.body.count_chapters,
            count_read_chapters: req.body.count_read_chapters,
            procent_read_chapters: Number((req.body.count_read_chapters * 100 / 
            req.body.count_chapters).toFixed(2)),
        })
    
            res.status(200).json({
                comics_edit,
            })
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const comics_delete = async(req,res) => {
    try{
        const deleteComics = await ComicsModel.findByIdAndDelete(req.params.id)
            if(!deleteComics) {
                return res.status(404).send({
                    message: 'Такого комикса нет'
                })
            }

        await PulseModel.deleteMany({id_object: req.params.id})
        res.status(200).json({deleteComics})
    }
    catch(err){
        res.status(500).json({...err})
    }
}