import 'core-js'
import BookModel from '../models/Book.js'
import PulseModel from '../models/Pulse.js'
import WriteBooksModel from '../models/WriteBooks.js'
import PaymentsModel from '../models/Payments.js'
import EarlyPaymentsModel from '../models/EarlyPayments.js'
import CreditModel from '../models/Credit.js'
import Games from '../models/Games.js'
import Book from '../models/Book.js'
import SalaryModel from '../models/Salary.js'
import BonusModel from '../models/Bonus.js'
import ColorModel from "../models/Color.js"
import MiniatureModel from "../models/Miniature.js"
import RepairModel from "../models/Repair.js";
import CardModel from "../models/Card.js"
import BeybladeModel from '../models/Beyblade.js'
import CreditStaticHistory from '../models/CreditStaticHistory.js'
import JobsMounthModel from '../models/JobsMounth.js'

export const book_static = async (req, res) => {

    try {

        var readRomans = 0
        var reatNotRomans = 0

        var readBigStory = 0
        var readNotBigStory = 0

        var readStory = 0
        var readNotStory = 0

        var booksPriceSum = 0
        var booksPriceCount = 0

        var booksDataRomans = []
        var booksDataStory = []
        var booksDataBigStory = []
        var booksDataDemoLine = []

        const writeBooks = await WriteBooksModel.find({ compilation: req.params.book_name })
        const books2 = await Book.find({ compilation: req.params.book_name })

        writeBooks.filter(obj => obj.format === 'роман').
            map(obj => {
                obj.presence === 'Прочитано' ? readRomans += 1 : reatNotRomans += 1
            })

        writeBooks.filter(obj => obj.format === 'повесть').
            map(obj => {
                obj.presence === 'Прочитано' ? readBigStory += 1 : readNotBigStory += 1
            })

        writeBooks.filter(obj => obj.format === 'рассказ').
            map(obj => {
                obj.presence === 'Прочитано' ? readStory += 1 : readNotStory += 1
            })

        books2.map(obj => {
            booksPriceSum += obj.summ_book,
                obj.presence === 'Есть' ? booksPriceCount += 1 : obj
        })

        const booksCount = books2.length

        const booksProcentStatic = Number(((readRomans + readStory + readBigStory) * 100 / writeBooks.length).toFixed(2))

        if (readRomans != 0 + reatNotRomans != 0) {
            booksDataRomans.push(
                { name: "Прочитано", value: readRomans },
                { name: "Осталось", value: reatNotRomans })

            booksDataDemoLine.push(
                { key: 'Романов', name: 'Прочитано', value: readRomans },
                { key: 'Романов', name: 'Осталось', value: reatNotRomans },
                { key: 'Романов', name: 'Всего', value: readRomans + reatNotRomans },
            )
        }
        else booksDataRomans = null

        if (readBigStory + readNotBigStory != 0) {
            booksDataBigStory.push(
                { name: "Прочитано", value: readBigStory },
                { name: "Осталось", value: readNotBigStory })

            booksDataDemoLine.push(
                { key: 'Повестей', name: 'Прочитано', value: readBigStory },
                { key: 'Повестей', name: 'Осталось', value: readNotBigStory },
                { key: 'Повестей', name: 'Всего', value: readBigStory + readNotBigStory })
        }
        else booksDataBigStory = null

        if (readStory != 0 + readNotStory != 0) {
            booksDataStory.push(
                { name: "Прочитано", value: readStory },
                { name: "Осталось", value: readNotStory })

            booksDataDemoLine.push(
                { key: 'Рассказов', name: 'Прочитано', value: readStory },
                { key: 'Рассказов', name: 'Осталось', value: readNotStory },
                { key: 'Рассказов', name: 'Всего', value: readStory + readNotStory },
            )
        }
        else booksDataStory = null

        booksDataDemoLine.push(
            { key: 'Общее количество', name: 'Прочитано', value: readStory + readBigStory + readRomans },
            { key: 'Общее количество', name: 'Осталось', value: readNotStory + readNotBigStory + reatNotRomans },
            { key: 'Общее количество', name: 'Всего', value: writeBooks.length },
        )

        res.status(200).json({
            booksPriceSum,
            booksCount,
            booksPriceCount,
            booksProcentStatic,
            booksDataRomans,
            booksDataBigStory,
            booksDataStory,
            booksDataDemoLine,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const credit_static = async (req, res) => {

    try {

        var early_sum = 0
        var data1 = []
        var data2 = []
        var data3 = []
        var count_month_remainder = 0
        var count_month_paid = 0
        var remainder = 0
        var paid_fix = 0

        var procentDate = []
        var procentSumm = []
        var procentEconom = []

        var groupYearEarlyPay = []
        var earlyPayGroup = [];

        const creditHistory = await CreditStaticHistory.find()

        const procent_dateO = creditHistory[0].procent_date.filter(arr => arr.category === 'Осталось')

        for (var i = 0; i < procent_dateO.length; i++) {

            if (i + 1 === procent_dateO.length) break;

            procentDate.push({
                dateOld: procent_dateO[i].date,
                dateNew: procent_dateO[i + 1].date,
                diffValue: procent_dateO[i].value - procent_dateO[i + 1].value
            })
        }

        const procent_summO = creditHistory[0].procent_summ.filter(arr => arr.category === 'Осталось')

        for (var i = 0; i < procent_summO.length; i++) {

            if (i + 1 === procent_summO.length) break;

            procentSumm.push({
                dateOld: procent_summO[i].date,
                dateNew: procent_summO[i + 1].date,
                diffValue: procent_summO[i].value - procent_summO[i + 1].value
            })
        }

        const procentEconomO = creditHistory[0].procent_econom.filter(arr => arr.category === 'Переплата')

        for (var i = 0; i < procentEconomO.length; i++) {

            if (i + 1 === procentEconomO.length) break;

            procentEconom.push({
                dateOld: procentEconomO[i].date,
                dateNew: procentEconomO[i + 1].date,
                diffValue: procentEconomO[i].value - procentEconomO[i + 1].value
            })
        }

        const earlyPay = await EarlyPaymentsModel.find()
        const credit = await CreditModel.find({ credit_name: 'Ипотека' })
        const payment = await PaymentsModel.find()

        earlyPay.map(obj => {
            groupYearEarlyPay.push({ date: obj.date_earlyPayment.slice(6), sum: obj.summ_earlyPayment })
        })

        groupYearEarlyPay.reduce((res, value) => {
            if (!res[(value.date)]) {
                res[value.date] = { _id: value.date, sum: 0 };
                earlyPayGroup.push(res[value.date])
            }
            res[value.date].sum += value.sum;
            return res;
        }, {});

        earlyPayGroup.sort((a, b) => a._id - b._id)

        payment.map((obj) => {
            if (obj.status_payment === 'Не оплачено') {
                count_month_remainder++
                remainder += obj.summ_payment
            } else {
                count_month_paid++
                paid_fix += obj.summ_payment
            }
        })

        earlyPay.map((obj) => early_sum += obj.summ_earlyPayment)

        const procentStatic = (((paid_fix + early_sum) * 100) / (paid_fix + early_sum + remainder)).toFixed(4)

        const saving = Number((credit[0].duty - (remainder + paid_fix + early_sum)).toFixed(2))

        const overpayment = Number((credit[0].duty - (credit[0].summ_credit + saving)).toFixed(2))

        const paid = Number((paid_fix + early_sum).toFixed(2))

        data1.push({ name: 'Экономия', value: saving }, { name: 'Переплата', value: overpayment })
        data2.push({ name: 'Выплачено', value: paid }, { name: 'Осталось', value: remainder })
        data3.push({ name: 'Выплачено', value: count_month_paid }, { name: 'Осталось', value: count_month_remainder })

        res.status(200).send({
            procentDate,
            procentSumm,
            procentEconom,
            earlyPayGroup,
            paid,
            remainder,
            procentStatic,
            count_month_paid,
            count_month_remainder,
            saving,
            overpayment,
            early_sum,
            data1,
            data2,
            data3,
            creditHistory
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const hobby_static = async (req, res) => {
    try {
        const miniatures = await MiniatureModel.aggregate([{ $group: { _id: null, sum: { $sum: "$price_miniature" } } }])
        const color = await ColorModel.aggregate([{ $group: { _id: null, sum: { $sum: "$summ_color" } } }])
        const count_miniatures = await MiniatureModel.aggregate([{ $group: { _id: null, sum: { $sum: "$count_miniatures" } } }])
        const count_miniatures_color = await MiniatureModel.aggregate([{ $group: { _id: null, sum: { $sum: "$count_miniatures_color" } } }])
        const procent_color_all = await MiniatureModel.aggregate([
            {
                $group: {
                    _id: "$collection_miniature",
                    sum_count: { $sum: "$count_miniatures" },
                    sum_count_color: { $sum: "$count_miniatures_color" }
                }
            }])

        var test = []
        var columnHobby = []

        procent_color_all.map((obj) => test.push([{ key: obj._id, name: 'Покрашено', value: obj.sum_count_color },
        { name: 'Осталось', key: obj._id, value: obj.sum_count - obj.sum_count_color }]))

        procent_color_all.map((obj) => columnHobby.push({ key: obj._id, name: 'Всего', value: obj.sum_count },
            { key: obj._id, name: 'Покрашено', value: obj.sum_count_color },
            { key: obj._id, name: 'Осталось', value: obj.sum_count - obj.sum_count_color }))
        const summ_hobby = miniatures[0].sum + color[0].sum
        const summ_miniatures = miniatures[0].sum
        const summ_color = color[0].sum
        const procent_miniatures_colors = (count_miniatures_color[0].sum * 100 / count_miniatures[0].sum).toFixed(2)

        res.status(200).json({
            procent_color_all,
            summ_hobby,
            summ_miniatures,
            summ_color,
            procent_miniatures_colors,
            test,
            columnHobby,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const compare_statistic = async (req, res) => {

    try {

        var statisticYearNumber_1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var statisticYearNumber_2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var statisticName = [
            'Пройдено игр',
            'Приобретено игр',
            'Потрачено на игры',
            'Потрачено времени на игры',
            'Заработок',
            'Подработки',
            'Выплачено ипотеки',
            'Внесено досрочных платежей',
            'Прочитано книг',
            'Приобретено книг',
            'Потрачено на книги',
            'Приобретено волчков',
            'Потрачено на волчки',
            'Приобретено карточек',
            'Потрачено на карточки',
            'Покрашено миниатюр',
            'Потрачено на хобби']

        var statisticYearNumber1 = []
        var statisticYearNumber2 = []

        const pulse_group_charts = await PulseModel.aggregate([
            {
                $match: {
                    date_pulse: {
                        $gte: new Date(`${req.body.year_1}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${req.body.year_1}-12-31T23:59:59.000Z`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        category_pulse: "$category_pulse",
                    },
                    sum: { $sum: 1 },
                    sum_pulse: { $sum: "$sum_pulse" },
                    count_pulse: { $sum: "$sum_pulse_credit" },
                    count_pulse_salary: { $sum: "$sum_pulse_salary" },
                    time_pulse: { $sum: "$time_pulse" }
                },
            }, { $sort: { _id: 1 } }
        ])

        const pulse_group_charts2 = await PulseModel.aggregate([
            {
                $match: {
                    date_pulse: {
                        $gte: new Date(`${req.body.year_2}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${req.body.year_2}-12-31T23:59:59.000Z`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        category_pulse: "$category_pulse",
                    },
                    sum: { $sum: 1 },
                    sum_pulse: { $sum: "$sum_pulse" },
                    count_pulse: { $sum: "$sum_pulse_credit" },
                    count_pulse_salary: { $sum: "$sum_pulse_salary" },
                    time_pulse: { $sum: "$time_pulse" }
                },
            }, { $sort: { _id: 1 } }
        ])

        for (var i = 0; i < pulse_group_charts.length; i++) {
            if (pulse_group_charts[i]._id.category_pulse === 'games') {
                statisticYearNumber_1[0] = pulse_group_charts[i].sum
                statisticYearNumber_1[3] = pulse_group_charts[i].time_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'games_price') {
                statisticYearNumber_1[1] = pulse_group_charts[i].sum
                statisticYearNumber_1[2] = pulse_group_charts[i].sum_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'salary') {
                statisticYearNumber_1[4] = pulse_group_charts[i].count_pulse_salary
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'bonus') {
                statisticYearNumber_1[5] = pulse_group_charts[i].sum_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'payments') {
                statisticYearNumber_1[6] = pulse_group_charts[i].count_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'payments_early') {
                statisticYearNumber_1[7] = pulse_group_charts[i].count_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'books') {
                statisticYearNumber_1[8] = pulse_group_charts[i].sum
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'books_price') {
                statisticYearNumber_1[9] = pulse_group_charts[i].sum
                statisticYearNumber_1[10] = pulse_group_charts[i].sum_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'beyblade_price') {
                statisticYearNumber_1[11] = pulse_group_charts[i].sum
                statisticYearNumber_1[12] = pulse_group_charts[i].sum_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'card_price') {
                statisticYearNumber_1[13] = pulse_group_charts[i].sum
                statisticYearNumber_1[14] = pulse_group_charts[i].sum_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'miniature') {
                statisticYearNumber_1[15] = pulse_group_charts[i].sum
                statisticYearNumber_1[16] += pulse_group_charts[i].sum_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'color_price') {
                statisticYearNumber_1[16] += pulse_group_charts[i].sum_pulse
            }
        }

        for (var i = 0; i < pulse_group_charts2.length; i++) {
            if (pulse_group_charts2[i]._id.category_pulse === 'games') {
                statisticYearNumber_2[0] = pulse_group_charts2[i].sum
                statisticYearNumber_2[3] = pulse_group_charts2[i].time_pulse
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'games_price') {
                statisticYearNumber_2[1] = pulse_group_charts2[i].sum
                statisticYearNumber_2[2] = pulse_group_charts2[i].sum_pulse
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'salary') {
                statisticYearNumber_2[4] = pulse_group_charts2[i].count_pulse_salary
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'bonus') {
                statisticYearNumber_2[5] = pulse_group_charts2[i].sum_pulse
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'payments') {
                statisticYearNumber_2[6] = pulse_group_charts2[i].count_pulse
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'payments_early') {
                statisticYearNumber_2[7] = pulse_group_charts2[i].count_pulse
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'books') {
                statisticYearNumber_2[8] = pulse_group_charts2[i].sum
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'books_price') {
                statisticYearNumber_2[9] = pulse_group_charts2[i].sum
                statisticYearNumber_2[10] = pulse_group_charts2[i].sum_pulse
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'beyblade_price') {
                statisticYearNumber_2[11] = pulse_group_charts2[i].sum
                statisticYearNumber_2[12] = pulse_group_charts2[i].sum_pulse
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'card_price') {
                statisticYearNumber_2[13] = pulse_group_charts2[i].sum
                statisticYearNumber_2[14] = pulse_group_charts2[i].sum_pulse
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'miniature') {
                statisticYearNumber_2[15] = pulse_group_charts2[i].sum
                statisticYearNumber_2[16] += pulse_group_charts2[i].sum_pulse
            }
            else if (pulse_group_charts2[i]._id.category_pulse === 'color_price') {
                statisticYearNumber_2[16] += pulse_group_charts2[i].sum_pulse
            }
        }

        for (var i = 0; i < statisticYearNumber_2.length; i++) {
            if (statisticYearNumber_1[i] > statisticYearNumber_2[i]) {
                statisticYearNumber1.push({ name: statisticName[i], value: statisticYearNumber_1[i], prefix: '>' })
                statisticYearNumber2.push({ name: statisticName[i], value: statisticYearNumber_2[i], prefix: '<' })
            } else if (statisticYearNumber_1[i] === statisticYearNumber_2[i]) {
                statisticYearNumber2.push({ name: statisticName[i], value: statisticYearNumber_2[i], prefix: '=' })
                statisticYearNumber1.push({ name: statisticName[i], value: statisticYearNumber_1[i], prefix: '=' })
            }
            else {
                statisticYearNumber1.push({ name: statisticName[i], value: statisticYearNumber_1[i], prefix: '<' })
                statisticYearNumber2.push({ name: statisticName[i], value: statisticYearNumber_2[i], prefix: '>' })
            }
        }

        res.status(200).json({
            statisticYearNumber1,
            statisticYearNumber2
        })

    } catch (err) {
        res.status(500).json({ ...err })
    }
}

export const compare_statistic_column = async (req, res) => {

    try {

        const statistic_collection = req.params.statistic_collection
        const year1 = req.body.year_1
        const year2 = req.body.year_2

        async function get_static(statistic_collection, year) {

            var groupAggregate = []
            var groupDateAggregate = []
            var returnGroupAgg = []
            var statistic_collection_db = statistic_collection

            const diff = [
                `${year}-01`, `${year}-02`,
                `${year}-03`, `${year}-04`,
                `${year}-05`, `${year}-06`,
                `${year}-07`, `${year}-08`,
                `${year}-09`, `${year}-10`,
                `${year}-11`, `${year}-12`
            ]

            var statisticName = ['Январь', 'Февраль',
                'Март', 'Апрель',
                'Май', 'Июнь',
                'Июль', 'Август',
                'Сентябрь', 'Октябрь',
                'Ноябрь', 'Декабрь']


            if (statistic_collection === 'games_price2' ||
                statistic_collection === 'books_price2' ||
                statistic_collection === 'beyblade_price2' ||
                statistic_collection === 'card_price2') {
                statistic_collection_db = statistic_collection_db.slice(0, -1)
            }

            const pulse_group_charts = await PulseModel.aggregate([
                {
                    $match: {
                        date_pulse: {
                            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                            $lte: new Date(`${year}-12-31T23:59:59.000Z`)
                        },
                        category_pulse: statistic_collection_db
                    }
                },
                {
                    $group: {
                        _id: {
                            date_pulse: { $substr: ["$date_pulse", 0, 7] },
                        },
                        sum: { $sum: 1 },
                        sum_pulse: { $sum: "$sum_pulse" },
                        count_pulse: { $sum: "$sum_pulse_credit" },
                        count_pulse_salary: { $sum: "$sum_pulse_salary" },
                        time_pulse: { $sum: "$time_pulse" }
                    },
                }, { $sort: { _id: 1 } }
            ])

            if (statistic_collection === 'games_price2' ||
                statistic_collection === 'books_price2' ||
                statistic_collection === 'beyblade_price2' ||
                statistic_collection === 'card_price2') {
                pulse_group_charts.map(arr => {
                    groupAggregate.push({ date_pulse: arr._id.date_pulse, count_pulse: arr.sum_pulse })
                    groupDateAggregate.push(arr._id.date_pulse)
                })
            }
            else if (statistic_collection === 'salary') {
                pulse_group_charts.map(arr => {
                    groupAggregate.push({ date_pulse: arr._id.date_pulse, count_pulse: arr.count_pulse_salary })
                    groupDateAggregate.push(arr._id.date_pulse)
                })
            }
            else if (statistic_collection === 'payments') {
                pulse_group_charts.map(arr => {
                    groupAggregate.push({ date_pulse: arr._id.date_pulse, count_pulse: arr.count_pulse })
                    groupDateAggregate.push(arr._id.date_pulse)
                })
            }
            else {
                pulse_group_charts.map(arr => {
                    groupAggregate.push({ date_pulse: arr._id.date_pulse, count_pulse: arr.sum })
                    groupDateAggregate.push(arr._id.date_pulse)
                })
            }

            var diff_group = diff.filter(date => !groupDateAggregate.includes(date))
            diff_group.map((obj) => groupAggregate.push({ date_pulse: obj, count_pulse: 0 }))

            groupAggregate.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

            for (var i = 0; i < groupAggregate.length; i++) {
                returnGroupAgg.push({
                    date: groupAggregate[i].date_pulse,
                    value: groupAggregate[i].count_pulse,
                    key: statisticName[i],
                    name: year
                })
            }

            return returnGroupAgg
        }

        var yearOneCompare1 = await get_static(statistic_collection, year1)
        var yearOneCompare2 = await get_static(statistic_collection, year2)

        const groupCompare = [...yearOneCompare1, ...yearOneCompare2]

        res.status(200).json({
            groupCompare,
        })

    } catch (err) {
        res.status(500).json({ ...err })
    }
}

export const main_static = async (req, res) => {
    try {

        const diff = [
            `${req.params.year}-01`, `${req.params.year}-02`,
            `${req.params.year}-03`, `${req.params.year}-04`,
            `${req.params.year}-05`, `${req.params.year}-06`,
            `${req.params.year}-07`, `${req.params.year}-08`,
            `${req.params.year}-09`, `${req.params.year}-10`,
            `${req.params.year}-11`, `${req.params.year}-12`
        ]

        let dataPieCount = [];
        let dataPiePrice = [];
        let games = []
        let games_date = []
        let gamesPriceCount = []
        let gamesPrice = []
        let games_datePrice = []

        let cardPriceBakugan = []
        let card_datePriceBakugan = []
        let cardsPriceBakugan = []
        let cards_datePriceBakugan = []

        let cardPriceNaruto = []
        let card_datePriceNaruto = []
        let cardsPriceNaruto = []
        let cards_datePriceNaruto = []

        let cardPriceSuperRacing = []
        let card_datePriceSuperRacing = []
        let cardsPriceSuperRacing = []
        let cards_datePriceSuperRacing = []

        let cardPriceTransformers = []
        let card_datePriceTransformers = []
        let cardsPriceTransformers = []
        let cards_datePriceTransformers = []

        let cardPriceBeyblade = []
        let card_datePriceBeyblade = []
        let cardsPriceBeyblade = []
        let cards_datePriceBeyblade = []

        let cardPriceSpiderMan = []
        let card_datePriceSpiderMan = []
        let cardPriceTeenageMutantNinja = []
        let card_datePriceTeenageMutantNinja = []
        let cardsPriceTeenageMutantNinja = []
        let cards_datePriceTeenageMutantNinja = []
        let cardsPriceSpiderMan = []
        let cards_datePriceSpiderMan = []
        let books = []
        let books_date = []
        let booksPrice = []
        let booksPriceCount = []
        let books_datePrice = []

        let beybladePriceCount = []
        let beybladePrice = []
        let beyblade_datePrice = []

        let miniature = []
        let miniature_date = []
        let hobbyColorPrice = []
        let hobbyColorPrice_date = []
        let hobbyMiniaturePrice = []
        let hobbyMiniaturePrice_date = []
        let payments = []
        let payments_date = []
        let salary = []
        let salary_date = []
        let sum_games_nowyear = 0
        let sum_books_nowyear = 0
        let sum_beyblade_nowyear = 0
        let sum_color_nowyear = 0
        let sum_miniatures_nowyear = 0
        let time_games_nowyear = 0
        let count_games_price = 0
        let count_miniatures_price = 0
        let summ_delta
        var books_pulse = []
        var miniature_pulse = []
        var games_pulse = []
        var books_price_pulse = []
        var games_price_pulse = []
        var miniatures_price_pulse = []
        var books_list_count = 0
        var books_price = []
        var game_over = []
        var game_over_count = 0
        var books_write = []
        var books_write_count = 0
        let count_books_price = 0
        let count_beyblade_price = 0
        var gamesAssemble = []
        var cardsAssemble = []
        var booksAssemble = []
        var hobbyAssemble = []
        var beybladeAssemble = []
        var cardsOtherCollection = []

        const jobsMonth = await JobsMounthModel.find({ modal_view: false }).limit(1)

        //лист для покупки книг и количество
        const books_list_price = await BookModel.aggregate([
            { $match: { presence: 'Нет' } },
            {
                $group: {
                    _id: "$compilation",
                    children: { $push: { title: "$book_name" } },
                    count: { $sum: 1 }
                }
            }
        ])

        books_list_price.map(
            (obj) => {
                books_price.push({ title: obj._id, children: obj.children }),
                    books_list_count += obj.count
            })

        //лист количество не пройденных игр и количество
        const games_list = await Games.aggregate([
            { $match: { presence: 'Не Пройдено' } },
            {
                $group: {
                    _id: "$compilation",
                    children: { $push: { title: "$game_name" } },
                    count: { $sum: 1 }
                }
            }
        ])

        games_list.map(
            (obj) => {
                game_over.push({ title: obj._id, children: obj.children }),
                    game_over_count += obj.count
            })

        //лист количества не прочитанных книг и количество
        const books_write_list = await WriteBooksModel.aggregate([
            { $match: { presence: 'Не Прочитано' } },
            {
                $group: {
                    _id: "$compilation",
                    children: { $push: { title: "$book_name", format: "$format" } },
                    count: { $sum: 1 }
                }
            }
        ])

        books_write_list.map(
            (obj) => {
                var child = []
                obj.children.map(o => child.push({ title: o.title + ' (' + o.format + ')' }))
                books_write.push({ title: obj._id, children: child }),
                    books_write_count += obj.count
            })

        //лист по движениям покрашено миниатюр, прочитано книг, пройдекно игр, приобретено игр
        const books_list = await PulseModel.aggregate([
            {
                $match: {
                    date_pulse: {
                        $gte: new Date(`${req.params.year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${req.params.year}-12-31T23:59:59.000Z`)
                    }
                }
            },
            { $group: { _id: "$category_pulse", children: { $push: { title: "$name_pulse", date: { $dateToString: { format: "%Y-%m-%d", date: "$date_pulse" } } } } } }
        ])

        books_list.map((obj) => {
            var child = []
            obj.children.map(o => child.push({ title: o.date + ' — ' + o.title }))
            obj._id === 'miniature' ?
                miniature_pulse.push({ title: 'Миниатюры', children: child }) :
                obj._id === 'games' ? games_pulse.push({ title: 'Игры', children: child }) :
                    obj._id === 'books' ? books_pulse.push({ title: 'Книги', children: child }) :
                        obj._id === 'books_price' ? books_price_pulse.push({ title: 'Купленные книги', children: child }) :
                            obj._id === 'games_price' ? games_price_pulse.push({ title: 'Купленные игры', children: child }) :
                                obj._id === 'miniatures_price' ? miniatures_price_pulse.push({ title: 'Купленные миниатюры', child }) :
                                    obj
        })

        //группировка из движений для формирования графиков по месяцам
        const pulse_group_charts = await PulseModel.aggregate([
            {
                $match: {
                    date_pulse: {
                        $gte: new Date(`${req.params.year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${req.params.year}-12-31T23:59:59.000Z`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        category_pulse: "$category_pulse", date_pulse: { $substr: ["$date_pulse", 0, 7] },
                        collection_card_pulse: "$collection_card_pulse"
                    },
                    sum: { $sum: 1 },
                    sum_pulse: { $sum: "$sum_pulse" },
                    count_pulse: { $sum: "$sum_pulse_credit" },
                    count_pulse_salary: { $sum: "$sum_pulse_salary" },
                    time_pulse: { $sum: "$time_pulse" }
                },
            }, { $sort: { _id: 1 } }
        ])

        let summ_early_payment = 0
        let summ_bonus_year = 0
        let summPayments = 0
        let summGames = 0
        let summMiniatures = 0
        let summBooks = 0
        let summ_salary_year = 0

        let sum_card_nowyearTeenage_Mutant_Ninja = 0
        let sum_card_nowyearBakugan = 0
        let sum_card_nowyearTransformers = 0
        let sum_card_nowyearSpider_Man = 0
        let sum_card_nowyearBeyblade = 0
        let sum_card_nowyearNaruto = 0
        let sum_card_nowyearSuperRacing = 0

        let count_card_priceTeenage_Mutant_Ninja = 0
        let count_card_priceSpider_Man = 0
        let count_card_priceBakugan = 0
        let count_card_priceTransformers = 0
        let count_card_priceBeyblade = 0
        let count_card_priceNaruto = 0
        let count_card_priceSuperRacing = 0

        for (let i = 0; i < pulse_group_charts.length; i++) {
            if (pulse_group_charts[i]._id.category_pulse === 'games') {
                games.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                games_date.push(pulse_group_charts[i]._id.date_pulse)
                time_games_nowyear += pulse_group_charts[i].time_pulse
                summGames += pulse_group_charts[i].sum
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'books') {
                books.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                books_date.push(pulse_group_charts[i]._id.date_pulse)
                summBooks += pulse_group_charts[i].sum
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'miniature') {
                miniature.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                miniature_date.push(pulse_group_charts[i]._id.date_pulse)
                summMiniatures += pulse_group_charts[i].sum
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'books_price') {
                booksPriceCount.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                booksPrice.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                books_datePrice.push(pulse_group_charts[i]._id.date_pulse)
                sum_books_nowyear += pulse_group_charts[i].sum_pulse
                count_books_price += pulse_group_charts[i].sum
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'payments') {
                payments.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].count_pulse })
                payments_date.push(pulse_group_charts[i]._id.date_pulse)
                summPayments += pulse_group_charts[i].count_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'salary') {
                salary.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].count_pulse_salary })
                salary_date.push(pulse_group_charts[i]._id.date_pulse)
                summ_salary_year += pulse_group_charts[i].count_pulse_salary
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'games_price') {
                gamesPriceCount.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                gamesPrice.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                games_datePrice.push(pulse_group_charts[i]._id.date_pulse)
                sum_games_nowyear += pulse_group_charts[i].sum_pulse,
                    count_games_price += pulse_group_charts[i].sum
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'miniatures_price') {
                sum_miniatures_nowyear += pulse_group_charts[i].sum_pulse
                count_miniatures_price += pulse_group_charts[i].sum
                hobbyMiniaturePrice.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                hobbyMiniaturePrice_date.push(pulse_group_charts[i]._id.date_pulse)
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'color_price') {
                sum_color_nowyear += pulse_group_charts[i].sum_pulse
                hobbyColorPrice.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                hobbyColorPrice_date.push(pulse_group_charts[i]._id.date_pulse)
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'bonus') {
                summ_bonus_year += pulse_group_charts[i].sum_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'payments_early') {
                summ_early_payment += pulse_group_charts[i].count_pulse
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'beyblade_price') {
                sum_beyblade_nowyear += pulse_group_charts[i].sum_pulse
                count_beyblade_price += pulse_group_charts[i].sum
                beybladePriceCount.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                beybladePrice.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                beyblade_datePrice.push(pulse_group_charts[i]._id.date_pulse)
            }
            else if (pulse_group_charts[i]._id.category_pulse === 'card_price') {

                if (pulse_group_charts[i]._id.collection_card_pulse === 'Teenage_Mutant_Ninja') {
                    cardPriceTeenageMutantNinja.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                    card_datePriceTeenageMutantNinja.push(pulse_group_charts[i]._id.date_pulse)
                    sum_card_nowyearTeenage_Mutant_Ninja += pulse_group_charts[i].sum_pulse,
                        count_card_priceTeenage_Mutant_Ninja += pulse_group_charts[i].sum
                    cardsPriceTeenageMutantNinja.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                    cards_datePriceTeenageMutantNinja.push(pulse_group_charts[i]._id.date_pulse)
                }
                else if (pulse_group_charts[i]._id.collection_card_pulse === 'Spider_Man') {
                    cardPriceSpiderMan.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                    card_datePriceSpiderMan.push(pulse_group_charts[i]._id.date_pulse)
                    sum_card_nowyearSpider_Man += pulse_group_charts[i].sum_pulse,
                        count_card_priceSpider_Man += pulse_group_charts[i].sum
                    cardsPriceSpiderMan.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                    cards_datePriceSpiderMan.push(pulse_group_charts[i]._id.date_pulse)
                }
                else if (pulse_group_charts[i]._id.collection_card_pulse === 'Bakugan') {
                    cardPriceBakugan.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                    card_datePriceBakugan.push(pulse_group_charts[i]._id.date_pulse)
                    sum_card_nowyearBakugan += pulse_group_charts[i].sum_pulse,
                        count_card_priceBakugan += pulse_group_charts[i].sum
                    cardsPriceBakugan.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                    cards_datePriceBakugan.push(pulse_group_charts[i]._id.date_pulse)
                }
                else if (pulse_group_charts[i]._id.collection_card_pulse === 'Transformers Prime') {
                    cardPriceTransformers.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                    card_datePriceTransformers.push(pulse_group_charts[i]._id.date_pulse)
                    sum_card_nowyearTransformers += pulse_group_charts[i].sum_pulse,
                        count_card_priceTransformers += pulse_group_charts[i].sum
                    cardsPriceTransformers.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                    cards_datePriceTransformers.push(pulse_group_charts[i]._id.date_pulse)
                }
                else if (pulse_group_charts[i]._id.collection_card_pulse === 'Beyblade Metal Fusion') {
                    cardPriceBeyblade.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                    card_datePriceBeyblade.push(pulse_group_charts[i]._id.date_pulse)
                    sum_card_nowyearBeyblade += pulse_group_charts[i].sum_pulse,
                        count_card_priceBeyblade += pulse_group_charts[i].sum
                    cardsPriceBeyblade.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                    cards_datePriceBeyblade.push(pulse_group_charts[i]._id.date_pulse)
                }
                else if (pulse_group_charts[i]._id.collection_card_pulse === 'Naruto') {
                    cardPriceNaruto.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                    card_datePriceNaruto.push(pulse_group_charts[i]._id.date_pulse)
                    sum_card_nowyearNaruto += pulse_group_charts[i].sum_pulse,
                        count_card_priceNaruto += pulse_group_charts[i].sum
                    cardsPriceNaruto.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                    cards_datePriceNaruto.push(pulse_group_charts[i]._id.date_pulse)
                }
                else if (pulse_group_charts[i]._id.collection_card_pulse === 'Superracing') {
                    cardPriceSuperRacing.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum })
                    card_datePriceSuperRacing.push(pulse_group_charts[i]._id.date_pulse)
                    sum_card_nowyearSuperRacing += pulse_group_charts[i].sum_pulse,
                        count_card_priceSuperRacing += pulse_group_charts[i].sum
                    cardsPriceSuperRacing.push({ date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].sum_pulse })
                    cards_datePriceSuperRacing.push(pulse_group_charts[i]._id.date_pulse)
                }
            }
            else continue
        }

        let summ_payments = summPayments - summ_early_payment

        let sum_card_nowyear = sum_card_nowyearSpider_Man + sum_card_nowyearTeenage_Mutant_Ninja + sum_card_nowyearBakugan +
            sum_card_nowyearTransformers + sum_card_nowyearBeyblade + sum_card_nowyearNaruto + sum_card_nowyearSuperRacing

        let count_card_price = count_card_priceSpider_Man + count_card_priceTeenage_Mutant_Ninja + count_card_priceBakugan +
            count_card_priceTransformers + count_card_priceBeyblade + count_card_priceNaruto + count_card_priceSuperRacing

        let count_other_card_price = count_card_priceBakugan + count_card_priceTransformers + count_card_priceBeyblade + count_card_priceNaruto + count_card_priceSuperRacing
        let sum_other_card_nowyear = sum_card_nowyearBakugan + sum_card_nowyearTransformers + sum_card_nowyearBeyblade + sum_card_nowyearNaruto + sum_card_nowyearSuperRacing

        if (summ_salary_year === 0 && summ_bonus_year > 0)
            summ_salary_year += summ_bonus_year

        summ_salary_year - summ_bonus_year < 0 ? summ_delta = 0 : summ_delta = summ_salary_year - summ_bonus_year

        let diff_games = diff.filter(date => !games_date.includes(date))
        diff_games.map((obj) => games.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_gamesPriceCount = diff.filter(date => !games_datePrice.includes(date))
        diff_gamesPriceCount.map((obj) => gamesPriceCount.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_gamesPrice = diff.filter(date => !games_datePrice.includes(date))
        diff_gamesPrice.map((obj) => gamesPrice.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardsPriceSpiderMan = diff.filter(date => !cards_datePriceSpiderMan.includes(date))
        diff_cardsPriceSpiderMan.map((obj) => cardsPriceSpiderMan.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardsPriceBakugan = diff.filter(date => !cards_datePriceBakugan.includes(date))
        diff_cardsPriceBakugan.map((obj) => cardsPriceBakugan.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardsPriceNaruto = diff.filter(date => !cards_datePriceNaruto.includes(date))
        diff_cardsPriceNaruto.map((obj) => cardsPriceNaruto.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardsPriceSuperRacing = diff.filter(date => !cards_datePriceSuperRacing.includes(date))
        diff_cardsPriceSuperRacing.map((obj) => cardsPriceSuperRacing.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardsPriceTransformers = diff.filter(date => !cards_datePriceTransformers.includes(date))
        diff_cardsPriceTransformers.map((obj) => cardsPriceTransformers.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardsPriceBeyblade = diff.filter(date => !cards_datePriceBeyblade.includes(date))
        diff_cardsPriceBeyblade.map((obj) => cardsPriceBeyblade.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardsPriceTeenageMutantNinja = diff.filter(date => !cards_datePriceTeenageMutantNinja.includes(date))
        diff_cardsPriceTeenageMutantNinja.map((obj) => cardsPriceTeenageMutantNinja.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_hobbyColorPrice = diff.filter(date => !hobbyColorPrice_date.includes(date))
        diff_hobbyColorPrice.map((obj) => hobbyColorPrice.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_hobbyMiniaturePrice = diff.filter(date => !hobbyMiniaturePrice_date.includes(date))
        diff_hobbyMiniaturePrice.map((obj) => hobbyMiniaturePrice.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardPriceSpider_Man = diff.filter(date => !card_datePriceSpiderMan.includes(date))
        diff_cardPriceSpider_Man.map((obj) => cardPriceSpiderMan.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardPriceBakugan = diff.filter(date => !card_datePriceBakugan.includes(date))
        diff_cardPriceBakugan.map((obj) => cardPriceBakugan.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardPriceNaruto = diff.filter(date => !card_datePriceNaruto.includes(date))
        diff_cardPriceNaruto.map((obj) => cardPriceNaruto.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardPriceSuperRacing = diff.filter(date => !card_datePriceSuperRacing.includes(date))
        diff_cardPriceSuperRacing.map((obj) => cardPriceSuperRacing.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardPriceTransformers = diff.filter(date => !card_datePriceTransformers.includes(date))
        diff_cardPriceTransformers.map((obj) => cardPriceTransformers.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardPriceBeyblade = diff.filter(date => !card_datePriceBeyblade.includes(date))
        diff_cardPriceBeyblade.map((obj) => cardPriceBeyblade.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_cardPriceTeenage_Mutant_Ninja = diff.filter(date => !card_datePriceTeenageMutantNinja.includes(date))
        diff_cardPriceTeenage_Mutant_Ninja.map((obj) => cardPriceTeenageMutantNinja.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_books = diff.filter(date => !books_date.includes(date))
        diff_books.map((obj) => books.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_booksPriceCount = diff.filter(date => !books_datePrice.includes(date))
        diff_booksPriceCount.map((obj) => booksPriceCount.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_beybladePriceCount = diff.filter(date => !beyblade_datePrice.includes(date))
        diff_beybladePriceCount.map((obj) => beybladePriceCount.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_booksPrice = diff.filter(date => !books_datePrice.includes(date))
        diff_booksPrice.map((obj) => booksPrice.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_beybladePrice = diff.filter(date => !beyblade_datePrice.includes(date))
        diff_beybladePrice.map((obj) => beybladePrice.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_miniature = diff.filter(date => !miniature_date.includes(date))
        diff_miniature.map((obj) => miniature.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_payments = diff.filter(date => !payments_date.includes(date))
        diff_payments.map((obj) => payments.push({ date_pulse: obj, count_pulse: 0 }))

        let diff_salary = diff.filter(date => !salary_date.includes(date))
        diff_salary.map((obj) => salary.push({ date_pulse: obj, count_pulse: 0 }))

        let sortedGames = games.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedGamesPriceCount = gamesPriceCount.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedGamesPrice = gamesPrice.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedhobbyColorPrice = hobbyColorPrice.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedhobbyMiniaturePrice = hobbyMiniaturePrice.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedCardsPriceSpiderMan = cardsPriceSpiderMan.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedCardsPriceTeenageMutantNinja = cardsPriceTeenageMutantNinja.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedCardPriceTeenage_Mutant_Ninja = cardPriceTeenageMutantNinja.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

        let sortedCardsPriceBakugan = cardsPriceBakugan.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedCardPriceBakugan = cardPriceBakugan.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

        let sortedCardsPriceSuperRacing = cardsPriceSuperRacing.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedCardPriceSuperRacing = cardPriceSuperRacing.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

        let sortedCardsPriceNaruto = cardsPriceNaruto.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedCardPriceNaruto = cardPriceNaruto.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

        let sortedCardsTransformers = cardsPriceTransformers.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedCardPriceTransformers = cardPriceTransformers.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

        let sortedCardsPriceBeyblade = cardsPriceBeyblade.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedCardPriceBeyblade = cardPriceBeyblade.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

        let sortedCardPriceSpider_Man = cardPriceSpiderMan.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedBooks = books.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedbooksPriceCount = booksPriceCount.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedBeybladePriceCount = beybladePriceCount.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedbooksPrice = booksPrice.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedBeybladePrice = beybladePrice.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedMiniatures = miniature.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedPayments = payments.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
        let sortedSalary = salary.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

        for (var i = 0; i < 12; i++) {
            gamesAssemble.push({ date_pulse: sortedGames[i].date_pulse, buy: sortedGamesPriceCount[i].count_pulse, price: sortedGamesPrice[i].count_pulse, pulse: sortedGames[i].count_pulse })
            booksAssemble.push({ date_pulse: sortedBooks[i].date_pulse, buy: sortedbooksPriceCount[i].count_pulse, price: sortedbooksPrice[i].count_pulse, pulse: sortedBooks[i].count_pulse })
            hobbyAssemble.push({
                date_pulse: sortedMiniatures[i].date_pulse,
                price: sortedhobbyMiniaturePrice[i].count_pulse + sortedhobbyColorPrice[i].count_pulse,
                pulse: sortedMiniatures[i].count_pulse
            })
            beybladeAssemble.push({
                date_pulse: sortedBeybladePrice[i].date_pulse,
                price: sortedBeybladePrice[i].count_pulse,
                buy: sortedBeybladePriceCount[i].count_pulse
            })
            cardsAssemble.push({
                date_pulse: sortedCardPriceSpider_Man[i].date_pulse,
                buy: sortedCardPriceTeenage_Mutant_Ninja[i].count_pulse + sortedCardPriceSpider_Man[i].count_pulse + sortedCardPriceBakugan[i].count_pulse + sortedCardPriceTransformers[i].count_pulse
                    + sortedCardPriceBeyblade[i].count_pulse + sortedCardPriceNaruto[i].count_pulse + sortedCardPriceSuperRacing[i].count_pulse,
                price: sortedCardsPriceSpiderMan[i].count_pulse + sortedCardsPriceTeenageMutantNinja[i].count_pulse + sortedCardsPriceBakugan[i].count_pulse +
                    sortedCardsTransformers[i].count_pulse + sortedCardsPriceBeyblade[i].count_pulse + sortedCardsPriceNaruto[i].count_pulse + sortedCardsPriceSuperRacing[i].count_pulse
            })


            cardsOtherCollection.push({
                date_pulse: sortedCardsTransformers[i].date_pulse,
                count_pulse: sortedCardPriceTeenage_Mutant_Ninja[i].count_pulse + sortedCardPriceSpider_Man[i].count_pulse +
                    sortedCardPriceBakugan[i].count_pulse + sortedCardPriceTransformers[i].count_pulse
                    + sortedCardPriceBeyblade[i].count_pulse + sortedCardPriceNaruto[i].count_pulse + sortedCardPriceSuperRacing[i].count_pulse
            })
        }

        dataPieCount.push({ type: 'Потрачено на игры', value: sum_games_nowyear },
            { type: 'Потрачено на хобби', value: sum_miniatures_nowyear + sum_color_nowyear },
            { type: 'Потрачено на книги', value: sum_books_nowyear },
            {
                type: 'Потрачено на коллекцию', value: sum_card_nowyearSpider_Man + sum_card_nowyearTeenage_Mutant_Ninja + sum_card_nowyearBakugan +
                    sum_card_nowyearTransformers + sum_card_nowyearBeyblade
            })

        dataPiePrice.push({ type: 'Пройдено игр', value: summGames },
            { type: 'Покрашено миниатюр', value: summMiniatures },
            { type: 'Прочитано книг', value: summBooks })

        res.status(200).json({
            jobsMonth,
            gamesAssemble,
            booksAssemble,
            hobbyAssemble,
            cardsAssemble,
            beybladeAssemble,
            sortedGames,
            sortedGamesPriceCount,
            sortedGamesPrice,
            sortedbooksPrice,
            sortedbooksPriceCount,
            sortedBeybladePriceCount,
            sortedCardPriceTeenage_Mutant_Ninja,
            sortedCardPriceSpider_Man,
            sortedCardPriceBakugan,
            sortedCardPriceBeyblade,
            sortedCardPriceTransformers,
            sortedCardPriceNaruto,
            sortedCardPriceSuperRacing,
            sortedBooks,
            sortedMiniatures,
            sortedPayments,
            sortedSalary,
            summGames,
            summBooks,
            summMiniatures,
            summPayments,
            sum_games_nowyear,
            sum_miniatures_nowyear,
            sum_color_nowyear,
            sum_books_nowyear,
            sum_card_nowyear,
            sum_beyblade_nowyear,
            sum_card_nowyearSpider_Man,
            sum_card_nowyearTeenage_Mutant_Ninja,
            sum_card_nowyearBakugan,
            sum_card_nowyearNaruto,
            sum_card_nowyearSuperRacing,
            sum_card_nowyearTransformers,
            sum_card_nowyearBeyblade,
            time_games_nowyear,
            summ_early_payment,
            summ_payments,
            summ_salary_year,
            summ_bonus_year,
            summ_delta,
            count_books_price,
            count_games_price,
            count_card_price,
            count_card_priceSpider_Man,
            count_card_priceTeenage_Mutant_Ninja,
            count_card_priceBakugan,
            count_miniatures_price,
            count_card_priceBeyblade,
            count_card_priceTransformers,
            count_card_priceSuperRacing,
            count_card_priceNaruto,
            count_beyblade_price,
            dataPieCount,
            dataPiePrice,
            miniature_pulse,
            books_pulse,
            games_pulse,
            games_price_pulse,
            books_price_pulse,
            miniatures_price_pulse,
            books_price,
            books_list_count,
            game_over,
            game_over_count,
            books_write,
            books_write_count,
            count_other_card_price,
            sum_other_card_nowyear,
            cardsOtherCollection
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const games_static = async (req, res) => {
    try {

        var listData4 = []
        var listData1 = []
        var sumTime = 0
        var sumPriceGames = 0
        var cardUbisoftNot = 0
        var cardUbisoftYes = 0
        var cardPlayStationYes = 0
        var cardPlayStationNot = 0
        var cardSteamNot = 0
        var cardSteamYes = 0

        const games_list = await Games.find()

        games_list.filter(obj => obj.compilation === 'PlayStation').
            map(obj => {
                if (obj.presence === 'Не Пройдено') {
                    cardPlayStationNot += 1,
                        sumPriceGames += obj.summ_game
                } else {
                    cardPlayStationYes += 1,
                        sumTime += obj.time_game,
                        sumPriceGames += obj.summ_game
                }
            })

        games_list.filter(obj => obj.compilation === 'Ubisoft Connect').
            map(obj => {
                if (obj.presence === 'Не Пройдено') {
                    cardUbisoftNot += 1,
                        sumPriceGames += obj.summ_game
                } else {
                    cardUbisoftYes += 1,
                        sumTime += obj.time_game,
                        sumPriceGames += obj.summ_game
                }
            })

        games_list.filter(obj => obj.compilation === 'Steam').
            map(obj => {
                if (obj.presence === 'Не Пройдено') {
                    cardSteamNot += 1,
                        sumPriceGames += obj.summ_game
                } else {
                    cardSteamYes += 1,
                        sumTime += obj.time_game,
                        sumPriceGames += obj.summ_game
                }
            })

        listData4.push(
            { key: 'Steam', name: 'Пройдено', value: cardSteamYes },
            { key: 'Steam', name: 'Не пройдено', value: cardSteamNot },
            { key: 'Ubisoft Connect', name: 'Пройдено', value: cardUbisoftYes },
            { key: 'Ubisoft Connect', name: 'Не пройдено', value: cardUbisoftNot },
            { key: 'PlayStation', name: 'Пройдено', value: cardPlayStationYes },
            { key: 'PlayStation', name: 'Не пройдено', value: cardPlayStationNot },
            { key: 'Общее количество', name: 'Пройдено', value: cardSteamYes + cardUbisoftYes + cardPlayStationYes },
            { key: 'Общее количество', name: 'Не пройдено', value: cardSteamNot + cardUbisoftNot + cardPlayStationNot },
        )

        listData1.push(
            [{ key: 'Steam', name: 'Пройдено', value: cardSteamYes },
            { key: 'Steam', name: 'Не пройдено', value: cardSteamNot }],
            [{ key: 'Ubisoft Connect', name: 'Пройдено', value: cardUbisoftYes },
            { key: 'Ubisoft Connect', name: 'Не пройдено', value: cardUbisoftNot }],
            [{ key: 'PlayStation', name: 'Пройдено', value: cardPlayStationYes },
            { key: 'PlayStation', name: 'Не пройдено', value: cardPlayStationNot }],
            [{ key: 'Общее количество', name: 'Пройдено', value: cardSteamYes + cardUbisoftYes + cardPlayStationYes },
            { key: 'Общее количество', name: 'Не пройдено', value: cardSteamNot + cardUbisoftNot + cardPlayStationNot }],
        )

        const procentStaticGames = Number(((cardSteamYes + cardUbisoftYes + cardPlayStationYes) * 100 / (games_list.length)).toFixed(2))

        res.status(200).send({
            listData1,
            listData4,
            sumPriceGames,
            sumTime,
            procentStaticGames
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const salary_chart = async (req, res) => {
    try {
        const salary = await SalaryModel.find()
        const bonus = await BonusModel.find()

        var salaryPieGroupCompany = [];
        var salaryPieGroupYear = [];
        var salaryYearSum = []
        var salaryMonth = []

        var bonusGroupMonth = [];
        var bonusPieGroupYear = [];
        var bonusYearSum = []
        var bonusMonth = []
        var bonusSumm = 0

        salary.map(obj => {
            salaryYearSum.push({ date: obj.date_salary.slice(6), sum: obj.summ_salary })
            salaryMonth.push({ date_salary: obj.date_salary, summ_salary: obj.summ_salary, company: obj.company })
        })

        bonus.map(obj => {
            bonusYearSum.push({ date: obj.date_bonus.slice(6), sum: obj.summ_bonus })
            bonusMonth.push({ date: obj.date_bonus.slice(3), sum: obj.summ_bonus })
            obj.status_bonus === 'Не Выплачено' ? bonusSumm += obj.summ_bonus : obj
        })

        salary.reduce((res, value) => {
            if (!res[value.company]) {
                res[value.company] = { _id: value.company, sum: 0 };
                salaryPieGroupCompany.push(res[value.company])
            }
            res[value.company].sum += value.summ_salary;
            return res;
        }, {});

        salaryYearSum.reduce((res, value) => {
            if (!res[(value.date)]) {
                res[value.date] = { _id: value.date, sum: 0 };
                salaryPieGroupYear.push(res[value.date])
            }
            res[value.date].sum += value.sum;
            return res;
        }, {});

        bonusYearSum.reduce((res, value) => {
            if (!res[(value.date)]) {
                res[value.date] = { _id: value.date, sum: 0 };
                bonusPieGroupYear.push(res[value.date])
            }
            res[value.date].sum += value.sum;
            return res;
        }, {});

        bonusMonth.reduce((res, value) => {
            if (!res[(value.date)]) {
                res[value.date] = { _id: value.date, sum: 0 };
                bonusGroupMonth.push(res[value.date])
            }
            res[value.date].sum += value.sum;
            return res;
        }, {});

        res.status(200).json({
            bonusSumm,
            salaryPieGroupYear,
            salaryPieGroupCompany,
            salaryMonth,
            bonusPieGroupYear,
            bonusGroupMonth
        })

    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const repair_static = async (req, res) => {

    try {

        var rate = 0
        var percent = 0
        var sumCategory = 0
        var sumData = 0
        const data = await RepairModel.aggregate([{ $match: { category_repair: { $not: { $regex: 'Сбережение' } } } },
        { $group: { _id: "$category_repair", sales: { $sum: "$sum_repair" } } }])

        data.map(arr => sumCategory += arr.sales)

        const repair = await RepairModel.find({ "category_repair": "Сбережение" })

        rate = repair[0].sum_repair

        percent = (rate / 98135.8)

        data.map(arr => sumData += arr.sales)

        res.status(200).json({
            rate,
            percent,
            data,
            sumData
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const card_static = async (req, res) => {

    try {
        var countNotYes = 0
        var countReplace = 0
        var children = []
        var childrenReplace = []
        var cardPrice = []
        var cardPriceReplace = []
        var staticCards = []
        var notCard = 0
        var yesCard = 0
        var cardColumn = []
        var cardPie = []
        var cardList = ''
        var cardNumber = ''
        var cardSummCollection = 0
        const card = await CardModel.find({ collection_card: req.params.collection_card }).sort({ "number_card": 1 })

        const card_list = await CardModel.aggregate([
            { $match: { collection_card: req.params.collection_card } },
            {
                $group: {
                    _id: "$level_card",
                    children: { $push: { title: "$status_card", number: "$number_card" } },
                    count: { $sum: 1 },
                    sum: { $sum: "$summ_card" }
                }
            }
        ])

        card_list.map((obj) => {
            var numberCard = ''
            obj.children.sort((a, b) => a.number - b.number)
            obj.children.map(child => {
                if (child.title === 'Нет') {
                    notCard++
                    numberCard += `${obj._id}-${child.number}, `
                } else yesCard++
            }),
                staticCards.push({
                    key: obj._id,
                    yesCards: yesCard,
                    notCards: notCard,
                    countCards: obj.count,
                    sumCards: obj.sum,
                    procentYesCards: (yesCard * 100 / obj.count).toFixed(2),
                    numberCard: numberCard,
                }),
                cardSummCollection += obj.sum,
                notCard = 0,
                yesCard = 0
        })

        card.filter(obj => obj.status_card === 'Нет')
            .map(obj => {
                children.push({ title: obj.number_card + ' ' + obj.name_card + ' ' + obj.level_card })
                countNotYes += 1
                cardList += `${obj.number_card} ${obj.name_card} ${obj.level_card} \n`
                cardNumber += `${obj.number_card}, `
            })

        card.filter(obj => obj.status_card === 'Замена')
            .map(obj => {
                childrenReplace.push({ title: obj.number_card + ' ' + obj.name_card + ' ' + obj.level_card })
                countReplace += 1
            })

        staticCards.map((obj) => cardColumn.push({ key: obj.key, name: 'Всего', value: obj.countCards },
            { key: obj.key, name: 'Есть', value: obj.yesCards },
            { key: obj.key, name: 'Нет', value: obj.notCards },
        ))

        staticCards.sort((a, b) => b.procentYesCards - a.procentYesCards)

        const procentCard = (100 - countNotYes * 100 / card.length).toFixed(2)
        const countYes = card.length - countNotYes
        const countAllCard = card.length

        cardPrice.push({ title: req.params.collection_card, children: children })

        cardPriceReplace.push({ title: req.params.collection_card, children: childrenReplace })

        res.status(200).json({
            procentCard,
            staticCards,
            cardPrice,
            cardPriceReplace,
            countReplace,
            countNotYes,
            countYes,
            countAllCard,
            cardColumn,
            cardPie,
            cardList,
            cardNumber,
            cardSummCollection
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const beyblade_static = async (req, res) => {

    try {
        var staticBeyblades = []
        var notBeyblade = 0
        var yesBeyblade = 0
        var notProcent = 0
        var yesProcent = 0
        var children = []
        var beybladeColumn = []
        var beybladeSummCollection = 0
        var beybladePrice = []
        const beyblade_list = await BeybladeModel.aggregate([
            {
                $group: {
                    _id: "$series",
                    children: { $push: { title: "$status_beyblade", name: "$name_beyblade" } },
                    count: { $sum: 1 },
                    sum: { $sum: "$summ_beyblade" }
                }
            }
        ])

        beyblade_list.map((obj) => {
            var name_beyblade = ''
            obj.children.map(child => {
                if (child.title === 'Нет') {
                    notBeyblade++
                    name_beyblade += `${child.name}, `
                    children.push({ title: child.name })
                } else yesBeyblade++
            }),
                staticBeyblades.push({
                    key: obj._id,
                    yesBeyblades: yesBeyblade,
                    notBeyblades: notBeyblade,
                    countBeyblades: obj.count,
                    sumBeyblades: obj.sum,
                    procentYesBeyblades: (yesBeyblade * 100 / obj.count).toFixed(2),
                    name_beyblade: name_beyblade,
                }),

                beybladePrice.push({
                    title: `Недостающие волчки ${obj._id}`,
                    countNotYes: notBeyblade,
                    beybladePrices: [{ title: obj._id, children: children }]
                })

            notProcent += notBeyblade,
                yesProcent += yesBeyblade,
                beybladeSummCollection += obj.sum,
                notBeyblade = 0,
                yesBeyblade = 0
            children = []

        })

        staticBeyblades.map((obj) => beybladeColumn.push({ key: obj.key, name: 'Всего', value: obj.countBeyblades },
            { key: obj.key, name: 'Есть', value: obj.yesBeyblade },
            { key: obj.key, name: 'Нет', value: obj.notBeyblades },
        ))

        staticBeyblades.sort((a, b) => b.procentYesBeyblades - a.procentYesBeyblades)

        var procentAllBeyblades = ((yesProcent * 100) / (yesProcent + notProcent)).toFixed(2)

        res.status(200).json({
            beybladePrice,
            procentAllBeyblades,
            yesProcent,
            notProcent,
            staticBeyblades,
            beybladeSummCollection
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}