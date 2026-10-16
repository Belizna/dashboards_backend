import {body} from 'express-validator';

export const bookCreateValidator = [
    body('book_name').isString(),
    body('summ_book').isFloat(),
    body('presence').isString(),
]