import { body } from 'express-validator';

export const botValidation = [
    body('ticker')
        .exists()
        .withMessage('Ticker is missing.')
        .custom((value) => {
            // TODO check for supported tickers
        }),
    body('strategy')
        .exists()
        .withMessage('Strategy name is missing.'),
    body('initBalance')
        .exists()
        .withMessage('Balance is missing')
        .isNumeric()
        .withMessage('Balance isn\'t a number'),
    body('isActive')
        .exists()
        .withMessage('The status of the bot is required')
        .isBoolean()
        .withMessage('The status of the bot is of invalid type'),
    body('userId')
        .exists()
        .withMessage('The userId of the bot is required')
        .custom((value) => {
            // TODO check if this user exists
        })
];
