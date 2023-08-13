const {body, validationResult} = require('express-validator');

const postsBodyParams = [
    body('title')
        .notEmpty()
        .isString()
        .isLength({min: 3})
        .withMessage('Title is required and must be a string and greater than 8 characters'),

    body('content')
        .notEmpty()
        .isString()
        .isLength({min: 200})
        .withMessage('Content is required and must be a string and greater than 200 characters'),

    body('cover')
        .notEmpty()
        .isString()
        .isURL()
        .withMessage('Img is required and must be a URL string'),

    body('category')
        .notEmpty()
        .isString()
        .isLength({min: 8})
        .withMessage('Category is required and must be a string and greater than 8 characters'),
    
    body('author')
        .notEmpty()
        .isString()
        .withMessage('Author is required and must be your ID'),

    body('readTime.value')
        .notEmpty()
        .isInt()
        .withMessage('ReadTime value must be an integer'),

    body('readTime.unit')
        .notEmpty()
        .isString()
        .withMessage('ReadTime unit must be a string')
];

const validatePostBody = (req, res, next) => {
    console.log('Request body:', req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    next()
}

module.exports = {postsBodyParams, validatePostBody};