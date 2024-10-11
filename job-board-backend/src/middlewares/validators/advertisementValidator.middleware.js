const { body } = require('express-validator');

exports.createAdvertisementSchema = [
    body('title')
        .exists()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be only alphabetic'),
    body('description')
        .exists()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be only alphabetic'),
    body('wages')
        .exists()
        .withMessage('Wages is required')
        .isNumeric()
        .withMessage('Wages must be a number'),
    body('location')
        .exists()
        .withMessage('Location is required')
        .isString()
        .withMessage('Location must be only alphabetic'),
    body('working_times')
        .exists()
        .withMessage('Working time is required')
        .isString()
        .withMessage('Working time must be only alphabetic'),
]

exports.updateAdvertisementSchema = [
    body('title')
        .optional()
        .isString()
        .withMessage('Title must be only alphabetic'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be only alphabetic'),
    body('wages')
        .optional()
        .isNumeric()
        .withMessage('Wages must be a number'),
    body('location')
        .optional()
        .isString()
        .withMessage('Location must be only alphabetic'),
    body('working_times')
        .optional()
        .isString()
        .withMessage('Working time must be only alphabetic'),
]