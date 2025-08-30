import moment from "moment"
import PulseModel from '../models/Pulse.js'
import JobsMonthModel from '../models/JobsMounth.js'

export const job = async (req, res) => {

    console.log('Start job')
    var statisticMonth_1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var statisticMonth_2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    var statisticMonth1 = []

    function get_static(statisticMounth, statisticMounth2, index) {

        var returnText = ''

        const text = [
            { key: '0>', title: `За месяц было выплачено ипотеки на сумму ${(statisticMounth).toFixed(2)}р. Это на ${(statisticMounth - statisticMounth2).toFixed(2)}р. больше чем в предыдущем месяце.` },
            { key: '0<', title: `За месяц было выплачено ипотеки на сумму ${(statisticMounth).toFixed(2)}р. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)}р. меньше чем в предыдущем месяце.` },
            { key: '0=', title: `За месяц было выплачено ипотеки на сумму ${(statisticMounth).toFixed(2)}р. Это столько же, сколько и в предыдущем месяце.` },
            { key: '1>', title: `За месяц было внесено досрочных платежей на сумму ${(statisticMounth).toFixed(2)}р. Это на ${(statisticMounth - statisticMounth2).toFixed(2)}р. больше чем в предыдущем месяце.` },
            { key: '1<', title: `За месяц было внесено досрочных платежей на сумму ${(statisticMounth).toFixed(2)}р. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)}р. меньше чем в предыдущем месяце.` },
            { key: '1=', title: `За месяц было внесено досрочных платежей на сумму ${(statisticMounth).toFixed(2)}р. Это столько же, сколько и в предыдущем месяце.` },
            { key: '2>', title: `За месяц было заработано ${(statisticMounth).toFixed(2)}р. Это на ${(statisticMounth - statisticMounth2).toFixed(2)}р. больше чем в предыдущем месяце.` },
            { key: '2<', title: `За месяц было заработано ${(statisticMounth).toFixed(2)}р. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)}р. меньше чем в предыдущем месяце.` },
            { key: '2=', title: `За месяц было заработано ${(statisticMounth).toFixed(2)}р. Это столько же, сколько и в предыдущем месяце.` },
            { key: '3>', title: `За месяц было заработано в выходные ${(statisticMounth).toFixed(2)}р. Это на ${(statisticMounth - statisticMounth2).toFixed(2)}р. больше чем в предыдущем месяце.` },
            { key: '3<', title: `За месяц было заработано в выходные ${(statisticMounth).toFixed(2)}р. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)}р. меньше чем в предыдущем месяце.` },
            { key: '3=', title: `За месяц было заработано в выходные ${(statisticMounth).toFixed(2)}р. Это столько же, сколько и в предыдущем месяце.` },
            { key: '4>', title: `За месяц было пройдено ${statisticMounth} игры. Это на ${(statisticMounth - statisticMounth2).toFixed(2)} игр больше чем в предыдущем месяце.` },
            { key: '4<', title: `За месяц было пройдено ${statisticMounth} игры. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)} игр меньше чем в предыдущем месяце.` },
            { key: '4=', title: `За месяц было пройдено ${statisticMounth} игры. Это столько же, сколько и в предыдущем месяце.` },
            { key: '5>', title: `За месяц было приобретено ${statisticMounth} игры. Это на ${(statisticMounth - statisticMounth2).toFixed(2)} игр больше чем в предыдущем месяце.` },
            { key: '5<', title: `За месяц было приобретено ${statisticMounth} игры. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)} игр меньше чем в предыдущем месяце.` },
            { key: '5=', title: `За месяц было приобретено ${statisticMounth} игры. Это столько же, сколько и в предыдущем месяце.` },
            { key: '6>', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на игры. Это на ${(statisticMounth - statisticMounth2).toFixed(2)}р. больше чем в предыдущем месяце.` },
            { key: '6<', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на игры. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)}р. меньше чем в предыдущем месяце.` },
            { key: '6=', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на игры. Это столько же, сколько и в предыдущем месяце.` },
            { key: '7>', title: `За месяц было прочитано ${statisticMounth} книги. Это на ${(statisticMounth - statisticMounth2).toFixed(2)} книг больше чем в предыдущем месяце.` },
            { key: '7<', title: `За месяц было прочитано ${statisticMounth} книги. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)} книг меньше чем в предыдущем месяце.` },
            { key: '7=', title: `За месяц было прочитано ${statisticMounth} книги. Это столько же, сколько и в предыдущем месяце.` },
            { key: '8>', title: `За месяц было приобретено ${statisticMounth} книги. Это на ${(statisticMounth - statisticMounth2).toFixed(2)} книг больше чем в предыдущем месяце.` },
            { key: '8<', title: `За месяц было приобретено ${statisticMounth} книги. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)} книг меньше чем в предыдущем месяце.` },
            { key: '8=', title: `За месяц было приобретено ${statisticMounth} книги. Это столько же, сколько и в предыдущем месяце.` },
            { key: '9>', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на книги. Это на ${(statisticMounth - statisticMounth2).toFixed(2)}р. больше чем в предыдущем месяце.` },
            { key: '9<', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на книги. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)}р. меньше чем в предыдущем месяце.` },
            { key: '9=', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на книги. Это столько же, сколько и в предыдущем месяце.` },
            { key: '10>', title: `За месяц было приобретено ${statisticMounth} волчка. Это на ${(statisticMounth - statisticMounth2).toFixed(2)} волчка больше чем в предыдущем месяце.` },
            { key: '10<', title: `За месяц было приобретено ${statisticMounth} волчка. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)} волчка меньше чем в предыдущем месяце.` },
            { key: '10=', title: `За месяц было приобретено ${statisticMounth} волчка. Это столько же, сколько и в предыдущем месяце.` },
            { key: '11>', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на волчки. Это на ${(statisticMounth - statisticMounth2).toFixed(2)}р. больше чем в предыдущем месяце.` },
            { key: '11<', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на волчки. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)}р. меньше чем в предыдущем месяце.` },
            { key: '11=', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на волчки. Это столько же, сколько и в предыдущем месяце.` },
            { key: '12>', title: `За месяц было приобретено ${statisticMounth} карточки. Это на ${(statisticMounth - statisticMounth2).toFixed(2)} карточки больше чем в предыдущем месяце.` },
            { key: '12<', title: `За месяц было приобретено ${statisticMounth} карточки. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)} карточки меньше чем в предыдущем месяце.` },
            { key: '12=', title: `За месяц было приобретено ${statisticMounth} карточки. Это столько же, сколько и в предыдущем месяце.` },
            { key: '13>', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на карточки. Это на ${(statisticMounth - statisticMounth2).toFixed(2)}р. больше чем в предыдущем месяце.` },
            { key: '13<', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на карточки. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)}р. меньше чем в предыдущем месяце.` },
            { key: '13=', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на карточки. Это столько же, сколько и в предыдущем месяце.` },
            { key: '14>', title: `За месяц было покрашено ${statisticMounth} миниатюры. Это на ${(statisticMounth - statisticMounth2).toFixed(2)} миниатюр больше чем в предыдущем месяце.` },
            { key: '14<', title: `За месяц было покрашено ${statisticMounth} миниатюры. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)} миниатюр меньше чем в предыдущем месяце.` },
            { key: '14=', title: `За месяц было покрашено ${statisticMounth} миниатюры. Это столько же, сколько и в предыдущем месяце.` },
            { key: '15>', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на хобби. Это на ${(statisticMounth - statisticMounth2).toFixed(2)}р. больше чем в предыдущем месяце.` },
            { key: '15<', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на хобби. Это на ${(statisticMounth2 - statisticMounth).toFixed(2)}р. меньше чем в предыдущем месяце.` },
            { key: '15=', title: `За месяц было потрачено ${(statisticMounth).toFixed(2)}р. на хобби. Это столько же, сколько и в предыдущем месяце.` },
        ]

        text.map((t) => t.key === index ? returnText = t.title : t.title)

        return returnText
    }

    var statisticName = [
        'Выплачено ипотеки',
        'Внесено досрочных платежей',
        'Заработок',
        'Подработки',
        'Пройдено игр',
        'Приобретено игр',
        'Потрачено на игры',
        'Прочитано книг',
        'Приобретено книг',
        'Потрачено на книги',
        'Приобретено волчков',
        'Потрачено на волчки',
        'Приобретено карточек',
        'Потрачено на карточки',
        'Покрашено миниатюр',
        'Потрачено на хобби']

    const month = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
    const month_2 = moment().subtract(2, 'months').endOf('month').format('YYYY-MM-DD')

    const pulse_group_charts = await PulseModel.aggregate([
        {
            $match: {
                date_pulse: {
                    $gte: new Date(`${month.slice(0, 7)}T00:00:00.000Z`),
                    $lte: new Date(`${month}T23:59:59.000Z`)
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
                    $gte: new Date(`${month_2.slice(0, 7)}T00:00:00.000Z`),
                    $lte: new Date(`${month_2}T23:59:59.000Z`)
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
            statisticMonth_1[4] = pulse_group_charts[i].sum
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'games_price') {
            statisticMonth_1[5] = pulse_group_charts[i].sum
            statisticMonth_1[6] = pulse_group_charts[i].sum_pulse
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'salary') {
            statisticMonth_1[2] = pulse_group_charts[i].count_pulse_salary
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'bonus') {
            statisticMonth_1[3] = pulse_group_charts[i].sum_pulse
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'payments') {
            statisticMonth_1[0] = pulse_group_charts[i].count_pulse
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'payments_early') {
            statisticMonth_1[1] = pulse_group_charts[i].count_pulse
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'books') {
            statisticMonth_1[7] = pulse_group_charts[i].sum
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'books_price') {
            statisticMonth_1[8] = pulse_group_charts[i].sum
            statisticMonth_1[9] = pulse_group_charts[i].sum_pulse
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'beyblade_price') {
            statisticMonth_1[10] = pulse_group_charts[i].sum
            statisticMonth_1[11] = pulse_group_charts[i].sum_pulse
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'card_price') {
            statisticMonth_1[12] = pulse_group_charts[i].sum
            statisticMonth_1[13] = pulse_group_charts[i].sum_pulse
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'miniature') {
            statisticMonth_1[14] = pulse_group_charts[i].sum
            statisticMonth_1[15] += pulse_group_charts[i].sum_pulse
        }
        else if (pulse_group_charts[i]._id.category_pulse === 'color_price') {
            statisticMonth_1[15] += pulse_group_charts[i].sum_pulse
        }
    }

    for (var i = 0; i < pulse_group_charts2.length; i++) {
        if (pulse_group_charts2[i]._id.category_pulse === 'games') {
            statisticMonth_2[4] = pulse_group_charts2[i].sum
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'games_price') {
            statisticMonth_2[5] = pulse_group_charts2[i].sum
            statisticMonth_2[6] = pulse_group_charts2[i].sum_pulse
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'salary') {
            statisticMonth_2[2] = pulse_group_charts2[i].count_pulse_salary
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'bonus') {
            statisticMonth_2[3] = pulse_group_charts2[i].sum_pulse
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'payments') {
            statisticMonth_2[0] = pulse_group_charts2[i].count_pulse
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'payments_early') {
            statisticMonth_2[1] = pulse_group_charts2[i].count_pulse
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'books') {
            statisticMonth_2[7] = pulse_group_charts2[i].sum
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'books_price') {
            statisticMonth_2[8] = pulse_group_charts2[i].sum
            statisticMonth_2[9] = pulse_group_charts2[i].sum_pulse
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'beyblade_price') {
            statisticMonth_2[10] = pulse_group_charts2[i].sum
            statisticMonth_2[11] = pulse_group_charts2[i].sum_pulse
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'card_price') {
            statisticMonth_2[12] = pulse_group_charts2[i].sum
            statisticMonth_2[13] = pulse_group_charts2[i].sum_pulse
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'miniature') {
            statisticMonth_2[14] = pulse_group_charts2[i].sum
            statisticMonth_2[15] += pulse_group_charts2[i].sum_pulse
        }
        else if (pulse_group_charts2[i]._id.category_pulse === 'color_price') {
            statisticMonth_2[15] += pulse_group_charts2[i].sum_pulse
        }
    }

    for (var i = 0; i < statisticMonth_2.length; i++) {
        if (statisticMonth_1[i] > statisticMonth_2[i]) {
            statisticMonth1.push({ name: statisticName[i], value: (statisticMonth_1[i]).toFixed(2), text: get_static(statisticMonth_1[i], statisticMonth_2[i], `${i}>`), prefix: '>', key: i })
        } else if (statisticMonth_1[i] === statisticMonth_2[i]) {
            statisticMonth1.push({ name: statisticName[i], value: (statisticMonth_1[i]).toFixed(2), text: get_static(statisticMonth_1[i], statisticMonth_2[i], `${i}=`), prefix: '=', key: i })
        }
        else {
            statisticMonth1.push({ name: statisticName[i], value: (statisticMonth_1[i]).toFixed(2), text: get_static(statisticMonth_1[i], statisticMonth_2[i], `${i}<`), prefix: '<', key: i })
        }
    }

    const JobsMonth = {
        date_jobs: Date.now(),
        children: statisticMonth1,
        modal_view: false
    }

    await JobsMonthModel.insertMany(JobsMonth)

}
