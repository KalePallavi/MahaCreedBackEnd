const express = require('express');
const router = express();

const authContoller = require('../contollers/authContoller');

const { registerValidator,loginValidator } = require('../helpers/validator');

router.post('/register',registerValidator,authContoller.registerUser);
router.post('/login',loginValidator,authContoller.loginUser);
router.post('/complete-profile/:userId',authContoller.completeProfile);

router.post('/send-OTP',authContoller.ForgotPassword);
router.post('/verify-OTP',authContoller.VerifyOTP);
router.post('/resend-OTP',authContoller.ResendOTP);


module.exports = router;
