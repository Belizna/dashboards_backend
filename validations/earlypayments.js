import {body} from 'express-validator';

export const earlyPaymentsEditValidator = [
    body('summ_earlyPayment').isFloat()
]