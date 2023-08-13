const {body, validationResult} = require('express-validator');

const validatePatchBodyAuthors = [
    body('name')
        .optional()
        .notEmpty()
        .isString()
        .isLength({min: 3})
        .withMessage('Nome is required, must be a string and greater than 8 characters'),
    
    body('surname')
        .optional()
        .notEmpty()
        .isString()
        .isLength({min: 3})
        .withMessage('Cognome is required, must be a string and greater than 3 characters'),
    
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .withMessage('Email must be a valid email address'),

    body('dateOfBirth')
        .optional()
        .notEmpty()
        .isDate()
        .withMessage('Data di nascita is required and must be written DD/MM/YYYY'),

    body('avatar')
        .optional()
        .notEmpty()
        .isString()
        .isURL()
        .withMessage('Avatar is required and must be and URL')
];

const validatePatchBodyAuthorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    next();
};

module.exports = {validatePatchBodyAuthors, validatePatchBodyAuthorMiddleware}