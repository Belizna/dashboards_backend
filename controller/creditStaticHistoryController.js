import CreditStaticHistory from "../models/CreditStaticHistory.js";

export const credit_get_history = async (req, res) => {
    try {
        
        const creditHistory = await CreditStaticHistory.find()

        res.status(200).json({ creditHistory })

    } catch (err) {
        res.status(500).json({ ...err })
    }
}

export const credit_add_history = async (req, res) => {
    try {

        var arr = [req.body]

        for (var i = 1; i >= 0; i--) {
            var modelStatic = {
                date: new Date().toLocaleDateString('en-GB'),
                value: arr[0].procent_date[i].value,
                category: arr[0].procent_date[i].name
            }
            await CreditStaticHistory.updateOne({ _id: "6857a17c58e9371daf304274" }, { $addToSet: { procent_date: modelStatic } })
        }

        for (var i = 1; i >= 0; i--) {
            var modelStatic = {
                date: new Date().toLocaleDateString('en-GB'),
                value: arr[0].procent_summ[i].value,
                category: arr[0].procent_summ[i].name
            }
            await CreditStaticHistory.updateOne({ _id: "6857a17c58e9371daf304274" }, { $addToSet: { procent_summ: modelStatic } })
        }

        for (var i = 1; i >= 0; i--) {
            var modelStatic = {
                date: new Date().toLocaleDateString('en-GB'),
                value: arr[0].procent_econom[i].value,
                category: arr[0].procent_econom[i].name
            }
            await CreditStaticHistory.updateOne({ _id: "6857a17c58e9371daf304274" }, { $addToSet: { procent_econom: modelStatic } })
        }

        res.status(200).json({
            arr
        })
    }

    catch (err) {
        res.status(500).json({ ...err })
    }
}