const { body } = require('express-validator');
const Role = require('../../utils/userRoles.utils');

exports.createUserSchema = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Your email is invalid')
        .normalizeEmail(),
    body('permission')
        .custom((value) => {
            if (value === Role.Admin) {
                throw new Error('Not allowed!');
            }
            return true;
        }),
    body('password')
        .optional()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters'),
    body('people_id')
        .optional()
        .isNumeric()
        .withMessage('People id must be a number'),
]

exports.updateUserSchema = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Your email is invalid')
        .normalizeEmail(),
    body('permission')
        .optional()
        .isIn([Role.Admin, Role.Applicants])
        .withMessage('Invalid permission'),
    body('password')
        .optional()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters'),
    body('people_id')
        .optional()
        .isNumeric()
        .withMessage('People id must be a number'),
    body()
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['email', 'permission', 'people_id'];
            return updates.every(update => allowUpdates.includes(update));
        })  
        .withMessage('Invalid updates!')
]

exports.validateLogin = [
    body('email')
        .exists()
        .withMessage('Your email is required')
        .isEmail()
        .withMessage('Your email is invalid')
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
]