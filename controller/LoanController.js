import LoanModel from "../models/Loan.js";
import HistoryLoan from "../models/HistoryLoan.js";

export const loan_add = async (req, res) => {
    try {

        const history_loan = await HistoryLoan.find().sort({ '_id': -1 }).limit(1)

        const loanDoc = new LoanModel({
            summ_loan: req.body.summ_loan,
            bank: req.body.bank,
        })

        const loan = await loanDoc.save()

        const history_loanDoc = new HistoryLoan({
            date_loan: Date.now(),
            summ_loan: Number(req.body.summ_loan) + Number(history_loan[0].summ_loan),
        })

        await history_loanDoc.save()

        res.status(200).json({ loan })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const loan_get = async (req, res) => {
    try {

        const history_loan = await HistoryLoan.find().sort({ '_id': 1 })

        const loan = await LoanModel.find().sort({ '_id': -1 })

        var summLoans = 0

        loan.map(l => summLoans += l.summ_loan)

        res.status(200).json({ loan, summLoans, history_loan })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const loan_edit = async (req, res) => {
    try {

        var history_loanDoc

        const history_loan = await HistoryLoan.find().sort({ '_id': -1 }).limit(1)

        const loan_id = await LoanModel.findById(req.params.id)

        const loan = await LoanModel.findByIdAndUpdate(req.params.id,
            {
                summ_loan: req.body.summ_loan,
                bank: req.body.bank,
            })

        if (loan_id.summ_loan > req.body.summ_loan) {
            history_loanDoc = new HistoryLoan({
                date_loan: Date.now(),
                summ_loan: Number(history_loan[0].summ_loan) - Number(Math.abs(Number(loan_id.summ_loan) - Number(req.body.summ_loan))),
            })
        }
        else {
            history_loanDoc = new HistoryLoan({
                date_loan: Date.now(),
                summ_loan: Number(history_loan[0].summ_loan) + Number(Math.abs(Number(loan_id.summ_loan) - Number(req.body.summ_loan))),
            })
        }
        await history_loanDoc.save()

        res.status(200).json({ loan })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const loan_delete = async (req, res) => {
    try {

        const history_loan = await HistoryLoan.find().sort({ '_id': -1 }).limit(1)

        const loan_id = await LoanModel.findById(req.params.id)

        const deleteloan = await LoanModel.findByIdAndDelete(req.params.id)
        if (!deleteloan) {
            return res.status(404).send({
                message: 'Такого займа не найдено'
            })
        }

        const history_loanDoc = new HistoryLoan({
            date_loan: Date.now(),
            summ_loan: Number(history_loan[0].summ_loan) - (Number(loan_id.summ_loan)),
        })

        await history_loanDoc.save()

        res.status(200).json({ deleteloan })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}