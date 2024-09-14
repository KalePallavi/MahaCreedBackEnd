const nodemailer = require('nodemailer')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

//send otp logic

const sendOTPEmail = async(email,otp) => {
    const mailOptions = {
        form:SMTP_USER,
        to: email,
        subject: 'Your OTP Code ',
        text:`Your OTP code is ${otp} it will expire in 10 minutes. `,
    }
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent ', info.response);
        
    } catch (error) {
        console.error('Error sending OTP Email: ',error);
        throw error;
    }
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

module.exports = {

    sendOTPEmail,
    generateOTP,
    transporter
}