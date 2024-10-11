const { body } = require('express-validator');

exports.createApplicationSchema = [
    body('isRead')
        .exists()
        .withMessage('isRead is required')
        .isBoolean()
        .withMessage('isRead must be a boolean'),
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
    body('isRead')
        .optional()
        .isBoolean()
        .withMessage('isRead must be a boolean'),
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