const { check, validationResult } = require('express-validator');

exports.validateDemand = [
    check('companyId').isMongoId().withMessage('Invalid company ID'),
   // check('dealerOrRetailerId').isMongoId().withMessage('Invalid dealer or retailer ID'),
    check('productId').isMongoId().withMessage('Invalid product ID'),
    check('packingSize').isIn(['Small', 'Medium', 'Large']).withMessage('Invalid packing size'),
    check('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    check('deliveryTimeInDays').isInt({ min: 1 }).withMessage('Delivery time must be at least 1 day'),
    check('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
    check('gstRate').isIn([5, 12, 18, 28]).withMessage('Invalid GST rate'),
    check('netAmount').isFloat({ min: 0 }).withMessage('Net amount must be a positive number'),
    check('sgstAmount').isFloat({ min: 0 }).withMessage('SGST amount must be a positive number'),
    check('cgstAmount').isFloat({ min: 0 }).withMessage('CGST amount must be a positive number'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
    
];
