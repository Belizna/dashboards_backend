import OtherBooksModel from '../models/OtherBooks.js'


export const other_books_add = async (req, res) => {
        try {
                const otherBooksdoc = new OtherBooksModel({
                    book_name: req.body.book_name,
                    author_book: req.body.author_book,
                    cycle_book: req.body.cycle_book,
                    status_book: req.body.status_book
                })

                await otherBooksdoc.save()
            
                res.status(200).json({
                    ...otherBooksdoc
                })
        }
        catch (err){
            res.status(500).json({err})
        }
}


export const other_books_get = async (req,res) => {
    try {

        const otherBooks = await OtherBooksModel.find().sort({'_id': 1})

        res.status(200).json({
            otherBooks
        })
}
catch (err){
    res.status(500).json({err})
}
}


export const other_books_edit = async (req,res) => {
    try {

        const otherBooks = await OtherBooksModel.findByIdAndUpdate(req.params.id, {
                    book_name: req.body.book_name,
                    author_book: req.body.author_book,
                    cycle_book: req.body.cycle_book,
                    status_book: req.body.status_book
        })

        res.status(200).json({
            otherBooks
        })
}
catch (err){
    res.status(500).json({err})
}
}

export const other_books_delete = async (req,res) => {
    try {

        const otherBooks = await OtherBooksModel.findByIdAndDelete(req.params.id)

        res.status(200).json({
            otherBooks
        })
}
catch (err){
    res.status(500).json({err})
}
}