const { body } = require('express-validator');
const Role = require('../../utils/userRoles.utils');

exports.createUserSchema = [
    body('firstname')
        .exists()
        .withMessage('Your firstname is required')
        .isAlpha()
        .withMessage('Your firstname must be only alphabetic'),
    body('lastname')
        .exists()
        .withMessage('Your lastname is required')
        .isAlpha()
        .withMessage('Your lastname must be only alphabetic'),
    body('email')
        .exists()
        .withMessage('Your email is required')
        .isEmail()
        .withMessage('Your email is invalid')
        .normalizeEmail(),
    body('permission')
        .isIn([Role.Admin, Role.Applicants])
]