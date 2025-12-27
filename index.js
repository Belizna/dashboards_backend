import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cron from 'node-cron';

import { registerValidator } from './validations/auth.js'
import { paymentCreateValidator } from './validations/payments.js'
import { earlyPaymentsEditValidator } from './validations/earlypayments.js'
import { bookCreateValidator } from './validations/book.js'

import { register, login, me } from './controller/authController.js'
import { delete_payment, get_payments, update_payment } from './controller/paymentsController.js'
import { get_early_payment, add_early_payment, edit_early_payment, delete_early_payment } from './controller/earlyPaymentsController.js'
import { other_books_add, other_books_get, other_books_edit, other_books_delete } from './controller/OrherBooksController.js'
import { get_heresy_books, edit_heresy_books, delete_heresy_books, add_heresy_books, get_books_listgroup } from './controller/heresy_horusConstroller.js'
import { delete_games, edit_games, add_games, get_games } from './controller/gamesController.js'
import { book_static, repair_static, credit_static, games_static, salary_chart, hobby_static, main_static, card_static, beyblade_static, compare_statistic, compare_statistic_column } from './controller/chartsController.js'
import { get_write_books, edit_write_books, add_write_books, delete_write_books } from './controller/writeBooksController.js'
import { bonus_get, bonus_add, bonus_delete, bonus_edit, bonus_days_get, bonus_days_add, bonus_days_delete, bonus_days_edit } from './controller/weekendController.js'
import { salary_add, salary_delete, salary_edit, salary_get } from './controller/SalaryController.js'
import { miniatures_get, miniatures_add, miniatures_edit, miniatures_delete } from './controller/miniaturesController.js'
import { colors_add, colors_get, colors_edit, colors_delete } from './controller/colorController.js'
import { get_card, add_card, edit_card, delete_card, get_card_listgroup } from './controller/cardController.js'
import { repair_add, repair_get, repair_edit, repair_delete, repair_sum } from './controller/repaircontroller.js'
import { comics_add, comics_delete, comics_get, comics_edit } from './controller/comicsController.js'
import { loan_get, loan_add, loan_edit, loan_delete } from './controller/LoanController.js'
import { add_computer, delete_computer, get_computer, edit_computer } from './controller/computerConstroller.js'
import { menu_get } from './controller/menuController.js'
import { get_beyblade, edit_beyblade, delete_beyblade, add_beyblade } from './controller/beybladeController.js'
import { person_get, person_add_class, person_add_person, person_add_books } from './controller/personController.js'
import { add_maps, get_maps } from './controller/mapsController.js'
import { jobsMonthUpdate } from './controller/jobsController.js';
import { edit_books, delete_books, add_books, get_booksdiff_listgroup, get_books } from './controller/bookDiffConstroller.js';
import { get_write_diff_books, delete_write_diff_books, add_write_diff_books, edit_write_diff_books } from './controller/writeBooksDiffController.js';
import { credit_add_history, credit_get_history } from './controller/creditStaticHistoryController.js'
import { job } from './cronJob/MonthJob.js'

import CheckAuth from './utils/CheckAuth.js'

dotenv.config()

mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, minPoolSize: 10 })
    .then(() => console.log('db connection'))
    .catch((err) => console.log('error db connection', err))

const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json(
        'server run'
    )
});

cron.schedule(process.env.CRON_JOB, () => {
    job();
});

app.get('/menu', menu_get)

app.get('/person', person_get)
app.post('/person/add/class', person_add_class)
app.post('/person/add/person', person_add_person)
app.post('/person/add/books', person_add_books)

app.get('/maps', get_maps)
app.post('/maps/add/placemark', add_maps)

app.get('/comics/:collection_comics', comics_get)
app.post('/comics/add', comics_add)
app.patch('/comics/edit/:id', comics_edit)
app.delete('/comics/delete/:id', comics_delete)

app.get('/hobby/miniatures/', miniatures_get)
app.post('/hobby/miniatures/add', miniatures_add)
app.patch('/hobby/miniatures/edit/:id', miniatures_edit)
app.delete('/hobby/miniatures/delete/:id', miniatures_delete)

app.get('/hobby/colors/', colors_get)
app.post('/hobby/colors/add', colors_add)
app.patch('/hobby/colors/edit/:id', colors_edit)
app.delete('/hobby/colors/delete/:id', colors_delete)

app.get('/repair/outlay/', repair_get)
app.post('/repair/outlay/add', repair_add)
app.patch('/repair/outlay/edit/:id', repair_edit)
app.delete('/repair/outlay/delete/:id', repair_delete)
app.post('/repair/outlay/edit_sum', repair_sum)

app.get('/weekend/bonus/', bonus_get)
app.post('/weekend/bonus/add', bonus_add)
app.patch('/weekend/bonus/edit/:id', bonus_edit)
app.delete('/weekend/bonus/delete/:id', bonus_delete)

app.get('/weekend/bonus_days/', bonus_days_get)
app.post('/weekend/bonus_days/add', bonus_days_add)
app.patch('/weekend/bonus_days/edit/:id', bonus_days_edit)
app.delete('/weekend/bonus_days/delete/:id', bonus_days_delete)

app.get('/weekend/salary', salary_get)
app.post('/weekend/salary/add', salary_add)
app.patch('/weekend/salary/edit/:id', salary_edit)
app.delete('/weekend/salary/delete/:id', salary_delete)

app.get('/credit/loan', loan_get)
app.post('/credit/loan/add', loan_add)
app.patch('/credit/loan/edit/:id', loan_edit)
app.delete('/credit/loan/delete/:id', loan_delete)

app.post('/credit/history/add', credit_add_history)
app.get('/credit/history/', credit_get_history)

app.get('/credit/early_payment/', get_early_payment)
app.post('/credit/early_payment/', earlyPaymentsEditValidator, add_early_payment)
app.patch('/credit/early_payment/:id', earlyPaymentsEditValidator, edit_early_payment)
app.delete('/credit/early_payment/:id', delete_early_payment)

app.get('/books/static/:book_name', book_static)
app.get('/jobs/month/:id', jobsMonthUpdate)
app.get('/carts/static', credit_static)
app.get('/games/static', games_static)
app.get('/weekend/work/charts', salary_chart)
app.get('/hobby/static/', hobby_static)
app.get('/main/static/:year', main_static)
app.get("/repair/static", repair_static)
app.get("/cards/static/:collection_card", card_static)
app.get("/beyblades/static/", beyblade_static)
app.post("/main/compare", compare_statistic)
app.post("/main/compare/column/:statistic_collection", compare_statistic_column)

app.get('/books/heresy_horus/:book_name', get_heresy_books)
app.post('/books/heresy_horus/add/:book_name', bookCreateValidator, add_heresy_books)
app.patch('/books/heresy_horus/edit/:id', bookCreateValidator, edit_heresy_books)
app.delete('/books/heresy_horus/delete/:id', delete_heresy_books)
app.get('/books/charts_group_list/', get_books_listgroup)

app.get('/books/:book_name', get_books)
app.post('/books/add/:book_name', bookCreateValidator, add_books)
app.patch('/books/edit/:id', bookCreateValidator, edit_books)
app.delete('/books/delete/:id', delete_books)
app.get('/booksdiff/charts_groupdiff_list/', get_booksdiff_listgroup)

app.get('/collection/card/:collection_card', get_card)
app.get('/collection/cards/', get_card_listgroup)
app.post('/collection/card/add/:collection_card', add_card)
app.patch('/collection/card/edit/:id', edit_card)
app.delete('/collection/card/delete/:id', delete_card)

app.get('/collection/beyblade/:beyblade_series', get_beyblade)
app.post('/collection/beyblade/add/', add_beyblade)
app.patch('/collection/beyblade/edit/:id', edit_beyblade)
app.delete('/collection/beyblade/delete/:id', delete_beyblade)

app.get('/books/other_books', other_books_get)
app.post('/books/other_books/add', other_books_add)
app.patch('/books/other_book/edit/:id', other_books_edit)
app.delete('/books/other_book/delete/:id', other_books_delete)

app.get('/credit/payments', get_payments)
app.patch('/credit/payments/:id', paymentCreateValidator, update_payment)
app.delete('/credit/payments/:id', delete_payment)

app.get('/books/write_books/:book_name', get_write_books)
app.post('/books/write_books/add/:book_name', add_write_books)
app.patch('/books/write_books/edit/:id', edit_write_books)
app.delete('/books/write_books/delete/:id', delete_write_books)

app.get('/books/write_diff_books/:book_name', get_write_diff_books)
app.post('/books/write_diff_books/add/:book_name', add_write_diff_books)
app.patch('/books/write_diff_books/edit/:id', edit_write_diff_books)
app.delete('/books/write_diff_books/delete/:id', delete_write_diff_books)


app.get('/games/library/:library_name', get_games)
app.post('/games/library/add', add_games)
app.patch('/games/library/edit/:id', edit_games)
app.delete('/games/library/delete/:id', delete_games)

app.get('/computer', get_computer)
app.post('/computer/add', add_computer)
app.patch('/computer/edit/:id', edit_computer)
app.delete('/computer/delete/:id', delete_computer)

app.post('/auth/register/', registerValidator, register);
app.post('/auth/login/', registerValidator, login)
app.get('/auth/me/', CheckAuth, me)

app.listen(process.env.PORT || 8080, (err) => {
    if (err) {
        return console.log(err)
    }
    else {
        console.log('Server run')
    }
})

