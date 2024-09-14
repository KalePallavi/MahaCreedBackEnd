 const { check,body } = require('express-validator');
  
 exports.registerValidator = [

   //   check('name','Name is Required').not().isEmpty(),
   
     //check email
     check('email','Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots:true
     }),
    
    //check password 
    check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^\S*$/)
    .withMessage('Password cannot contain spaces'),

     
    // Check role field
    check('role', 'Role is required').not()
    .isEmpty()
    .isIn(['Super Admin', 'Company', 'Dealer', 'Retailer'])
        .withMessage('Invalid role'),

   //  // Conditional validation for CIN Number if role is 'Company'
   //  check('cinNumber')
   //      .if(body('role').equals('Company'))
   //      .not().isEmpty().withMessage('CIN Number is required for Company role'),

   //  // Conditional validation for License Number if role is 'Dealer' or 'Retailer'
   //  check('licenseNumber')
   //      .if(body('role').equals('Dealer').or(body('role').equals('Retailer')))
   //      .not().isEmpty().withMessage('License Number is required for Dealer or Retailer role'),
 ];

 exports.loginValidator = [
    
    check('email','Please include a valid email').isEmail().normalizeEmail({
       gmail_remove_dots:true
    }),
    
    check('password','Password is Required').not().isEmpty(),
];