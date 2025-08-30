import {body} from 'express-validator';

export const paymentCreateValidator = [
    body('summ_payment').isFloat(),
    body('status_payment').isLength({max:12}),
]