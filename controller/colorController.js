import ColorModel from "../models/Color.js"

export const colors_get = async(req,res) => {
    try{
        const color = await ColorModel.find().sort({'_id' : -1})

        res.status(200).json({color})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const colors_add = async(req,res) => {
    try{
        const colorDoc = new ColorModel({
            name_color: req.body.name_color,
            date_color: ((req.body.date_color).substr(0, 10)).split("-").reverse().join("-"),
            collection_color: req.body.collection_color,
            summ_color: req.body.summ_color,
        })
        
        const color = await colorDoc.save()

        res.status(200).json({color})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const colors_edit = async(req,res) => {
    try{
        const color_edit = await ColorModel.findByIdAndUpdate(req.params.id, {
            name_color: req.body.name_color,
            date_color: ((req.body.date_color).substr(0, 10)).split("-").reverse().join("-"),
            collection_color: req.body.collection_color, 
            summ_color: req.body.summ_color,
        })
    
            res.status(200).json({
                color_edit,
            })
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const colors_delete = async(req,res) => {
    try{
        const deleteColor = await ColorModel.findByIdAndDelete(req.params.id)
            if(!deleteColor) {
                return res.status(404).send({
                    message: 'Такой краски нет'
                })
            }

        res.status(200).json({deleteColor})
    }
    catch(err){
        res.status(500).json({...err})
    }
}