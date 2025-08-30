import EarlyPaymentsModel from "../models/EarlyPayments.js";
import PulseModel from "../models/Pulse.js";
import {validationResult} from 'express-validator'

export const get_early_payment = async(req,res) => {
    try {
        const early_payment = await EarlyPaymentsModel.find().sort({'_id': 1})
        
        if(!early_payment)
        {
            return res.status(404).send({
                message:"Досрочные платежи не найдены"
            })
        }

        res.status(200).json({
            early_payment
        })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}

export const add_early_payment = async(req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        var daysUTC_3 = new Date(req.body.date_earlyPayment)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const EarlyPaymentsDoc = new EarlyPaymentsModel({
            date_earlyPayment : daysUTC_3,
            summ_earlyPayment: req.body.summ_earlyPayment
        })

        const earlyPayments  = await EarlyPaymentsDoc.save()

        const pulseDoc = new PulseModel({
            date_pulse: new Date(req.body.date_earlyPayment),
            sum_pulse_credit: req.body.summ_earlyPayment,
            category_pulse: 'payments',
            id_object: String(earlyPayments._doc._id)
        })
        
        await pulseDoc.save()

        const pulseDocEarly = new PulseModel({
            date_pulse: new Date(req.body.date_earlyPayment),
            sum_pulse_credit: req.body.summ_earlyPayment,
            category_pulse: 'payments_early',
            id_object: String(earlyPayments._doc._id)
        })
        
        await pulseDocEarly.save()

        res.json({
            ...earlyPayments._doc
        })
    }
    catch(err){
        res.status(500).json({
            err
        })
    }
}

export const edit_early_payment = async (req,res) =>  {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const earleUpdate = await EarlyPaymentsModel.findByIdAndUpdate
        (req.params.id, {
            date_earlyPayment : ((req.body.date_earlyPayment).substr(0, 10)).split("-").reverse().join("-"),
            summ_earlyPayment: req.body.summ_earlyPayment
        })
        if(!earleUpdate)
        {
            return res.status(404).send({message: "Не найден платеж на обновление"})
        }

        await PulseModel.updateMany({id_object: req.params.id}, 
            {
                sum_pulse_credit: req.body.summ_earlyPayment,
                date_pulse: new Date(req.body.date_earlyPayment)
            })

        res.status(200).json({
            earleUpdate
        })

    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}


export const delete_early_payment =  async (req, res) => {
    try {
        const deleteEarlyPay = await EarlyPaymentsModel.
        findByIdAndDelete(req.params.id)
        if(!deleteEarlyPay)
        {
            return res.status(404).send({
                message:'Досрочный платеж не найден'
            })
        }

        await PulseModel.deleteMany({id_object: req.params.id})

        res.json({
            deleteEarlyPay
        })

    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}