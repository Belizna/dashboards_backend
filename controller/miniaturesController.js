import MiniatureModel from "../models/Miniature.js"
import PulseModel from "../models/Pulse.js"

export const miniatures_get = async(req,res) => {
    try{
        const miniatures = await MiniatureModel.find()

        res.status(200).json({miniatures})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const miniatures_add = async(req,res) => {
    try{

        var daysUTC_3 = new Date(req.body.date_buy_miniature)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const miniatureDoc = new MiniatureModel({
            miniature_name: req.body.miniature_name,
            date_buy_miniature: daysUTC_3,
            //date_buy_miniature: req.body.date_buy_miniature
            price_miniature: req.body.price_miniature,
            collection_miniature: req.body.collection_miniature,
            count_miniatures: req.body.count_miniatures,
            count_miniatures_color: req.body.count_miniatures_color,
            procent_miniatures_color: Number((req.body.count_miniatures_color * 100 / 
            req.body.count_miniatures).toFixed(2)),
        })
        
        const miniature = await miniatureDoc.save()

        const pulseDoc = new PulseModel({
            date_pulse: new Date((req.body.date_buy_miniature)),
            name_pulse: req.body.miniature_name,
            category_pulse: 'miniatures_price',
            sum_pulse: req.body.price_miniature,
            id_object: miniature._id.toString()
        })
        
        await pulseDoc.save()

        res.status(200).json({miniature})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const miniatures_edit = async(req,res) => {
    try{

        const miniature = await MiniatureModel.findById(req.params.id)

        if(miniature.count_miniatures_color < req.body.count_miniatures_color)
        {
            for(let i = 0; i < (req.body.count_miniatures_color - miniature.count_miniatures_color); i++)
            {
                const pulseDoc = new PulseModel({
                    date_pulse: Date.now(),
                    name_pulse: req.body.miniature_name,
                    category_pulse: 'miniature',
                    id_object: req.params.id
                })
                
                await pulseDoc.save()
            }
        }
        else if (miniature.count_miniatures_color > req.body.count_miniatures_color)
        {
            for(let i = 0; i < (miniature.count_miniatures_color - req.body.count_miniatures_color); i++)
            {
                await PulseModel.deleteOne({id_object:req.params.id})   
            }
        }
        else {
            await PulseModel.updateMany({id_object: req.params.id}, 
                {
                    name_pulse: req.body.miniature_name,
                })
        }

        const miniature_edit = await MiniatureModel.findByIdAndUpdate(req.params.id, {
            miniature_name: req.body.miniature_name,
            date_buy_miniature: ((req.body.date_buy_miniature).substr(0, 10)).split("-").reverse().join("-"),
            price_miniature: req.body.price_miniature,
            collection_miniature: req.body.collection_miniature,
            count_miniatures: req.body.count_miniatures,
            count_miniatures_color: req.body.count_miniatures_color,
            procent_miniatures_color: Number((req.body.count_miniatures_color * 100 / 
            req.body.count_miniatures).toFixed(2)),
        })
    
            res.status(200).json({
                miniature_edit,
            })
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const miniatures_delete = async(req,res) => {
    try{
        const deleteMiniature = await MiniatureModel.findByIdAndDelete(req.params.id)
            if(!deleteMiniature) {
                return res.status(404).send({
                    message: 'Такой миниатюры нет'
                })
            }

        await PulseModel.deleteMany({id_object: req.params.id})
        res.status(200).json({deleteMiniature})
    }
    catch(err){
        res.status(500).json({...err})
    }
}