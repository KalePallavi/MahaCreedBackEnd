const { check, validationResult } = require('express-validator');

exports.stockValidation = [
    check('productId')
        .isMongoId().withMessage('Invalid product ID')
        .notEmpty().withMessage('Product ID is required'),
    
    check('companyId')
        .isMongoId().withMessage('Invalid company ID')
        .notEmpty().withMessage('Company ID is required'),
    
    check('stockType')
        .isIn(['IN', 'OUT']).withMessage('Stock type must be either "IN" or "OUT"')
        .notEmpty().withMessage('Stock type is required'),
    
    check('quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0')
        .notEmpty().withMessage('Quantity is required'),
    
    check('batchNumber')
        .notEmpty().withMessage('Batch number is required')
        .isString().withMessage('Batch number must be a string'),
    
    check('expiryDate')
        .isISO8601().withMessage('Invalid expiry date format')
        .notEmpty().withMessage('Expiry date is required'),
    
        //current date
    check('manufacturingDate')
        .optional()
        .isISO8601().withMessage('Invalid manufacturing date format'),
    
    check('price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number')
        .notEmpty().withMessage('Price is required'),
    
    check('discount')
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage('Discount must be a number between 0 and 100'),
    
    check('gstRate')
        .isIn([5, 12, 18, 28]).withMessage('GST rate must be one of 5, 12, 18, or 28')
        .notEmpty().withMessage('GST rate is required'),
    
    check('sgstAmount')
        .isFloat({ min: 0 }).withMessage('SGST amount must be a positive number')
        .notEmpty().withMessage('SGST amount is required'),
    
    check('cgstAmount')
        .isFloat({ min: 0 }).withMessage('CGST amount must be a positive number')
        .notEmpty().withMessage('CGST amount is required'),
    
    check('status')
        .optional()
        .isIn(['Available', 'Sold', 'Expired', 'Damaged']).withMessage('Status must be one of "Available", "Sold", "Expired", or "Damaged"'),
    
    check('createdBy')
        .optional()
        .isMongoId().withMessage('Invalid user ID for createdBy'),
    
    check('updatedBy')
        .optional()
        .isMongoId().withMessage('Invalid user ID for updatedBy'),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
];

