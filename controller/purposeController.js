import PurposeModel from "../models/Purpose.js"


export const purpose_get = async (req, res) => {
    try {

        const purpose = await PurposeModel.find()

        res.status(200).json({ purpose })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const purpose_add = async (req, res) => {
    try {

        const purposeDoc = new PurposeModel({
            purpose_key: req.body.purpose_key,
            purpose_name: req.body.purpose_name,
            purpose_count: req.body.purpose_count,
            purpose_year: req.body.purpose_year,
        })

        const purpose = await purposeDoc.save()

        res.status(200).json({ purpose })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const purpose_edit = async (req, res) => {
    try {

        const purpose_edit = await PurposeModel.findByIdAndUpdate(req.params.id, {
            purpose_key: req.body.purpose_key,
            purpose_name: req.body.purpose_name,
            purpose_count: req.body.purpose_count,
            purpose_year: req.body.purpose_year,
        })

        res.status(200).json({
            purpose_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const purpose_delete = async (req, res) => {
    try {
        const deletePurpose = await PurposeModel.findByIdAndDelete(req.params.id)
        if (!deletePurpose) {
            return res.status(404).send({
                message: 'Такой краски нет'
            })
        }

        res.status(200).json({ deletePurpose })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}