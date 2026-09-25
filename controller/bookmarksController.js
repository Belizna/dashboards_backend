import BookmarksModel from "../models/Bookmarks.js";
import BookFilter from "../models/BookDiffFilter.js"
import BookModel from "../models/BookDiff.js"
import WriteBooksModel from "../models/WriteBooksDiff.js";
import AuthorFilter from "../models/AuthorDiffFilter.js"
import ScratchModel from "../models/TopsScratch.js"

export const bookmarks_add = async (req, res) => {

    try {

        const bookmarksDoc = new BookmarksModel({
            author: req.body.author,
            cycle: req.body.cycle,
            rating: req.body.rating,
            image: req.body.image,
        })

        const bookmarks = await bookmarksDoc.save()

        res.status(200).json({ bookmarks })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bookmarks_add_bookRomans = async (req, res) => {

    try {

        const bookDoc = new BookModel({
            book_name: req.body.cycle,
            summ_book: 0,
            presence: 'Нет',
            compilation: 'Романы'
        })
        const book = await bookDoc.save()


        const write_books_doc = new WriteBooksModel({
            book_name: req.body.cycle,
            format: 'роман',
            collection_book: '',
            presence: 'Не Прочитано',
            compilation: 'Романы',
            author: req.body.author
        })
        const writeBook = await write_books_doc.save()

        if (book && writeBook) {
            await BookmarksModel.findByIdAndDelete(req.body._id)
        }

        const scratchDoc = new ScratchModel({
            name: req.body.cycle,
            status: 'Не выполнено',
            category: 'Книги',
            image_key: req.body.image,
        })
        await scratchDoc.save()

        const authorDoc = new AuthorFilter({
            author: req.body.author,
            key: 'https://i.postimg.cc/5YXX8NKY/seryj-fon.png',
        })
        await authorDoc.save()

        res.status(200).json({ book })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bookmarks_add_bookfilter = async (req, res) => {

    try {

        const booksFilterrDoc = new BookFilter({
            compilation: req.body.cycle,
            key: req.body.image,
        })

        const filter = await booksFilterrDoc.save()

        if (filter) {
            await BookmarksModel.findByIdAndDelete(req.body._id)
        }
        
        const scratchDoc = new ScratchModel({
            name: req.body.cycle,
            status: 'Не выполнено',
            category: 'Книги',
            image_key: req.body.image,
        })
        await scratchDoc.save()

        const authorDoc = new AuthorFilter({
            author: req.body.author,
            key: 'https://i.postimg.cc/5YXX8NKY/seryj-fon.png',
        })
        await authorDoc.save()

        res.status(200).json({ filter })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bookmarks_get = async (req, res) => {

    try {

        const bookmarks = await BookmarksModel.find().sort({ 'rating': -1 })

        res.status(200).json({ bookmarks })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bookmarks_edit = async (req, res) => {
    try {
        const bookmarks_edit = await BookmarksModel.findByIdAndUpdate(req.params.id, {
            author: req.body.author,
            cycle: req.body.cycle,
            rating: req.body.rating,
            image: req.body.image,
        })

        res.status(200).json({
            bookmarks_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const bookmarks_delete = async (req, res) => {
    try {
        const deleteBookmarks = await BookmarksModel.findByIdAndDelete(req.params.id)
        if (!deleteBookmarks) {
            return res.status(404).send({
                message: 'Такой закладки нет'
            })
        }

        res.status(200).json({ deleteBookmarks })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}