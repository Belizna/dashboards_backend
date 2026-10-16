import PurposeModel from "../models/Purpose.js"
import PulseModel from '../models/Pulse.js'

export const purpose_get = async (req, res) => {
    try {

        const purpose = await PurposeModel.find()

        const pulse = await PulseModel.aggregate([
            {
                $group: {
                    _id: {
                        category_pulse: "$category_pulse", date_pulse: { $substr: ["$date_pulse", 0, 4] },
                    },
                    sum: { $sum: 1 },
                    sum_pulse: { $sum: "$sum_pulse" },
                    count_pulse: { $sum: "$sum_pulse_credit" },
                    count_pulse_salary: { $sum: "$sum_pulse_salary" },
                    time_pulse: { $sum: "$time_pulse" }
                },
            }, { $sort: { _id: 1 } }
        ])

        const purposeMap = {
            "Прохождение игр": {
                categories: ["games"],
                field: "sum",
            },

            "Покупка игр": {
                categories: ["games_price"],
                field: "sum",
            },

            "Чтение книг": {
                categories: ["books"],
                field: "sum",
            },

            "Покупка книг": {
                categories: ["books_price"],
                field: "sum",
            },

            "Покрас миниатюр": {
                categories: ["miniature"],
                field: "sum",
            },

            "Ипотека": {
                categories: ["payments"],
                field: "count_pulse",
            },

            "Заработок": {
                categories: ["salary"],
                field: "count_pulse_salary",
            },
        };

        const grouped = {};

        purpose.forEach(purpose => {
            const config = purposeMap[purpose.purpose_key];

            if (!config) {
                return;
            }

            const year = Number(purpose.purpose_year);

            const actual = pulse
                .filter(movement =>
                    Number(movement._id.date_pulse) === year &&
                    config.categories.includes(movement._id.category_pulse)
                )
                .reduce(
                    (sum, movement) => sum + (movement[config.field] || 0),
                    0
                );

            const progress = purpose.purpose_count
                ? (actual / purpose.purpose_count) * 100
                : 0;

            if (!grouped[year]) {
                grouped[year] = [];
            }

            grouped[year].push({
                purpose: purpose.purpose_key,
                purpose_name: purpose.purpose_name,
                target: purpose.purpose_count,
                actual,
                progress: Number(progress.toFixed(2)),
            });
        });

        const result = Object.entries(grouped)
            .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
            .map(([year, goals]) => ({
                year: Number(year),
                goals,
            }));

        res.status(200).json({ purpose, result })
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