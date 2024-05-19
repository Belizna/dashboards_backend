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

export const book_static = async (req,res ) => {

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

        const writeBooks = await WriteBooksModel.find({compilation: req.params.book_name})
        const books2 = await Book.find({compilation: req.params.book_name})

        writeBooks.filter(obj => obj.format === 'роман').
        map(obj => {
            obj.presence=='Прочитано' ? readRomans+=1 : reatNotRomans+=1 
        })

        writeBooks.filter(obj => obj.format === 'повесть').
        map(obj => {
            obj.presence=='Прочитано' ? readBigStory+=1 : readNotBigStory+=1 
        })

        writeBooks.filter(obj => obj.format === 'рассказ').
        map(obj => {
            obj.presence=='Прочитано' ? readStory+=1 : readNotStory+=1 
        })

        books2.map(obj => {
            booksPriceSum += obj.summ_book,
            obj.presence = 'Есть' ? booksPriceCount+=1 : obj
        })

        const booksCount = books2.length

        const booksProcentStatic = Number(((readRomans+readStory+readBigStory)*100 /writeBooks.length).toFixed(2))

        if (readRomans != 0 + reatNotRomans != 0)
        {
            booksDataRomans.push(
                {name : "Прочитано" , value: readRomans},
                {name : "Осталось" , value: reatNotRomans})

            booksDataDemoLine.push(
                {key: 'Романов',name: 'Всего',value: readRomans + reatNotRomans},
                {key: 'Романов',name: 'Прочитано',value: readRomans},
                {key: 'Романов',name: 'Осталось',value: reatNotRomans})
        }
        else booksDataRomans = null

        if (readBigStory + readNotBigStory != 0)
        {
            booksDataBigStory.push(
                {name : "Прочитано" , value: readBigStory},
                {name : "Осталось" , value: readNotBigStory})

            booksDataDemoLine.push(
                {key: 'Повестей',name: 'Всего',value: readBigStory + readNotBigStory},
                {key: 'Повестей',name: 'Прочитано',value: readBigStory},
                {key: 'Повестей',name: 'Осталось',value: readNotBigStory})
        }
        else booksDataBigStory = null

        if (readStory != 0 + readNotStory != 0)
        {
            booksDataStory.push(
                {name : "Прочитано" , value: readStory},
                {name : "Осталось" , value: readNotStory})

            booksDataDemoLine.push(
                {key: 'Рассказов',name: 'Всего',value: readStory + readNotStory},
                {key: 'Рассказов',name: 'Прочитано',value: readStory},
                {key: 'Рассказов',name: 'Осталось',value: readNotStory})
        }
        else booksDataStory = null

        booksDataDemoLine.push(
            {key: 'Общее количество',name: 'Всего',value: writeBooks.length},
            {key: 'Общее количество',name: 'Прочитано',value: readStory+readBigStory+readRomans},
            {key: 'Общее количество',name: 'Осталось',value: readNotStory+readNotBigStory+reatNotRomans})

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
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const credit_static = async (req,res) => {

    try{
    const earlyPay = await EarlyPaymentsModel.find()
    const credit = await CreditModel.find()
    var early_sum = 0
    
    const payments = await PaymentsModel.aggregate([{$match: {status_payment: 'Оплачено'}}, 
        {$group: {_id: null, count_month_paid: { "$sum": 1 }, paid_fix: {$sum: "$summ_payment"}}}]) 

    const not_payments = await PaymentsModel.aggregate([{$match: {status_payment: 'Не оплачено'}}, 
        {$group: {_id: null, count_month_remainder: { "$sum": 1 }, remainder: {$sum: "$summ_payment"}}}]) 

    for(var i = 0; i < earlyPay.length; i++)
    {
        early_sum += earlyPay[i].summ_earlyPayment
    }

    const procentStatic = (((payments[0].paid_fix+early_sum)*100) /
    (payments[0].paid_fix+early_sum+not_payments[0].remainder)).toFixed(4)
    const count_month_remainder = not_payments[0].count_month_remainder
    const count_month_paid = payments[0].count_month_paid
    const saving = Number((credit[0].duty - (not_payments[0].remainder + payments[0].paid_fix + early_sum)).toFixed(2))
    const overpayment = Number((credit[0].duty - (credit[0].summ_credit + saving)).toFixed(2))
    const paid= Number((payments[0].paid_fix+early_sum).toFixed(2))
    const remainder = not_payments[0].remainder

    res.status(200).send({
        paid,
        remainder,
        procentStatic,
        count_month_paid,
        count_month_remainder,
        saving,
        overpayment,
        early_sum,
        earlyPay
    })
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const hobby_static = async (req, res) => {
    try{
        const miniatures = await MiniatureModel.aggregate([{$group: {_id: null, sum: {$sum: "$price_miniature"}}}]) 
        const color = await ColorModel.aggregate([{$group: {_id: null, sum: {$sum: "$summ_color"}}}]) 
        const count_miniatures = await MiniatureModel.aggregate([{$group: {_id: null, sum: {$sum: "$count_miniatures"}}}]) 
        const count_miniatures_color = await MiniatureModel.aggregate([{$group: {_id: null, sum: {$sum: "$count_miniatures_color"}}}]) 
        const procent_color_all = await MiniatureModel.aggregate([
            {$group: {_id: "$collection_miniature",
            sum_count: {$sum: "$count_miniatures"},
            sum_count_color: {$sum: "$count_miniatures_color"}
        }}])

        var test = []
        var columnHobby = []

        procent_color_all.map((obj) => test.push([{key : obj._id, name: 'Покрашено', value : obj.sum_count_color}, 
        {name: 'Осталось', key : obj._id,value : obj.sum_count -obj.sum_count_color }]))

        procent_color_all.map((obj) => columnHobby.push({key: obj._id, name: 'Всего', value: obj.sum_count},
        {key: obj._id, name: 'Покрашено', value: obj.sum_count_color},
        {key: obj._id, name: 'Осталось', value: obj.sum_count -obj.sum_count_color}))
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
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const main_static = async (req, res) => {
    try{

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
            let gamesPrice = []
            let games_datePrice = []
            let cardPrice = []
            let card_datePrice = []
            let books = []
            let books_date = []
            let booksPrice = []
            let books_datePrice = []
            let miniature = []
            let miniature_date = []
            let payments = []
            let payments_date = []
            let salary = []
            let salary_date = []
            let sum_games_nowyear = 0
            let sum_books_nowyear = 0
            let sum_color_nowyear = 0
            let sum_miniatures_nowyear = 0
            let time_games_nowyear = 0
            let count_games_price = 0
            let count_miniatures_price = 0
            let summ_delta
            var books_pulse =[]
            var miniature_pulse =[]
            var games_pulse =[]
            var books_price_pulse =[]
            var games_price_pulse = []
            var miniatures_price_pulse = []
            var books_list_count = 0
            var books_price =[]
            var game_over = []
            var game_over_count = 0
            var books_write = []
            var books_write_count = 0
            let count_books_price = 0

            //лист для покупки книг и количество
        const books_list_price  = await BookModel.aggregate([
            {$match: {presence: 'Нет'}},
            { $group : { _id : "$compilation", 
                        children: {$push: {title: "$book_name"}}, 
                        count : {$sum: 1}}}
          ])

          books_list_price.map(
            (obj) => {
            books_price.push({title : obj._id, children: obj.children}) , 
            books_list_count+= obj.count 
            })

          //лист количество не пройденных игр и количество
          const games_list  = await Games.aggregate([
            {$match: {presence: 'Не Пройдено'}},
            { $group : { _id : "$compilation", 
                        children: {$push: {title: "$game_name" }}, 
                        count : {$sum: 1}}}
          ])

          games_list.map(
            (obj) => {
                game_over.push({title : obj._id, children: obj.children}),
                game_over_count+= obj.count
            })

          //лист количества не прочитанных книг и количество
          const books_write_list  = await WriteBooksModel.aggregate([
            {$match: {presence: 'Не Прочитано'}},
            { $group : { _id : "$compilation", 
                        children: {$push: {title: "$book_name"}}, 
                        count : {$sum: 1}}}
          ])

          books_write_list.map(
            (obj) => {
                books_write.push({title : obj._id, children: obj.children}),
                books_write_count+= obj.count
            })

          //лист по движениям покрашено миниатюр, прочитано книг, пройдекно игр, приобретено игр
        const books_list  = await PulseModel.aggregate([
            {$match: { date_pulse: { $gte: new Date(`${req.params.year}-01-01T00:00:00.000Z`), 
                $lte: new Date(`${req.params.year}-12-31T23:59:59.000Z`)
            }}},
            { $group : { _id : "$category_pulse", children: { $push: {title: "$name_pulse"}}}}
          ])

        books_list.map((obj) => {obj._id === 'miniature' ? 
                miniature_pulse.push({title : 'Миниатюры', children: obj.children}) : 
                obj._id === 'games' ? games_pulse.push({title : 'Игры', children: obj.children}) :
                obj._id === 'books' ? books_pulse.push({title : 'Книги', children: obj.children}) :
                obj._id === 'books_price' ? books_price_pulse.push({title : 'Купленные книги', children: obj.children}) :
                obj._id === 'games_price' ? games_price_pulse.push({title : 'Купленные игры', children: obj.children}) :
                obj._id === 'miniatures_price' ? miniatures_price_pulse.push({title : 'Купленные миниатюры', children: obj.children}) :
                obj
            })
          
            //группировка из движений для формирования графиков по месяцам
            const pulse_group_charts = await PulseModel.aggregate([
                {$match: { date_pulse: { $gte: new Date(`${req.params.year}-01-01T00:00:00.000Z`), 
                $lte: new Date(`${req.params.year}-12-31T23:59:59.000Z`)
            }}},
                {
                    $group: {_id: {
                    category_pulse: "$category_pulse", date_pulse: {$substr : ["$date_pulse",0,7]}
                },
                sum: {$sum: 1},
                sum_pulse: {$sum : "$sum_pulse"},
                count_pulse: {$sum: "$sum_pulse_credit"},
                count_pulse_salary: {$sum: "$sum_pulse_salary"},
                time_pulse: {$sum: "$time_pulse"}},
            }, {$sort: {_id: 1}}
            ])  

            let summ_early_payment = 0
            let summ_bonus_year = 0
            let summPayments = 0
            let summGames = 0
            let summMiniatures = 0
            let summBooks = 0
            let summ_salary_year = 0
            let sum_card_nowyear = 0
            let count_card_price = 0

            for (let i = 0; i< pulse_group_charts.length; i ++)
            {   
                if (pulse_group_charts[i]._id.category_pulse === 'games')
                {
                    games.push({date_pulse: pulse_group_charts[i]._id.date_pulse,count_pulse: pulse_group_charts[i].sum})
                    games_date.push(pulse_group_charts[i]._id.date_pulse)
                    time_games_nowyear+=pulse_group_charts[i].time_pulse
                    summGames += pulse_group_charts[i].sum
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'books')
                {
                    books.push({date_pulse: pulse_group_charts[i]._id.date_pulse,count_pulse: pulse_group_charts[i].sum})
                    books_date.push(pulse_group_charts[i]._id.date_pulse)
                    summBooks+=pulse_group_charts[i].sum
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'miniature')
                {
                    miniature.push({date_pulse: pulse_group_charts[i]._id.date_pulse,count_pulse: pulse_group_charts[i].sum})
                    miniature_date.push(pulse_group_charts[i]._id.date_pulse)
                    summMiniatures+=pulse_group_charts[i].sum
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'books_price')
                {   
                    booksPrice.push({date_pulse: pulse_group_charts[i]._id.date_pulse,count_pulse: pulse_group_charts[i].sum})
                    books_datePrice.push(pulse_group_charts[i]._id.date_pulse)
                    sum_books_nowyear+=pulse_group_charts[i].sum_pulse
                    count_books_price+=pulse_group_charts[i].sum
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'payments')
                {
                    payments.push({date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].count_pulse})
                    payments_date.push(pulse_group_charts[i]._id.date_pulse)
                    summPayments+=pulse_group_charts[i].count_pulse
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'salary')
                {
                    salary.push({date_pulse: pulse_group_charts[i]._id.date_pulse, count_pulse: pulse_group_charts[i].count_pulse_salary})
                    salary_date.push(pulse_group_charts[i]._id.date_pulse)
                    summ_salary_year+=pulse_group_charts[i].count_pulse_salary
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'games_price')
                {   
                    gamesPrice.push({date_pulse: pulse_group_charts[i]._id.date_pulse,count_pulse: pulse_group_charts[i].sum})
                    games_datePrice.push(pulse_group_charts[i]._id.date_pulse)
                    sum_games_nowyear += pulse_group_charts[i].sum_pulse,
                    count_games_price += pulse_group_charts[i].sum
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'miniatures_price')
                {
                    sum_miniatures_nowyear += pulse_group_charts[i].sum_pulse
                    count_miniatures_price += pulse_group_charts[i].sum
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'color_price')
                {
                    sum_color_nowyear += pulse_group_charts[i].sum_pulse
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'bonus')
                {
                    summ_bonus_year += pulse_group_charts[i].sum_pulse
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'payments_early')
                {
                    summ_early_payment += pulse_group_charts[i].count_pulse
                }
                else if (pulse_group_charts[i]._id.category_pulse === 'card_price')
                {
                    cardPrice.push({date_pulse: pulse_group_charts[i]._id.date_pulse,count_pulse: pulse_group_charts[i].sum})
                    card_datePrice.push(pulse_group_charts[i]._id.date_pulse)
                    sum_card_nowyear += pulse_group_charts[i].sum_pulse,
                    count_card_price += pulse_group_charts[i].sum
                }
                else continue
            }

            let summ_payments = summPayments - summ_early_payment

            if (summ_salary_year === 0 && summ_bonus_year > 0)
                summ_salary_year += summ_bonus_year
            
            summ_salary_year - summ_bonus_year < 0 ? summ_delta = 0 : summ_delta = summ_salary_year - summ_bonus_year

            let diff_games = diff.filter(date => ! games_date.includes(date))
            diff_games.map((obj) => games.push({date_pulse: obj,count_pulse: 0}))

            let diff_gamesPrice = diff.filter(date => ! games_datePrice.includes(date))
            diff_gamesPrice.map((obj) => gamesPrice.push({date_pulse: obj,count_pulse: 0}))

            let diff_cardPrice = diff.filter(date => ! card_datePrice.includes(date))
            diff_cardPrice.map((obj) => cardPrice.push({date_pulse: obj,count_pulse: 0}))

            let diff_books = diff.filter(date => ! books_date.includes(date))
            diff_books.map((obj) => books.push({date_pulse: obj,count_pulse: 0}))

            let diff_booksPrice = diff.filter(date => ! books_datePrice.includes(date))
            diff_booksPrice.map((obj) => booksPrice.push({date_pulse: obj,count_pulse: 0}))

            let diff_miniature = diff.filter(date => ! miniature_date.includes(date))
            diff_miniature.map((obj) => miniature.push({date_pulse: obj,count_pulse: 0}))

            let diff_payments = diff.filter(date => ! payments_date.includes(date))
            diff_payments.map((obj) => payments.push({date_pulse: obj,count_pulse: 0}))

            let diff_salary = diff.filter(date => ! salary_date.includes(date))
            diff_salary.map((obj) => salary.push({date_pulse: obj,count_pulse: 0}))

            let sortedGames = games.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedGamesPrice = gamesPrice.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedCardPrice = cardPrice.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedBooks = books.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedBooksPrice = booksPrice.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedMiniatures = miniature.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedPayments = payments.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)
            let sortedSalary = salary.sort((r1, r2) => (r1.date_pulse > r2.date_pulse) ? 1 : (r1.date_pulse < r2.date_pulse) ? -1 : 0)

            dataPieCount.push({type: 'Потрачено на игры', value: sum_games_nowyear},
            {type: 'Потрачено на хобби', value: sum_miniatures_nowyear+sum_color_nowyear},
            {type: 'Потрачено на книги', value: sum_books_nowyear},
            {type: 'Потрачено на коллекцию', value: sum_card_nowyear})

            dataPiePrice.push({type: 'Пройдено игр', value: summGames},
            {type: 'Покрашено миниатюр', value: summMiniatures},
            {type: 'Прочитано книг', value: summBooks})

        res.status(200).json({
            sortedGames,
            sortedGamesPrice,
            sortedBooksPrice,
            sortedCardPrice,
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
            time_games_nowyear,
            summ_early_payment,
            summ_payments,
            summ_salary_year,
            summ_bonus_year,
            summ_delta,
            count_books_price,
            count_games_price,
            count_card_price,
            count_miniatures_price,
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
            books_write_count
        })
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const games_static = async (req,res) => {
    try {

        var listData4 = []
        var listData1 = []
        var sumTime = 0
        var sumPriceGames = 0
        var gamesNotPassed = 0
        var gamesPassed = 0
        var gamesCount = 0

        const games_list  = await Games.aggregate([
            { $group : { 
                _id : {compilation : "$compilation", presence: "$presence"},
                sum_price: {$sum: "$summ_game"},
                sum_time: {$sum: "$time_game"},
                count: {$sum: 1}
            }}
          ])
          games_list.map(arr => {
            listData4.push({
                key: arr._id.compilation,name: arr._id.presence, value: arr.count
          }), 
          arr._id.presence === "Не Пройдено" ? gamesNotPassed+=arr.count : gamesPassed+=arr.count
          sumPriceGames+= arr.sum_price, 
          sumTime+= arr.sum_time,
          gamesCount+=arr.count
        })

        listData4.push(
            {key: 'Общее количество',name: 'Пройдено', value: gamesPassed},
            {key: 'Общее количество',name: 'Не Пройдено', value: gamesNotPassed}
            )

        Object.entries(Object.groupBy(listData4, ({key}) => key)).map(arr => 
            listData1.push(arr[1]))
        
        
        const procentStaticGames  = Number(((gamesPassed) * 100 / (gamesCount)).toFixed(2))
    
    res.status(200).send({
        listData1,
        listData4,
        sumPriceGames,
        sumTime,
        procentStaticGames
    })
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const salary_chart = async(req,res) => {
    try{
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
            salaryYearSum.push({date: obj.date_salary.slice(6), sum: obj.summ_salary})
            salaryMonth.push({date_salary: obj.date_salary, summ_salary: obj.summ_salary, company: obj.company})
        })

        bonus.map(obj => {
            bonusYearSum.push({date: obj.date_bonus.slice(6), sum: obj.summ_bonus})
            bonusMonth.push({date: obj.date_bonus.slice(3), sum: obj.summ_bonus})
            obj.status_bonus === 'Не Выплачено' ? bonusSumm+= obj.summ_bonus : obj
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
    catch(err){
        res.status(500).json({...err})
    }
}

export const repair_static = async (req,res ) => {

    try {

        var rate = 0
        var percent = 0
        var sumCategory = 0
        var sumData = 0
        const data = await RepairModel.aggregate([{$match: { category_repair: {$not : {$regex : 'Сбережение'} }}}, 
            {$group: {_id: "$category_repair", sales: {$sum: "$sum_repair"}}}]) 

        data.map(arr => sumCategory+= arr.sales)
        
        const repair = await RepairModel.find({"category_repair" : "Сбережение"})

        rate = repair[0].sum_repair - sumCategory

        percent = 1 -((sumCategory  / repair[0].sum_repair))
        data.map(arr => sumData+=arr.sales)

        res.status(200).json({
            rate,
            percent,
            data,
            sumData
        })     
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}

export const card_static = async (req,res ) => {

    try {
        var countNotYes = 0
        var children = []
        var cardPrice = []
        var cardObYes = 0
        var cardObNot = 0
        var cardRYes = 0
        var cardRNot = 0
        var cardSRYes = 0
        var cardSRNot = 0
        var cardURYes = 0
        var cardURNot = 0
        var cardColumn = []
        var cardPie = []
        var cardList = ''
        var cardNumber = ''

        const card = await CardModel.find({collection_card: req.params.collection_card}).sort({"number_card" : 1})

        card.filter(obj => obj.status_card === 'Нет')
        .map(obj => {
            children.push({title : obj.number_card + ' ' + obj.name_card + ' ' + obj.level_card})
            countNotYes+=1
            cardList+=`${obj.number_card} ${obj.name_card} ${obj.level_card} \n`
            cardNumber+= `${obj.number_card}, `
        })

        console.log(cardNumber)
        card.filter(obj => obj.level_card === 'O').
        map(obj => {
            obj.status_card === 'Нет' ? cardObNot+=1 : cardObYes+=1 
        })

        card.filter(obj => obj.level_card === 'Р').
        map(obj => {
            obj.status_card === 'Нет' ? cardRNot+=1 : cardRYes+=1 
        })

        card.filter(obj => obj.level_card === 'СР').
        map(obj => {
            obj.status_card === 'Нет' ? cardSRNot+=1 : cardSRYes+=1 
        })

        card.filter(obj => obj.level_card === 'УР').
        map(obj => {
            obj.status_card === 'Нет' ? cardURNot+=1 : cardURYes+=1 
        })

        cardColumn.push(
            {key: 'O', name: 'Всего', value: cardObNot + cardObYes},
            {key: 'O', name: 'Есть', value: cardObYes},
            {key: 'O', name: 'Нет', value: cardObNot},
            {key: 'Р', name: 'Всего', value: cardRNot + cardRYes},
            {key: 'Р', name: 'Есть', value: cardRYes},
            {key: 'Р', name: 'Нет', value: cardRNot},
            {key: 'СР', name: 'Всего', value: cardSRNot + cardSRYes},
            {key: 'СР', name: 'Есть', value: cardSRYes},
            {key: 'СР', name: 'Нет', value: cardSRNot},
            {key: 'УР', name: 'Всего', value: cardURNot + cardURYes},
            {key: 'УР', name: 'Есть', value: cardURYes},
            {key: 'УР', name: 'Нет', value: cardURNot},
            )
        
        cardPie.push(
            [{key: 'O', name: 'Есть', value: cardObYes},
            {key: 'O', name: 'Нет', value: cardObNot}],
            [{key: 'Р', name: 'Есть', value: cardRYes},
            {key: 'Р', name: 'Нет', value: cardRNot}],
            [{key: 'СР', name: 'Есть', value: cardSRYes},
            {key: 'СР', name: 'Нет', value: cardSRNot}],
            [{key: 'УР', name: 'Есть', value: cardURYes},
            {key: 'УР', name: 'Нет', value: cardURNot}],
        )

        const procentCard = (100 - countNotYes * 100 / card.length).toFixed(2)
        const countYes = card.length - countNotYes
        const countAllCard = card.length

        cardPrice.push({title : req.params.collection_card, children: children})

        res.status(200).json({
            procentCard,
            cardPrice,
            countNotYes,
            countYes,
            countAllCard,
            cardColumn,
            cardPie,
            cardList,
            cardNumber
        })     
    }
    catch(err)
    {
        res.status(500).json({...err})
    }
}