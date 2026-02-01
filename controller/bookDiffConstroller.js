import BookModel from "../models/BookDiff.js"
import PulseModel from "../models/Pulse.js"
import BookFilter from "../models/BookDiffFilter.js"
import WriteBooks from "../models/WriteBooksDiff.js"
import AuthorFilter from "../models/AuthorDiffFilter.js"

export const get_books = async (req, res) => {
    try {

        const books = await BookModel.find({ compilation: req.params.book_name })

        if (!books) {
            return res.status(404).send({
                message: 'Книги не найдены'
            })
        }

        res.status(200).json({
            books
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const edit_books = async (req, res) => {
    try {

        const book = await BookModel.findById(req.params.id)

        if (req.body.presence === 'Есть' && book.presence === 'Нет') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.book_name,
                category_pulse: 'books_price',
                sum_pulse: req.body.summ_book,
                id_object: req.params.id
            })

            await pulseDoc.save()
        }
        else if (req.body.presence === 'Нет' && book.presence === 'Есть') {
            await PulseModel.deleteMany({ id_object: req.params.id })
        }
        else {
            await PulseModel.updateMany({ id_object: req.params.id },
                {
                    name_pulse: req.body.book_name,
                    sum_pulse: req.body.summ_book
                })
        }

        const book_edit = await BookModel
            .findByIdAndUpdate(req.params.id, {
                book_name: req.body.book_name,
                summ_book: req.body.summ_book,
                presence: req.body.presence,
            })
        res.status(200).json({
            book_edit
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const delete_books = async (req, res) => {
    try {

        const deleteBooks = await BookModel.
            findByIdAndDelete(req.params.id)

        await PulseModel.deleteMany({ id_object: req.params.id })

        if (!deleteBooks) {
            return res.status(404).send({
                message: "Книга не найдена"
            })
        }

        return res.status(200).json({
            deleteBooks
        })

    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const add_books = async (req, res) => {
    try {

        const bookDoc = new BookModel({
            book_name: req.body.book_name,
            summ_book: req.body.summ_book,
            presence: req.body.presence,
            compilation: req.params.book_name
        })

        const book = await bookDoc.save()

        if (req.body.presence === 'Есть') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: req.body.book_name,
                category_pulse: 'books_price',
                sum_pulse: req.body.summ_book,
                id_object: String(book._doc._id)
            })

            await pulseDoc.save()
        }

        res.status(200).json({
            ...book._doc
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const get_booksdiff_listgroup = async (req, res) => {
    try {

        const filters = await BookFilter.find()

        const author = await AuthorFilter.find()

        /** третья страница**/

        var booksAuthorWriteListGroup = []

        const groupStaticAuthorWriteBooks = await WriteBooks.aggregate([
            {
                $group: {
                    _id: { author: "$author", compilation: "$compilation", format: "$format" },
                    children: {
                        $push: {
                            title: "$book_name"
                        }
                    },
                    count: { $sum: 1 }
                }
            }, { $sort: { _id: 1 } }
        ])

        for (var i = 0; i < author.length; i++) {

            var groupAuthor = []
            var groupBooks = []
            var summRomans = 0
            var summStory = 0
            var summBigStory = 0

            groupStaticAuthorWriteBooks.map(arr => {
                if (arr._id.author === author[i].author) {

                    groupAuthor.push({ compilation: arr._id.compilation, format: arr._id.format, children: arr.children, count: arr.count })
                }
            })

            for (var j = 0; j < filters.length; j++) {
                var Romans = []
                var Story = []
                var BigStory = []
                var group = []

                groupAuthor.map(arr => {

                    if (arr.compilation === filters[j].compilation) {
                        var flagR = 0
                        var flagRom = 0
                        var flagP = 0

                        if (arr.format === 'рассказ') {
                            flagR++
                            summStory += arr.count
                            arr.children.map(ar => {
                                Story.push(` ${ar.title}`)
                            })
                        }
                        else if (arr.format === 'роман') {
                            flagRom++
                            summRomans += arr.count
                            arr.children.map(ar => {
                                Romans.push(` ${ar.title}`)
                            })
                        }
                        else {
                            flagP++
                            summBigStory += arr.count
                            arr.children.map(ar => {
                                BigStory.push(` ${ar.title}`)
                            })
                        }

                    }
                    flagP > 0 ? group.push({ staticWrite: `Повестей (${arr.count}): `, listWrite: BigStory }) :
                        flagR > 0 ? group.push({ staticWrite: `Рассказов (${arr.count}): `, listWrite: Story }) :
                            flagRom > 0 ? group.push({ staticWrite: `Романов (${arr.count}): `, listWrite: Romans }) :
                                group

                })
                if (group.length > 0) {
                    groupBooks.push({
                        nameCompilation: filters[j].compilation,
                        keyBooks: filters[j].key,
                        group: group,
                    })
                }

            }
            booksAuthorWriteListGroup.push({
                author: author[i].author,
                summCycle: groupBooks.length,
                summStory: summStory,
                summRomans: summRomans,
                summBigStory: summBigStory,
                keyImage: author[i].key,
                books: groupBooks
            })
        }

        booksAuthorWriteListGroup.sort((a, b) => b.summRomans - a.summRomans)

        /** конец третьей страницы **/

        /** вторая страница **/

        var booksWriteListGroup = []

        const groupStaticWriteBooks = await WriteBooks.aggregate([
            {
                $group: {
                    _id: { compilation: "$compilation", format: "$format" },
                    children: {
                        $push: {
                            title: "$book_name", presence: "$presence"
                        }
                    },
                    count: { $sum: 1 }
                }
            }, { $sort: { _id: 1 } }
        ])

        for (var i = 0; i < filters.length; i++) {
            var Romans = []
            var Story = []
            var BigStory = []
            var countSum = 0
            var countNotPresenceRomans = 0
            var countNotPresenceStory = 0
            var countNotPresenceBigStory = 0
            var group = []

            groupStaticWriteBooks.map(arr => {

                if (arr._id.compilation === filters[i].compilation) {
                    countSum += arr.count
                    var flagR = 0
                    var flagRom = 0
                    var flagP = 0

                    if (arr._id.format === 'рассказ') {
                        flagR++
                        arr.children.map(ar => {
                            if (ar.presence === 'Не Прочитано') {
                                Story.push(` ${ar.title}`)
                                countNotPresenceStory++
                            }
                        })
                    }
                    else if (arr._id.format === 'роман') {
                        flagRom++
                        arr.children.map(ar => {
                            if (ar.presence === 'Не Прочитано') {
                                Romans.push(` ${ar.title}`)
                                countNotPresenceRomans++
                            }
                        })
                    }
                    else {
                        flagP++
                        arr.children.map(ar => {
                            if (ar.presence === 'Не Прочитано') {
                                BigStory.push(` ${ar.title}`)
                                countNotPresenceBigStory++
                            }
                        })
                    }

                }
                flagP > 0 ? group.push({ staticWrite: `Повесть (${arr.count - countNotPresenceBigStory}/${arr.count}): `, listWrite: BigStory }) :
                    flagR > 0 ? group.push({ staticWrite: `Рассказ (${arr.count - countNotPresenceStory}/${arr.count}): `, listWrite: Story }) :
                        flagRom > 0 ? group.push({ staticWrite: `Роман (${arr.count - countNotPresenceRomans}/${arr.count}): `, listWrite: Romans }) :
                            group
            })
            booksWriteListGroup.push({
                nameCompilation: filters[i].compilation,
                keyBooks: filters[i].key,
                procent: (100 - ((countNotPresenceBigStory +
                    countNotPresenceStory + countNotPresenceRomans) * 100 / countSum)).toFixed(2),
                group: group
            })
        }

        booksWriteListGroup.sort((a, b) => b.procent - a.procent)

        /** конец второй страницы **/

        /** первая страница **/
        var booksListGroup = []

        const books_list = await BookModel.aggregate([
            {
                $group: {
                    _id: "$compilation",
                    children: { $push: { status: "$presence", title: "$book_name" } },
                    count: { $sum: 1 },
                    summ: { $sum: "$summ_book" },
                }
            }
        ])

        for (var i = 0; i < filters.length; i++) {

            var items = []
            var procent = 0
            var countNotBooks = 0
            var summBooks = 0
            var countBooks = 0 

            books_list.map(arr => {
                if (arr._id === filters[i].compilation) {
                    arr.children.map(obj => obj.status === 'Нет' ? items.push(obj.title) : obj)
                    procent = (100 - (items.length * 100 / books_list[i].count)).toFixed(2)
                    countNotBooks = items.length
                    countBooks = arr.count
                    summBooks =  arr.summ
                }
            })

            booksListGroup.push({
                nameCompilation: filters[i].compilation,
                procent: procent, 
                countNotBooks: countNotBooks, 
                items: items,
                summBooks: summBooks,
                countBooks: countBooks,
                keyBooks: filters[i].key
            })
        }

        booksListGroup.sort((a, b) => a.procent - b.procent)

        /** конец кода по первой странице **/

        res.status(200).json({
            booksAuthorWriteListGroup,
            booksWriteListGroup,
            booksListGroup,
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}