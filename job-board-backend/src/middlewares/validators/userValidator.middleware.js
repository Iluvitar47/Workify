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
        .withMessage('Invalid role type'),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters'),
    body('phone')
        .exists()
        .withMessage('Phone number is required')
        .isMobilePhone()
        .withMessage('Invalid phone number'),
    body('experiences')
        .exists()
        .withMessage('Experiences is required')
        .isString()
        .withMessage('Experiences must be only alphabetic'),
    body('studies')
        .exists()
        .withMessage('Studies is required')
        .isString()
        .withMessage('Studies must be only alphabetic'),
    body('skills')
        .exists()
        .withMessage('Skills is required')
        .isString()
        .withMessage('Skills must be only alphabetic'),
    body('business_sector')
        .exists()
        .withMessage('Business sector is required')
        .isString()
        .withMessage('Business sector must be only alphabetic'),
    body('target_job')
        .exists()
        .withMessage('Target job is required')
        .isString()
        .withMessage('Target job must be only alphabetic'),
    body('location')
        .exists()
        .withMessage('Location is required')
        .isString()
        .withMessage('Location must be only alphabetic'),    
]

exports.updateUserSchema = [
    body('firstname')
        .optional()
        .isAlpha()
        .withMessage('Your firstname must be only alphabetic'),
    body('lastname')
        .optional()
        .isAlpha()
        .withMessage('Your lastname must be only alphabetic'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Your email is invalid')
        .normalizeEmail(),
    body('permission')
        .optional()
        .isIn([Role.Admin, Role.Applicants])
        .withMessage('Invalid role type'),
    body('password')
        .optional()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Invalid phone number'),
    body('experiences')
        .optional()
        .isString()
        .withMessage('Experiences must be only alphabetic'),
    body('studies')
        .optional()
        .isString()
        .withMessage('Studies must be only alphabetic'),
    body('skills')
        .optional()
        .isString()
        .withMessage('Skills must be only alphabetic'),
    body('business_sector')
        .optional()
        .isString()
        .withMessage('Business sector must be only alphabetic'),
    body('target_job')
        .optional()
        .isString()
        .withMessage('Target job must be only alphabetic'),
    body('location')
        .optional()
        .isString()
        .withMessage('Location must be only alphabetic'),
    body()
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['firstname', 'lastname', 'email', 'password', 'phone', 'experiences', 'studies', 'skills', 'business_sector', 'target_job', 'location'];
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