import RepairModel from "../models/Repair.js";


export const repair_get = async (req, res) => {
    try {
        var filteredList = []
        const repair = await RepairModel.find({"category_repair" : {$ne :"Сбережение"}}).sort({'_id' : -1})

        repair.map(arr => 
            filteredList.push({text: arr.category_repair, value: arr.category_repair}))

        let filter = [...new Set(filteredList.map(JSON.stringify))].map(JSON.parse);

        res.status(200).json({
            repair, filter
        })
    }
    catch(err) {
        res.status(500).json({...err})
    }
}

export const repair_add = async (req, res) => {
    try {
        
        const repairDoc = new RepairModel({
            date_repair : ((req.body.date_repair).substr(0, 10)).split("-").reverse().join("-"),
            name_repair : req.body.name_repair,
            category_repair : req.body.category_repair,
            sum_repair : req.body.sum_repair
        })

        await repairDoc.save()
        
        res.status(200).json({
            repairDoc
        })
    }
    catch(err) {
        res.status(500).json({...err})
    }
}

export const repair_edit = async (req, res) => {
    try {
        
        const repair_edit = await RepairModel.findByIdAndUpdate(req.params.id, {
            date_repair : ((req.body.date_repair).substr(0, 10)).split("-").reverse().join("-"),
            name_repair : req.body.name_repair,
            category_repair : req.body.category_repair,
            sum_repair : req.body.sum_repair
        })
    
            res.status(200).json({
                repair_edit,
            })
    }
    catch(err) {
        res.status(500).json({...err})
    }
}

export const repair_delete = async(req,res) => {
    try{
        const deleteRepair = await RepairModel.findByIdAndDelete(req.params.id)
            if(!deleteRepair) {
                return res.status(404).send({
                    message: 'Не найдено'
                })
            }

        res.status(200).json({deleteRepair})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const repair_sum = async (req,res) => {
    try{    
            const repair = await RepairModel.find({"category_repair" : "Сбережение"})
            
            switch(req.body.option) {
                case "-" :
                    {
                        const new_sum = repair[0].sum_repair - req.body.sum < 0 ? 
                        0 : 
                        repair[0].sum_repair - req.body.sum

                        await RepairModel.updateMany({"category_repair" : "Сбережение"},{
                            sum_repair : new_sum})
                        break;
                    }
                case "+": 
                {
                    const new_sum = repair[0].sum_repair + req.body.sum 
                    await RepairModel.updateMany({"category_repair" : "Сбережение"},{
                        sum_repair : new_sum})
                    break;
                }
                default:
                    break
            }

        res.status(200).json({})
    }
    catch(err){
        res.status(500).json({...err})
    }
}