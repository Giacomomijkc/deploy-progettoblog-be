const { body, validationResult } = require('express-validator');

const validatePatchBody = [
    body('title')
        .optional()
        .notEmpty()
        .isString()
        .isLength({ min: 8 })
        .withMessage('Title is required and must be a string of at least 8 characters'),

    body('content')
        .optional()
        .notEmpty()
        .isString()
        .isLength({ min: 200 })
        .withMessage('Content is required and must be a string of at least 200 characters'),

    body('cover')
        .optional()
        .notEmpty()
        .isString()
        .isURL()
        .withMessage('Img is required and must be a URL string'),

    body('category')
        .optional()
        .notEmpty()
        .isString()
        .isLength({min: 8})
        .withMessage('Category is required and must be a string and greater than 8 characters'),

    body('author.name')
        .optional()
        .notEmpty()
        .isString()
        .isLength({min: 3})
        .withMessage('Author is required and must be a string'),

    body('author.avatar')
        .optional()
        .notEmpty()
        .isString()
        .isURL()
        .withMessage('Img is required and must be a URL string'),

    body('readTime.value')
        .optional()
        .notEmpty()
        .isInt()
        .withMessage('ReadTime value must be an integer'),

    body('readTime.unit')
        .optional()
        .notEmpty()
        .isString()
        .withMessage('ReadTime unit must be a string')
];

const validatePatchBodyMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = { validatePatchBody, validatePatchBodyMiddleware };
