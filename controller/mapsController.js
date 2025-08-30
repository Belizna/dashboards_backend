import MapsModel from '../models/Maps.js'
import PulseModel from '../models/Pulse.js'

export const add_maps = async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.date_maps)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const mapsDoc = new MapsModel({
            adress: req.body.adress,
            coordinates: req.body.coordinates,
            compilation: req.body.compilation,
            date_maps: daysUTC_3,
            image_hash: req.body.image_hash,
        })

        const maps = await mapsDoc.save()

        const pulseDoc = new PulseModel({
            date_pulse: new Date((req.body.date_maps)),
            name_pulse: req.body.adress,
            category_pulse: 'maps',
            id_object: maps._id.toString()
        })

        await pulseDoc.save()

        res.status(200).json({
            maps
        })

    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const get_maps = async (req, res) => {
    try {
        const maps = await MapsModel.find()

        if (!maps) {
            return res.status(404).send({ message: 'maps не найдено' })
        }


        res.status(200).json({
            maps
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}