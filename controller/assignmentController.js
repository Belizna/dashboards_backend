import AssignmentModel from '../models/Assignment.js'


export const assignment_get = async (req, res) => {
    try {
        const assignment = await AssignmentModel.find({assignment_employee: req.params.assignment_employee})

        res.status(200).json({ assignment })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const assignment_add = async (req, res) => {
    try {
        
        var daysUTC_3 = new Date(req.body.assignment_date)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const assignmentDoc = new AssignmentModel({
            assignment_date: daysUTC_3,
            assignment_name: req.body.assignment_name,
            assignment_status: req.body.assignment_status,
            assignment_priority: req.body.assignment_priority,
            assignment_task: req.body.assignment_task,
            assignment_employee: req.params.assignment_employee,
        })
        const assignment = await assignmentDoc.save()

        res.status(200).json({
            assignment,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const assignment_delete = async (req, res) => {
    try {

        const deleteAssignment = await AssignmentModel.findByIdAndDelete(req.params.id)
        
        if (!deleteAssignment) {
            return res.status(404).send({
                message: 'Такой задачи нет'
            })
        }

        res.status(200).json({ deleteAssignment })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const assignment_edit = async (req, res) => {
    try {

        const assignment_edit = await AssignmentModel.findByIdAndUpdate(req.params.id, {
            assignment_date: ((req.body.assignment_date).substr(0, 10)).split("-").reverse().join("-"),
            assignment_name: req.body.assignment_name,
            assignment_status: req.body.assignment_status,
            assignment_priority: req.body.assignment_priority,
            assignment_task: req.body.assignment_task
        })

        res.status(200).json({
            assignment_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}