import JobsMounthModel from "../models/JobsMounth.js"

export const jobsMonthUpdate = async (req, res) => {

    try {

        const jobsEdit = await JobsMounthModel
            .findByIdAndUpdate(req.params.id, {
                modal_view: true
            })

        res.status(200).json({
            jobsEdit
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}