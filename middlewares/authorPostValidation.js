const {body, validationResult} = require('express-validator');

const authorsBodyParams = [
    body('name')
        .notEmpty()
        .isString()
        .isLength({min: 3})
        .withMessage('Nome is required, must be a string and greater than 8 characters'),
    
    body('surname')
        .notEmpty()
        .isString()
        .isLength({min: 3})
        .withMessage('Cognome is required, must be a string and greater than 3 characters'),
    
    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Email must be a valid email address'),

    body('dateOfBirth')
        .notEmpty()
        .isDate()
        .withMessage('Data di nascita is required and must be written DD/MM/YYYY'),

    body('avatar')
        .notEmpty()
        .isString()
        .isURL()
        .withMessage('Avatar is required and must be and URL')
];

const validatePostAuthor = (req, res, next) => {
    console.log('Request body:', req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    next()
}

module.exports = {authorsBodyParams, validatePostAuthor};