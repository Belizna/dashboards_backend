import BeybladeModel from "../models/Beyblade.js"
import PulseModel from '../models/Pulse.js'

export const get_beyblade = async (req, res) => {
    try {
        const beyblade = await BeybladeModel.find({ series : req.params.beyblade_series })
        
        res.status(200).json({
            beyblade
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const edit_beyblade = async (req, res) => {
    try {
        const beyblade = await BeybladeModel.findById(req.params.id)

        if (req.body.status_beyblade === 'Куплено' && beyblade.status_beyblade === 'Нет') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.name_beyblade,
                sum_pulse: req.body.summ_beyblade,
                category_pulse: 'beyblade_price',
                id_object: req.params.id
            })

            await pulseDoc.save()
        }
        else if (req.body.status_beyblade === 'Нет' && beyblade.status_beyblade === 'Куплено') {
            await PulseModel.deleteMany({ id_object: req.params.id })
        }
        else {
            await PulseModel.updateMany({ id_object: req.params.id },
                {
                    name_pulse: req.body.name_beyblade,
                    sum_pulse: req.body.summ_beyblade,
                })
        }

        const beyblade_edit = await BeybladeModel
            .findByIdAndUpdate(req.params.id, {
                name_beyblade: req.body.name_beyblade,
                summ_beyblade: req.body.summ_beyblade,
                series: req.body.series,
                status_beyblade: req.body.status_beyblade,
            })
        res.status(200).json({
            beyblade_edit
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const delete_beyblade = async (req, res) => {
    try {

        const deleteBeyblade = await BeybladeModel.
            findByIdAndDelete(req.params.id)

        await PulseModel.deleteMany({ id_object: req.params.id })

        return res.status(200).json({
            deleteBeyblade
        })

    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const add_beyblade = async (req, res) => {
    try {

        const beybladeDoc = new BeybladeModel({
            name_beyblade: req.body.name_beyblade,
            summ_beyblade: req.body.summ_beyblade,
            series: req.body.series,
            status_beyblade: req.body.status_beyblade,
        })

        const beyblade = await beybladeDoc.save()

        if (req.body.status_beyblade === 'Куплено') {

            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.name_beyblade,
                category_pulse: 'beyblade_price',
                sum_pulse: req.body.summ_beyblade,
                id_object: String(beyblade._doc._id)
            })

            await pulseDoc.save()
        }
        res.status(200).json({
            ...beyblade._doc
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}