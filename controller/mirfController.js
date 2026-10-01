import BookmarksModel from "../models/Bookmarks.js";
import BookFilter from "../models/BookDiffFilter.js"
import BookModel from "../models/BookDiff.js"
import WriteBooksModel from "../models/WriteBooksDiff.js";
import AuthorFilter from "../models/AuthorDiffFilter.js"
import MirfModel from "../models/Mirf.js";

export const mirf_add = async (req, res) => {

    try {

        const mirfDoc = new MirfModel({
            book_name: req.body.book_name,
            compilation: req.body.compilation,
            author: req.body.author,
            is_presence: req.body.is_presence,
            is_read: req.body.is_read,
            image: req.body.image,
            category: req.body.category
        })

        const mirf = await mirfDoc.save()

        res.status(200).json({ mirf })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const mirf_get = async (req, res) => {

    try {

        var statisticMirf = []

        const author = await AuthorFilter.find()

        const groupMirf = await MirfModel.aggregate([
            {
                $group: {
                    _id: {
                        compilation: "$compilation",
                        category: "$category"
                    },

                    books: {
                        $push: {
                            book_name: "$book_name",
                            author: "$author",
                            is_presence: "$is_presence",
                            is_read: "$is_read",
                            image: "$image",
                            _id: "$_id"
                        }
                    },

                    count: {
                        $sum: 1
                    }
                }
            },

            {
                $group: {
                    _id: "$_id.compilation",

                    categories: {
                        $push: {
                            category: "$_id.category",
                            books: "$books",
                            count: "$count"
                        }
                    },

                    count: {
                        $sum: "$count"
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const mirfMap = groupMirf.map((compilation, index) => {

            const purchase = [];
            const reading = [];

            compilation.categories.forEach(category => {

                const cardPresence = category.books.map(book => {

                    return book.is_presence === 'Куплено'
                        ? {
                            name: book.book_name,
                            author: book.author,
                            image: book.image,
                            _id: book._id,
                            history: {
                                image: book.image,
                                is_presence: book.is_presence,
                                is_read: book.is_read
                            }
                        }
                        : {
                            name: book.book_name,
                            author: book.author,
                            image: 'https://i.postimg.cc/5YXX8NKY/seryj-fon.png',
                            _id: book._id,
                            history: {
                                image: book.image,
                                is_presence: book.is_presence,
                                is_read: book.is_read
                            }
                        };
                });

                const cardRead = category.books.map(book => {

                    return book.is_read === 'Прочитано'
                        ? {
                            name: book.book_name,
                            author: book.author,
                            image: book.image,
                            _id: book._id,
                            history: {
                                image: book.image,
                                is_presence: book.is_presence,
                                is_read: book.is_read
                            }
                        }
                        : {
                            name: book.book_name,
                            author: book.author,
                            image: 'https://i.postimg.cc/5YXX8NKY/seryj-fon.png',
                            _id: book._id,
                            history: {
                                image: book.image,
                                is_presence: book.is_presence,
                                is_read: book.is_read
                            }
                        };
                });

                purchase.push({
                    category: category.category,
                    count: category.count,
                    cards: cardPresence
                });

                reading.push({
                    category: category.category,
                    count: category.count,
                    cards: cardRead
                });
            });

            return {
                key: index + 1,
                compilation: compilation._id,

                tabs: {
                    purchase,
                    reading
                }
            };
        });


        for (var i = 0; i < mirfMap.length; i++) {

            var countBooksCompilation = 0
            var countBooksPurchase = 0
            var countBooksReading = 0

            mirfMap[i].tabs.purchase.map(arr => {
                countBooksCompilation += arr.count
                arr.cards.map(arr1 => {
                    if (arr1.history.is_presence === 'Куплено') {
                        countBooksPurchase++
                    }

                    if (arr1.history.is_read === 'Прочитано') {
                        countBooksReading++
                    }
                })
            })


            statisticMirf.push({
                key: mirfMap[i].key,
                compilation: mirfMap[i].compilation,
                countBooksCompilation: countBooksCompilation,
                countBooksPurchase: countBooksPurchase,
                percentPurchase: Number((countBooksPurchase * 100 / countBooksCompilation).toFixed(2)),
                countBooksReading: countBooksReading,
                percentReading: Number((countBooksReading * 100 / countBooksCompilation).toFixed(2))
            })
        }

        res.status(200).json({
            mirfMap,
            author,
            statisticMirf
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const mirf_edit = async (req, res) => {
    try {
        const mirf_edit = await MirfModel.findByIdAndUpdate(req.params.id, {
            book_name: req.body.book_name,
            compilation: req.body.compilation,
            author: req.body.author,
            is_presence: req.body.is_presence,
            is_read: req.body.is_read,
            image: req.body.image,
            category: req.body.category
        })

        res.status(200).json({
            mirf_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const mirf_delete = async (req, res) => {
    try {
        const deleteMirfs = await MirfModel.findByIdAndDelete(req.params.id)

        if (!deleteMirfs) {
            return res.status(404).send({
                message: 'Такой закладки нет'
            })
        }

        res.status(200).json({ deleteMirfs })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}