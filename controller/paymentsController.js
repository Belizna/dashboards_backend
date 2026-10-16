import {validationResult} from 'express-validator'
import PaymentsModel from '../models/Payments.js'
import PulseModel from '../models/Pulse.js'

export const get_payments = async (req,res) => {
    try {
            const payments = await PaymentsModel.find().sort({'_id': 1})
            if(!payments)
            {
                return res.status(404).send({
                    message:"Платежи не найдены"
                })
            }
            else {
                return res.status(200).json({
                    payments
                })
            }
    }
    catch(err)
    {
        res.status(400).json({
            err
        })
    }
}

export const update_payment = async (req, res) => {
    try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }
            const payments = await PaymentsModel.findById(req.params.id)
            
            if(payments.status_payment === 'Не оплачено' && req.body.status_payment === 'Оплачено')
            {
            const pulseDoc = new PulseModel({
                date_pulse: new Date(((payments.date_payment).substr(0, 10).split("-").reverse().join("-"))),
                sum_pulse_credit: req.body.summ_payment,
                category_pulse: 'payments',
                id_object: req.params.id
            })
            
            await pulseDoc.save()
        }
        else if (payments.status_payment === 'Оплачено' && req.body.status_payment === 'Не оплачено')
        {
            await PulseModel.deleteMany({id_object: req.params.id})
        }
        else {
            await PulseModel.updateMany({id_object: req.params.id}, 
                {
                    sum_pulse_credit: req.body.summ_payment
                })
        }
            const updatePayments = await PaymentsModel.
            findByIdAndUpdate(req.params.id, {
                summ_payment: req.body.summ_payment,
                status_payment: req.body.status_payment  
            })
            res.json({
                updatePayments
            })
    }
    catch(err) {
        res.status(500).json({
            err
        })
    }
}


export const delete_payment = async (req,res) => {
    try {
            const deletePayments = await PaymentsModel.
            findByIdAndDelete(req.params.id)
            if(!deletePayments) {
                return res.status(404).send({
                    message: 'Такого платежа нет'
                })
            }
            res.json({
                deletePayments
            })
    }
    catch(err){
        res.status(500).json({
            err
        })
    }
}