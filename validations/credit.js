import {body} from 'express-validator';

export const creditCreateValidator = [
    body('credit_name').isLength({min:5}),
    body('summ_credit').isFloat(),
    body('date_credit').isLength(10),
    body('percent').isFloat(),
    body('term').isInt(),
    body('duty').isFloat()
]