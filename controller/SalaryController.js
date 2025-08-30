import SalaryModel from "../models/Salary.js";
import PulseModel from '../models/Pulse.js'

export const salary_add = async(req,res) => {
    try{

        var daysUTC_3 = new Date(req.body.date_salary)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        const salaryDoc = new SalaryModel({
            date_salary: daysUTC_3,
            summ_salary: req.body.summ_salary,
            company: req.body.company,
        })

        const salary = await salaryDoc.save()

        const pulseDoc = new PulseModel({
            date_pulse: req.body.date_salary,
            category_pulse: 'salary',
            sum_pulse_salary: req.body.summ_salary,
            id_object: String(salary._doc._id)

        })
        await pulseDoc.save()

        res.status(200).json({salary})
}
catch(err){
    res.status(500).json({...err})
}
}

export const salary_get = async(req,res) => {
    try{

        const salary = await SalaryModel.find().sort({'_id': -1})

        res.status(200).json({salary})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const salary_edit = async(req,res) => {
    try{

        const salary = await SalaryModel.findByIdAndUpdate(req.params.id, 
            {
                date_salary: ((req.body.date_salary).substr(0, 10)).split("-").reverse().join("-"),
                summ_salary: req.body.summ_salary,
                company: req.body.company,
            })

        await PulseModel.updateMany({id_object: req.params.id}, {
            sum_pulse_salary: req.body.summ_salary,
            date_pulse: req.body.date_salary,
        })

        res.status(200).json({salary})
    }
    catch(err){
        res.status(500).json({...err})
    }
}

export const salary_delete = async(req,res) => {
    try{

        const deleteSalary = await SalaryModel.findByIdAndDelete(req.params.id)
            if(!deleteSalary) {
                return res.status(404).send({
                    message: 'Такого платежа нет'
                })
            }

        await PulseModel.deleteMany({id_object: req.params.id})

        res.status(200).json({deleteSalary})
    }
    catch(err){
        res.status(500).json({...err})
    }
}