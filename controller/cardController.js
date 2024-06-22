import CardModel from "../models/Card.js"
import PulseModel from '../models/Pulse.js'

export const get_card = async (req,res) => {
    try {       
        const card = await CardModel.find({collection_card: req.params.collection_card}).sort({'number_card' : 1})

        res.status(200).json({
            card
        })
    }
    catch(err) {
        res.status(500).json({
            err
        }) 
    }
}

export const edit_card = async (req,res) => {
    try{
        const card = await CardModel.findById(req.params.id)

        var collection_card_pulse = ''
        
        if (card.collection_card == 'Герои и Злодеи' || 
            card.collection_card == 'Герои и Злодеи. 2-я часть.' || 
            card.collection_card == 'Герои и Злодеи. 3-я часть.' ||
            card.collection_card == 'Герои и Злодеи. 4-я часть.' ){
            collection_card_pulse = 'Spider_Man'
        }
        else if (card.collection_card == 'Воины тени' || 
                 card.collection_card == 'Боевая четверка' || 
                 card.collection_card == 'Братья по оружию'){
            collection_card_pulse = 'Teenage_Mutant_Ninja'
        }
        else if (card.collection_card == 'Отчаянные бойцы' || 
                 card.collection_card == 'Отчаянные бойцы - Новая Вестроя'){
            collection_card_pulse = 'Bakugan'
        }
        else collection_card_pulse = card.collection_card

        if (req.body.status_card === 'Есть' && card.status_card ==='Нет' || card.status_card ==='Замена' ) {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.name_card,
                sum_pulse: req.body.summ_card,
                category_pulse: 'card_price',
                collection_card_pulse: collection_card_pulse,
                id_object: req.params.id
            })
            
            await pulseDoc.save()
        }
        else if (req.body.status_card === 'Нет' && card.status_card ==='Есть' || card.status_card ==='Замена')
        {
            await PulseModel.deleteMany({id_object:req.params.id})
        }
        else {
            await PulseModel.updateMany({id_object: req.params.id}, 
                {
                    name_pulse: req.body.name_card,
                    sum_pulse: req.body.summ_card,
                })
        }

        const card_edit = await CardModel
        .findByIdAndUpdate(req.params.id, {
            name_card : req.body.name_card,
            level_card : req.body.level_card,
            status_card : req.body.status_card,
            number_card: req.body.number_card,
            summ_card: req.body.summ_card,
        })
        res.status(200).json({
            card_edit
        })
}
catch(err) {
    res.status(500).json({
        err
    })
}
}

export const delete_card = async (req,res) => {
    try{

        const deleteCard = await CardModel.
        findByIdAndDelete(req.params.id)

        await PulseModel.deleteMany({id_object: req.params.id})

        return res.status(200).json({
            deleteCard
        })

    }catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const add_card = async (req,res) => {
    try{
        
        const cardDoc= new CardModel({
            number_card: req.body.number_card,
            name_card : req.body.name_card,
            level_card : req.body.level_card,
            collection_card : req.params.collection_card,
            status_card: req.body.status_card,
            summ_card: req.body.summ_card,
        })

        const card = await cardDoc.save()

        if (req.body.status_card === 'Есть') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.name_card,
                category_pulse: 'card_price',
                collection_card_pulse : req.params.collection_card,
                sum_pulse: req.body.summ_card,
                id_object: String(card._doc._id)
            })
            
            await pulseDoc.save()
        }
        res.status(200).json({
            ...card._doc
        })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}