const { body } = require('express-validator');

exports.createApplicationSchema = [
    body('message')
        .exists()
        .withMessage('Message is required')
        .isString()
        .withMessage('Message must be only alphabetic'),
    body('advertisement_id')
        .exists()
        .withMessage('Advertisement ID is required')
        .isNumeric()
        .withMessage('Advertisement ID must be a number'),
    body('people_id')
        .exists()
        .withMessage('People ID is required')
        .isNumeric()
        .withMessage('People ID must be a number'),
]

exports.updateApplicationSchema = [
    body('message')
        .optional()
        .isString()
        .withMessage('Message must be only alphabetic'),
    body('advertisement_id')
        .optional()
        .isNumeric()
        .withMessage('Advertisement ID must be a number'),
    body('people_id')
        .optional()
        .isNumeric()
        .withMessage('People ID must be a number'),
]