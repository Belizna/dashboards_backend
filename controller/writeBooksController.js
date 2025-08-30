import WriteBooksModel from "../models/WriteBooks.js";
import PulseModel from "../models/Pulse.js"
import AuthorFilter from "../models/AuthorFilter.js";

export const get_write_books = async (req, res) => {
    try {

        var filteredAuthorList = []
        var filteredAddAuthorList = []
        const author = await AuthorFilter.find().sort({ 'author': 1 })

        var filteredList = []
        const write_books = await WriteBooksModel.find({
            compilation: req.params.book_name
        })

        if (!write_books) {
            return res.status(404).send({
                message: 'Книги не найдены'
            })
        }

        write_books.map(arr =>
            arr.collection_book != "" && arr.collection_book != null ?
                filteredList.push({ text: arr.collection_book, value: arr.collection_book }) : arr)

        let filter = [...new Set(filteredList.map(JSON.stringify))].map(JSON.parse);

        author.map(arr => {
            filteredAuthorList.push({ text: arr.author, value: arr.author })
            filteredAddAuthorList.push({ value: arr.author, label: arr.author })
        })

        res.status(200).json({
            write_books, filter, filteredAuthorList, filteredAddAuthorList
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const edit_write_books = async (req, res) => {
    try {

        const book = await WriteBooksModel.findById(req.params.id)

        if (book.presence === 'Не Прочитано' && req.body.presence === 'Прочитано') {
            const pulseDoc = new PulseModel({
                date_pulse: Date.now(),
                name_pulse: `${req.body.book_name} (${req.body.format})`,
                category_pulse: 'books',
                id_object: req.params.id
            })

            await pulseDoc.save()
        }
        else if (book.presence === 'Прочитано' && req.body.presence === 'Не Прочитано') {
            await PulseModel.deleteMany({ id_object: req.params.id })
        }

        const write_books_edit = await WriteBooksModel.
            findByIdAndUpdate(req.params.id, {
                book_name: req.body.book_name,
                format: req.body.format,
                collection_book: req.body.collection_book,
                presence: req.body.presence,
                author: req.body.author
            })

        res.status(200).json({
            write_books_edit
        })

    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const add_write_books = async (req, res) => {
    try {
        const write_books_doc = new WriteBooksModel({

            book_name: req.body.book_name,
            format: req.body.format,
            collection_book: req.body.collection_book,
            presence: req.body.presence,
            compilation: req.params.book_name,
            author: req.body.author
        })

        const writeBooks = await write_books_doc.save()

        res.status(200).json({
            writeBooks
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const delete_write_books = async (req, res) => {
    try {
        const deleteWriteBooks = await WriteBooksModel.
            findByIdAndDelete(req.params.id)

        await PulseModel.deleteMany({ id_object: req.params.id })

        res.status(200).json({
            deleteWriteBooks
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}