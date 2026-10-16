import ExpenseModel from "../models/Expense.js"

export const expense_get = async (req, res) => {
    try {

        const expense = await ExpenseModel.find()


        res.status(200).json({ expense })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const expense_add = async (req, res) => {
    try {

        const expenseDoc = new ExpenseModel({
            date: req.body.date,
            amount: req.body.amount,
            category: req.body.category,
            comment: req.body.comment,
        })

        const expense = await expenseDoc.save()

        res.status(200).json({ expense })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const expense_edit = async (req, res) => {
    try {

        const expense_edit = await ExpenseModel.findByIdAndUpdate(req.params.id, {
            date: req.body.date,
            amount: req.body.amount,
            category: req.body.category,
            comment: req.body.comment,
        })

        res.status(200).json({
            expense_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const expense_delete = async (req, res) => {
    try {
        const deleteExpense = await ExpenseModel.findByIdAndDelete(req.params.id)
        if (!deleteExpense) {
            return res.status(404).send({
                message: 'Такой краски нет'
            })
        }

        res.status(200).json({ deleteExpense })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}