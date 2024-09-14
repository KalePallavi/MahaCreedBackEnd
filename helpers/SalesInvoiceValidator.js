const { check, validationResult } = require('express-validator');

exports.salesInvoiceValidation = [
    check('companyId')
        .isMongoId().withMessage('Invalid company ID format'),
    
    check('customerId')
        .isMongoId().withMessage('Invalid customer ID format'),

    check('customerName')
        .notEmpty().withMessage('Customer name is required')
        .isString().withMessage('Customer name must be a string'),

    check('mobileNumber')
        .matches(/^\d{10}$/).withMessage('Mobile number must be 10 digits'),

    check('aadharCardNumber')
        .matches(/^\d{12}$/).withMessage('Aadhar Card number must be 12 digits'),

    check('invoiceDate')
        .optional()
        .isISO8601().withMessage('Invalid date format'),

    check('invoiceNumber')
        .notEmpty().withMessage('Invoice number is required')
        .isString().withMessage('Invoice number must be a string'),

    check('address')
        .notEmpty().withMessage('Address is required'),

    check('paymentMethod')
        .isIn(['Cash', 'Credit', 'Wholesale', 'Online']).withMessage('Invalid payment method'),

    check('creditPeriod')
        .optional()
        .isInt({ min: 1 }).withMessage('Credit period must be at least 1 if provided'),

    check('products.*.productId')
        .isMongoId().withMessage('Invalid product ID format'),

    check('products.*.batchNumber')
        .notEmpty().withMessage('Batch number is required'),

    check('products.*.expiryDate')
        .isISO8601().withMessage('Invalid expiry date format'),

    check('products.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

    check('products.*.price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    check('products.*.discount')
        .optional()
        .isFloat({ min: 0 }).withMessage('Discount cannot be negative'),

    check('products.*.gstRate')
        .isIn([5, 12, 18, 28]).withMessage('Invalid GST rate'),

    check('products.*.sgstAmount')
        .isFloat({ min: 0 }).withMessage('SGST amount must be a positive number'),

    check('products.*.cgstAmount')
        .isFloat({ min: 0 }).withMessage('CGST amount must be a positive number'),

    check('paymentDetails.upiPaymentAmount')
        .optional()
        .isFloat({ min: 0 }).withMessage('UPI payment amount must be a positive number'),

    check('paymentDetails.phoneNumber')
        .optional()
        .matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),

    check('paymentDetails.paidByCash')
        .optional()
        .isFloat({ min: 0 }).withMessage('Paid by cash must be a positive number'),

    check('paymentDetails.totalBill')
        .isFloat({ min: 0 }).withMessage('Total bill must be a positive number'),

    check('paymentDetails.billDiscount')
        .optional()
        .isFloat({ min: 0 }).withMessage('Bill discount must be a positive number'),

    check('paymentDetails.netBillAmount')
        .isFloat({ min: 0 }).withMessage('Net bill amount must be a positive number'),

    check('paymentDetails.totalPaidAmount')
        .isFloat({ min: 0 }).withMessage('Total paid amount must be a positive number'),

    check('paymentDetails.balance')
        .isFloat({ min: 0 }).withMessage('Balance must be a positive number'),

    check('paymentDetails.hamali')
        .optional()
        .isFloat({ min: 0 }).withMessage('Hamali must be a positive number'),

     
        
        (req, res , next ) => {
            const errors =  validationResult(req);
            if(!errors) {
                return res.status(400).json({
                    errors: errors.array()
                })
            }
            next();
        }
    ];

