const {check,validationResult} = require('express-validator');

exports.validateCompanyData  =[
    check('companyName').not().isEmpty().withMessage('Company Name is required'),
    check('gstin').isLength({ min: 15, max: 15 }).withMessage('GSTIN must be 15 characters long'),
    check('licenseNumber').not().isEmpty().withMessage('License Number is required'),
    check('cinNumber').not().isEmpty().withMessage('CIN Number is required'),
    check('panCardNumber').isLength({ min: 10, max: 10 }).withMessage('PAN Card Number must be 10 characters long'),
    check('aadharCardNumber').isLength({ min: 12, max: 12 }).withMessage('Aadhar Card Number must be 12 characters long'),
    check('contactPersonName').not().isEmpty().withMessage('Contact Person Name is required'),
    check('contactPersonMobileNumber').isMobilePhone().withMessage('Valid Mobile Number is required'),
    check('contactPersonEmail').isEmail().withMessage('Valid Email is required'),
    check('state').not().isEmpty().withMessage('State is required'),
    check('district').not().isEmpty().withMessage('District is required'),
    check('taluka').not().isEmpty().withMessage('Taluka is required'),
    check('village').not().isEmpty().withMessage('Village is required'),
    check('companyAddress').not().isEmpty().withMessage('Company Address is required'),
    check('pinCode').isLength({ min: 6, max: 6 }).withMessage('PIN Code must be 6 digits long'),
    check('invAlphabetSeries').not().isEmpty().withMessage('Invoice Alphabet Series is required'),
    check('openingBalance').isNumeric().withMessage('Opening Balance must be a number'),

    // Middleware to check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateProduct = [
    check('productCategory').isIn(['Seed', 'Fertilizer', 'Pestiside', 'Herbiside', 'Water Soluble Fertilizer', 'PVC and Fitting', 'Repairing AC And Accessories', 'Animal and Feed', 'Grossary', 'Electronics', 'Pharmacy', 'Hardware and Machnary', 'Agriculture Tools', 'Others']).withMessage('Invalid product category'),
    check('productName').notEmpty().withMessage('Product name is required'),
    check('packingSize').isIn(['S', 'L', 'M', 'KG', 'ML']).withMessage('Invalid packing size'),
    check('openingStock').isNumeric().withMessage('Opening stock must be a number'),
    check('storage').isIn(['Shop', 'Godown']).withMessage('Invalid storage location'),
    check('batchNumber').notEmpty().withMessage('Batch number is required'),
    check('expiryDate').isISO8601().toDate().withMessage('Invalid expiry date'),
    check('purchasePriceWithoutGST').isNumeric().withMessage('Purchase price without GST must be a number'),
    check('gstRate').isIn([5, 12, 18, 28]).withMessage('Invalid GST rate'),
    check('purchasePriceWithGST').isNumeric().withMessage('Purchase price with GST must be a number'),
    check('cashSalePrice').isNumeric().withMessage('Cash sale price must be a number'),
    check('creditSalePrice').isNumeric().withMessage('Credit sale price must be a number'),
    check('cashWholesalePrice').isNumeric().withMessage('Cash wholesale price must be a number'),
    check('creditWholesalePrice').isNumeric().withMessage('Credit wholesale price must be a number'),
    check('mrp').isNumeric().withMessage('MRP must be a number'),

    //handel the validation result
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
