import BonusModel from "../models/Bonus.js";
import NormaModel from "../models/Norma_time.js"
import PulseModel from '../models/Pulse.js'
import BonusDaysModel from "../models/BonusDays.js"

export const bonus_get = async (req, res) => {
    try {
        const bonus = await BonusModel.find().sort({ '_id': -1 })

        res.status(200).json({ bonus })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bonus_add = async (req, res) => {
    try {
        const zp = 304500

        var daysUTC_3 = new Date(req.body.date_bonus)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const norma_time = await NormaModel.find({ month_norma: daysUTC_3.substr(3, 7) })

        const bonusDoc = new BonusModel({
            date_bonus: daysUTC_3,
            time_bonus: req.body.time_bonus,
            summ_bonus: (zp / norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
            status_bonus: req.body.status_bonus
        })
        const bonus = await bonusDoc.save()

        const pulseDoc = new PulseModel({
            date_pulse: new Date((req.body.date_bonus)),
            name_pulse: `Подработка за ${req.body.date_bonus}`,
            category_pulse: 'bonus',
            sum_pulse: (zp / norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
            id_object: bonus._id.toString()
        })

        await pulseDoc.save()

        res.status(200).json({
            bonus,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bonus_delete = async (req, res) => {
    try {

        const deleteBonus = await BonusModel.findByIdAndDelete(req.params.id)
        if (!deleteBonus) {
            return res.status(404).send({
                message: 'Такой выплаты нет'
            })
        }

        await PulseModel.deleteMany({ id_object: req.params.id })
        res.status(200).json({ deleteBonus })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bonus_edit = async (req, res) => {
    try {
        const zp = 304500
        const norma_time = await NormaModel.find({ month_norma: (((req.body.date_bonus).substr(0, 10)).split("-").reverse().join("-")).substr(3, 7) })


        const bonus_edit = await BonusModel.findByIdAndUpdate(req.params.id, {
            date_bonus: ((req.body.date_bonus).substr(0, 10)).split("-").reverse().join("-"),
            time_bonus: req.body.time_bonus,
            summ_bonus: (zp / norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
            status_bonus: req.body.status_bonus
        })

        await PulseModel.updateMany({ id_object: req.params.id },
            {
                date_pulse: new Date((req.body.date_bonus)),
                name_pulse: `Подработка за ${req.body.date_bonus}`,
                sum_pulse: (zp / norma_time[0].time_norma * 2 * req.body.time_bonus).toFixed(2),
            })

        res.status(200).json({
            bonus_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bonus_days_get = async (req, res) => {
    try {
        const bonus_days = await BonusDaysModel.find().sort({ '_id': -1 })

        res.status(200).json({ bonus_days })

    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bonus_days_add = async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.date_bonus)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const bonusDoc = new BonusDaysModel({
            date_bonus: daysUTC_3,
            time_bonus: req.body.time_bonus,
        })
        const bonus = await bonusDoc.save()
        res.status(200).json({
            bonus,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bonus_days_delete = async (req, res) => {
    try {

        const deleteBonus = await BonusDaysModel.findByIdAndDelete(req.params.id)
        if (!deleteBonus) {
            return res.status(404).send({
                message: 'Такой выплаты нет'
            })
        }
        res.status(200).json({ deleteBonus })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bonus_days_edit = async (req, res) => {
    try {

        const bonus_edit = await BonusDaysModel.findByIdAndUpdate(req.params.id, {
            date_bonus: ((req.body.date_bonus).substr(0, 10)).split("-").reverse().join("-"),
            time_bonus: req.body.time_bonus,
        })

        res.status(200).json({
            bonus_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}