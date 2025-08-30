import ComputerModel from "../models/Computer.js"

export const get_computer = async (req, res) => {
    try {

        var statistic = [
            {}
        ]

        const category = [
            { text: 'Процессор', value: 'Процессор' },
            { text: 'Материнская плата', value: 'Материнская плата' },
            { text: 'Блок питания', value: 'Блок питания' },
            { text: 'Корпус', value: 'Корпус' },
            { text: 'Видеокарта', value: 'Видеокарта' },
            { text: 'Охлаждение процессора', value: 'Охлаждение процессора' },
            { text: 'Вентиляторы для корпуса', value: 'Вентиляторы для корпуса' },
            { text: 'Оперативная память', value: 'Оперативная память' },
            { text: 'Накопитель', value: 'Накопитель' },
            { text: 'Звуковая карта', value: 'Звуковая карта' },
            { text: 'Монитор', value: 'Монитор' },
            { text: 'Клавиатура', value: 'Клавиатура' },
            { text: 'Мышь', value: 'Мышь' },
            { text: 'Наушники', value: 'Наушники' },
            { text: 'Микрофон', value: 'Микрофон' },
            { text: 'Стол', value: 'Стол' },
            { text: 'Кресло', value: 'Кресло' }]

        const computer = await ComputerModel.find()

        if (!computer) {
            return res.status(404).send({
                message: 'Комплектующие не найдены'
            })
        }


        for (var i = 0; i < computer.length; i++) {
            if (computer[i].category === "Звуковая карта" ||
                computer[i].category === "Монитор" ||
                computer[i].category === "Клавиатура" ||
                computer[i].category === "Мышь" ||
                computer[i].category === "Наушники" ||
                computer[i].category === "Микрофон" ||
                computer[i].category === "Стол" ||
                computer[i].category === "Кресло") {
                console.log('net')
            }
            else {
                console.log('da')
            }
        }

        res.status(200).json({
            computer,
            category
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const edit_computer = async (req, res) => {
    try {

        const computer_edit = await ComputerModel
            .findByIdAndUpdate(req.params.id, {
                components_name: req.body.components_name,
                components_summ: req.body.components_summ,
                category: req.body.category,
                date_buy: ((req.body.date_buy).substr(0, 10)).split("-").reverse().join("-")
            })
        res.status(200).json({
            computer_edit
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const delete_computer = async (req, res) => {
    try {

        const deleteComputer = await ComputerModel.
            findByIdAndDelete(req.params.id)

        if (!deleteComputer) {
            return res.status(404).send({
                message: "Комплектующие не найдены"
            })
        }

        return res.status(200).json({
            deleteComputer
        })

    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const add_computer = async (req, res) => {
    try {

        var daysUTC_3 = new Date(req.body.date_buy)
        daysUTC_3.setDate(daysUTC_3.getDate() + 1)
        daysUTC_3 = daysUTC_3.toISOString().slice(0, 10).split("-").reverse().join("-")

        console.log(req.body)
        const computerDoc = new ComputerModel({
            components_name: req.body.components_name,
            components_summ: req.body.components_summ,
            category: req.body.category,
            date_buy: daysUTC_3,
            categorychapter: req.params.categorychapter
        })

        console.log(computerDoc)

        const computer = await computerDoc.save()

        res.status(200).json({
            ...computer._doc
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}