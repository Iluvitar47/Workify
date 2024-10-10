const { body } = require('express-validator');

exports.createCompanySchema = [
    body('name')
        .exists()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be only alphabetic'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is invalid')
        .normalizeEmail(),
    body('phone')
        .exists()
        .withMessage('Phone number is required')
        .isMobilePhone()
        .withMessage('Invalid phone number'),
    body('business_sector')
        .exists()
        .withMessage('Business sector is required')
        .isString()
        .withMessage('Business sector must be only alphabetic'),
    body('location')
        .exists()
        .withMessage('Location is required')
        .isString()
        .withMessage('Location must be only alphabetic'),
    body('employees')
        .exists()
        .withMessage('Employees is required')
        .isNumeric()
        .withMessage('Employees must be a number'),
    body('description')
        .exists()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be only alphabetic'),
]

exports.updateCompanySchema = [
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be only alphabetic'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email is invalid')
        .normalizeEmail(),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Invalid phone number'),
    body('business_sector')
        .optional()
        .isString()
        .withMessage('Business sector must be only alphabetic'),
    body('location')
        .optional()
        .isString()
        .withMessage('Location must be only alphabetic'),
    body('employees')
        .optional()
        .isNumeric()
        .withMessage('Employees must be a number'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be only alphabetic'),
]