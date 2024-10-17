const { body } = require('express-validator');

exports.createPeopleSchema = [
    body('firstname')
        .exists()
        .withMessage('Your firstname is required')
        .isString()
        .withMessage('Your firstname must be only alphabetic'),
    body('lastname')
        .exists()
        .withMessage('Your lastname is required')
        .isString()
        .withMessage('Your lastname must be only alphabetic'),
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

exports.updatePeopleSchema = [
    body('firstname')
        .optional()
        .isString()
        .withMessage('Your firstname must be only alphabetic'),
    body('lastname')
        .optional()
        .isString()
        .withMessage('Your lastname must be only alphabetic'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Your email is invalid')
        .normalizeEmail(),
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
            const allowUpdates = ['firstname', 'lastname', 'email', 'phone', 'experiences', 'studies', 'skills', 'business_sector', 'target_job', 'location'];
            return updates.every(update => allowUpdates.includes(update));
        })  
        .withMessage('Invalid updates!')
]