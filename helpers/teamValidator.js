const { check, validationResult } = require('express-validator');

exports.validateTeam = [
    check('companyName')
        .notEmpty()
        .withMessage('Company name is required'),

    check('leaderId')
        .notEmpty()
        .withMessage('Leader ID is required')
        .isMongoId()
        .withMessage('Leader ID must be a valid MongoDB ObjectId'),

    check('employeeName')
        .notEmpty()
        .withMessage('Employee name is required'),

    check('email')
        .trim()
        .notEmpty()
        .withMessage('Email ID is required')
        .isEmail()
        .withMessage('Email ID must be a valid email'),

        check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^\S*$/)
        .withMessage('Password cannot contain spaces'),

    check('gstin')
        .notEmpty()
        .withMessage('GSTIN is required'),

    check('panCardNumber')
        .notEmpty()
        .withMessage('PAN Card Number is required'),

    check('designation')
        .notEmpty()
        .withMessage('Designation is required')
        .isIn(['A/C', 'W.H.O', 'Sales Person', 'Director', 'Manager', 'Store/Outlet'])
        .withMessage('Invalid designation'),

    check('employeeId')
        .notEmpty()
        .withMessage('Employee ID is required'),

    // Mobile number validation for Indian numbers only
    check('employeeMobileNumber')
        .trim()
        .notEmpty()
        .withMessage('Employee mobile number is required')
        .isMobilePhone('en-IN')
        .withMessage('Employee mobile number must be a valid Indian phone number'),

    check('personalEmailId')
        .notEmpty()
        .withMessage('Personal email ID is required')
        .isEmail()
        .withMessage('Personal email ID must be a valid email'),

    check('employeeAadharNumber')
        .notEmpty()
        .withMessage('Employee Aadhar number is required'),

    check('employeePanNumber')
        .notEmpty()
        .withMessage('Employee PAN number is required'),

    check('employeeCurrentAddress')
        .notEmpty()
        .withMessage('Employee current address is required'),

    check('employeePermanentAddress')
        .notEmpty()
        .withMessage('Employee permanent address is required'),

    // Handle validation result
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
