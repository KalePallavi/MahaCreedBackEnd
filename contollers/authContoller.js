const User = require('../models/User');
const Teams = require('../models/Teams');

const { generateJwtToken } = require('../helpers/JwtTokenHelper');
const { hashPassword, comparePassword } = require('../helpers/HashPassword')
require('dotenv').config();

const { validationResult } = require('express-validator');
const { transporter,sendOTPEmail,generateOTP } = require('../helpers/MailHelper');


//Register User based on Role 
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }
        const {email,mobileNumber, password, role, cinNumber, licenseNumber, natureOfBusiness,businessActivity } = req.body;
        const isExistUser = await User.findOne({ email });

        if (isExistUser) {
            return res.status(200).json({
                success: false,

                msg: "Email already exist !"
            })
        }
        // const hashPassword = await bcrypt.hash(password, 10);
        const hashPasswords = await hashPassword(password);
        const user = new User({
           
            email,
            mobileNumber,
            password: hashPasswords,
            role,
            natureOfBusiness,
            businessActivity,



        });
        if (role === 'Company') {
            user.cinNumber = cinNumber;
        } else if (role === 'Dealer' || role === 'Retailer') {
            user.licenseNumber = licenseNumber;
        }

        const userData = await user.save();
        try {
            const info = await transporter.sendMail({
                from: '"MahaCrred" <mahaCrred@gmail.com>', 
                to: email.toLowerCase().trim(), 
                subject: `Welcome to MahaCrred! 🎉`,
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                        <h2 style="color: #4CAF50;">Welcome to MahaCrred!</h2>
                        <p>We're excited to have you on board. Your account has been successfully created.</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                        <p>Please keep this information safe and secure.</p>
                        <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@mahaCrred.com">support@mahaCrred.com</a>.</p>
                        <p>We look forward to helping you achieve your goals with MahaCrred!</p>
                        <p>Best Regards,<br/>The MahaCrred Team</p>
                    </div>
                `,
            });
            console.log("Message sent: %s", info.messageId);
        } catch (emailError) {
            console.error("Error sending email: ", emailError);
        }
        return res.status(200).json({
            success: true,
            msg: 'registered successfully !',
            data: userData
        })

    }

    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}

//login user and employee
// const loginUser = async (req, res) => {
//     try {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(200).json({
//                 success: false,
//                 msg: 'Errors',
//                 errors: errors.array()
//             });
//         }
//         const { email, password } = req.body;
//         //checking email

        
//         const userData = await User.findOne({ email });
        
//         if (!userData) {
//             return res.status(400).json({
//                 success: false,
//                 msg: "Email & password is incorrect !"
//             })
//         }
//         //check the password
//        // const isPasswordMatch = await bcrypt.compare(password, userData.password);
//         const isPasswordMatch = comparePassword(password,userData.password);
//         if (!isPasswordMatch) {
//             return res.status(400).json({
//                 success: false,
//                 msg: "Email & password is incorrect !"
//             })
//         }

//         const accessToken = generateJwtToken(
//             {
//                 user:
//                 {
//                     _id: userData._id,
//                     role: userData.role,
//                     email: userData.email,

//                 }
//             });

//         return res.status(200).json({
//             success: true,
//             msg: 'Login successfully !',
//             accessToken: accessToken,
//             tokenType: 'Bearer',
//             data: {
//                 _id: userData._id,
//                 role: userData.role,
//                 name: userData.name,
//                 email: userData.email,
//                 natureOfBusiness: userData.natureOfBusiness,
//                 profileCompleted: userData.profileCompleted,
//                 isVerified: userData.isVerified,
//                 isActive: userData.isActive,
//                 createdAt: userData.createdAt,
//                 updatedAt: userData.updatedAt
//             },
//         })

//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             msg: error.message
//         });
//     }
// }

//same login for admin and employee

const loginUser = async(req, res) => {
  const   { email, password } = req.body;
  try {
    //check if the request body has any validation error
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(200).json({
            success:false,
            msg:'Errors',
            error:errors.array()
        });
    }
    //check is user table admin or super admin
    let user = await User.findOne({ email });
    if(user){
        const isMatch = await comparePassword(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                success: false,
                msg : "Email and Password is Incorrect !!"
            });
            
        }
        const accessToken = generateJwtToken(
            {user: {
                    id: user._id,
                    role: user.role,
                    email: user.email,
            }}
        )
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        return res.status(200).json({
            success: true,
            msg: 'Login successfully !',
            accessToken: accessToken,
            // tokenType: 'Bearer',
            data: {
                _id: user._id,
                role: user.role,
                name: user.name,
                email: user.email,
                licenseNumber: user.licenseNumber,
                cinNumber:user.cinNumber,
                natureOfBusiness: user.natureOfBusiness,
                businessActivity:user.businessActivity,
                profileCompleted: user.profileCompleted,
                isVerified: user.isVerified,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
        })

    }

    let employee = await Teams.findOne( {email});
    if(employee){
        const isMatch = await comparePassword(password, employee.password);
        if(!isMatch) {
            return res.status(400).json({
                success: false,
                msg : "Email and Password is Incorrect !!"
            });
            
        }
        const accessToken = generateJwtToken(
            {
                employee: {
                    id: employee._id,
                    designation: employee.designation,
                    email: employee.email,
            }}
        )
        res.setHeader('Authorization', `Bearer ${accessToken}`);

        return res.status(200).json({
            success: true,
            msg: 'Login successfully !',
            // accessToken: accessToken,
            // tokenType: 'Bearer',
            data: {
                _id: employee._id,
                adminID :employee.leaderId,
                name: employee.name,
                email: employee.email,
                employeeId:employee. employeeId,
                designation: employee.designation,
                // profileCompleted: employee.profileCompleted,
                // isVerified: employee.isVerified,

                isActive: employee.isActive,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt
            },
        });
    }
//if not admin and empoyee
return res.status(400).json({
    success: false,
    msg: "Email and Password is Incorrect !!"
});
    
  } catch (error) {
    res.status(500).json({
        success:false,
        msg:error.message,
        msgggg:"here we broke our server"
    });
  }
}

//Forgot password 
// const ForgotPassword = async( req, res ) => {
   
//     try{
//         const { email } = req.body;
//         if(!email){
//             return res.status(400).json({
//                 message:'email required '
//             })
//         }
//     console.log("email from req ", email);
    
//     const otp = generateOTP();
//     console.log("++++OTP++++",otp);
    
//     const otpExpiry = Date.now() + 10 * 60 * 1000; 
//     console.log("========Expiry=======",otpExpiry);
    
//     let user = await User.findOne({ email });
//     if(user) {
//         await User.updateOne( { email }, {otp, otpExpiry, otpAttempts:0});
//         sendOTPEmail(email, otp);
//         return res.status(200).json({
//             status: true,
//             message : 'OTP sent successfully to User'
//         })
//     }
//     let employee = await Teams.findOne({ email });
//     if(employee) {
//         await Teams.updateOne( { email }, {otp,otpExpiry,otpAttempts:0});
//         sendOTPEmail(email, otp);
//         return res.status(200).json({
//             status: true,
//             message : 'OTP sent successfully to Employee'
//         })
//     }
//     return res.status(400).json({
//         success: false,
//         msg: "Email is Incorrect !!"
//     });
// }catch (error) {
//     res.status(500).json({
//         success:false,
//         message:"Internal server error: ",error,
        
//     });
//   }
// }
const ForgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Validate email field
      if (!email) {
        return res.status(400).json({
          message: 'Email is required',
        });
      }
  
      console.log('Email from request:', email);
  
      // Generate a 4-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
      console.log('Generated OTP:', otp);
  
      const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
      console.log('OTP Expiry Time:', otpExpiry);
  
      // Find user by email
      let user = await User.findOne({ email });
      if (user) {
        // Update OTP, expiry, and reset attempts
        await User.updateOne({ email }, { otp, otpExpiry, otpAttempts: 0 });
        sendOTPEmail(email, otp);
        return res.status(200).json({
          status: true,
          message: 'OTP sent successfully to user',
        });
      }
  
      // Find employee by email
      let employee = await Teams.findOne({ email });
      if (employee) {
        // Update OTP, expiry, and reset attempts
        await Teams.updateOne({ email }, { otp, otpExpiry, otpAttempts: 0 });
        sendOTPEmail(email, otp);
        return res.status(200).json({
          status: true,
          message: 'OTP sent successfully to employee',
        });
      }
  
      // If no user or employee found
      return res.status(400).json({
        success: false,
        message: 'Email is incorrect or not found!',
      });
  
    } catch (error) {
      // Catch any server error
      console.error('Internal server error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  };
  
 

//Verify otp
// const VerifyOTP = async( req, res ) => {
//  try {
//      const { email , otp , newPassword } = req.body;
//      if(!email || !otp || !newPassword) {
//         return res.status(400).json({
//             success:false,
//             message:'email, otp , password required '
//         })
//      }
//      console.log('===============',req.body);
     
//      let user = await User.findOne({ email });
//      console.log("user is ",user);
     
//      if(user) {
//         // console.log('=====',user.otp,'===========',user.otpExpiry,'===========',user.email);
//         // const a = user.otp
//         // console.log(typeof(a), typeof (otp),typeof( user.otpExpiry));
//         // console.log('=========================================');
        
//         // console.log('=====', user.otp != otp ,'======',Date.now() > user.otpExpiry);
//         // console.log("Current Time:", Date.now());
//         //  console.log("OTP Expiry :", user.otpExpiry);

//         if(user.otp != otp || Date.now > user.otpExpiry) {
//             return res.status(400).send('Invalid or expired OTP')
//         }
//         const hashedPassword = await hashPassword(newPassword);
//         console.log('=======hashedpassword========',hashedPassword);
//         user.password = hashedPassword;
//         user.otp = undefined;
//         user.otpExpiry = undefined;
//         user.otpAttempts = undefined;

//         const data  =  await user.save();

//          return res.status(200).json({
//              status: true,
//              message : 'Password reset successfully for user ',
//              data: data
//          });
//      }
//      console.log('===============================');
     
//      const employee = await Teams.findOne({ email });
//      console.log('===============================');
//      console.log('Employee', employee);
     
//      if(employee) {
//         if(employee.otp != otp || Date.now() > employee.otpExpiry) {
//             return res.status(400).send('Invalid or expired OTP')
//         }
//         const hashedPassword = await hashPassword(newPassword);
//         console.log('=======hashedpassword========',hashedPassword);
//         employee.password = hashedPassword;
//         employee.otp = undefined;
//         employee.otpExpiry = undefined;
//         employee.otpAttempts = undefined;

//        const data = await employee.save();

//          return res.status(200).json({
//              status: true,
//              message : 'Password reset successfully for employee ',
//              data: data
//          });
//      }
//      return res.status(400).json({
//         success: false,
//         msg: "invalidate data"
//     });

//  } catch (error) {
//     console.error('error in server', error)
//         res.status(500).json({
//         success:false,
//         message:"Internal server Error: ",error,
        
//     });
//   }    
// }
const VerifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      // Ensure both email and otp are provided
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP are required'
        });
      }
  
      console.log('Request body:', req.body);
  
      // Check if the user exists in the User collection
      let user = await User.findOne({ email });
      console.log("User found:", user);
  
      if (user) {
        // Validate the OTP and its expiry
        if (user.otp != otp || Date.now() > user.otpExpiry) {
          return res.status(400).send('Invalid or expired OTP');
        }
  
        // Clear OTP-related fields
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = undefined;
  
        const data = await user.save();
  
        return res.status(200).json({
          success: true,
          message: 'OTP verified successfully for user',
          data: data
        });
      }
  
      // Check if the employee exists in the Teams collection
      const employee = await Teams.findOne({ email });
      console.log("Employee found:", employee);
  
      if (employee) {
        // Validate the OTP and its expiry for the employee
        if (employee.otp != otp || Date.now() > employee.otpExpiry) {
          return res.status(400).send('Invalid or expired OTP');
        }
  
        // Clear OTP-related fields
        employee.otp = undefined;
        employee.otpExpiry = undefined;
        employee.otpAttempts = undefined;
  
        const data = await employee.save();
  
        return res.status(200).json({
          success: true,
          message: 'OTP verified successfully for employee',
          data: data
        });
      }
  
      // If neither user nor employee is found
      return res.status(400).json({
        success: false,
        message: "Invalid data, user or employee not found"
      });
  
    } catch (error) {
      console.error('Error on server:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }


//Resend otp api


// const ResendOTP = async (req, res) => {
//     try {
//         const {email } = req.body;
//         if(!email) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email is required ',
//             });
//         }
//         let user = await User.findOne({email});
//         if(user){

//             if(user.otpBlockedUntil && Date.now() < user.otpBlockedUntil){
//                 const remainingTime = Math.round((user.otpBlockedUntil - Date.now())/60000);
//                 return res.status(403).json({
//                     success: false,
//                     message: `You are blocked from resending OTP . try agian in ${remainingTime} minute(s)`,
//                 });
//             }
        
//         console.log('====no attempt coming ===',user.otpAttempts);
        
//         if(user.otpAttempts >= 3 ){
//             user.otpBlockedUntil = Date.now() + 10 * 60 * 1000;
//             user.otpAttempts = 0;
//             await user.save();
            
//       return res.status(403).json({
//         success: false,
//         message: 'Too many attempts. You are blocked for 10 minutes',
//       });
//         }
    
//         //send otp
//         const newOTP = generateOTP();
//         user.otp = newOTP;
//          user.otpExpiry = Date.now() + 10 * 60 * 1000;
//         Number(user.otpAttempts += 1);
//         //console.log('=========',otp,'======',Expiry,'===========',attempt);
        
//        const data =  await user.save();
//         console.log('++++++++',data);
        
//         sendOTPEmail(email, newOTP);

//         return res.status(200).json({
//             success: true,
//             message: 'OTP resent successfully',
//             data: data,
//           });
        
        
//         } 

//         let Employee = await Teams.findOne({email});
//         if(Employee){

//             if(Employee.otpBlockedUntil && Date.now() < Employee.otpBlockedUntil){
//                 const remainingTime = Math.round((Employee.otpBlockedUntil - Date.now())/60000);
//                 return res.status(403).json({
//                     success: false,
//                     message: `You are blocked from resending OTP . try agian in ${remainingTime} minute(s)`,
//                 });
//             }
        
//         console.log('====no attempt coming ===',Employee.otpAttempts);
        
//         if(Employee.otpAttempts >= 3 ){
//             Employee.otpBlockedUntil = Date.now() + 10 * 60 * 1000;
//             Employee.otpAttempts = 0;
//             await Employee.save();
            
//       return res.status(403).json({
//         success: false,
//         message: 'Too many attempts. You are blocked for 10 minutes',
//       });
//         }
    
//         //send otp
//         const newOTP = generateOTP();
//         Employee.otp = newOTP;
//          Employee.otpExpiry = Date.now() + 10 * 60 * 1000;
//         Number(Employee.otpAttempts += 1);
//         //console.log('=========',otp,'======',Expiry,'===========',attempt);
        
//        const data =  await Employee.save();
//         console.log('++++++++',data);
//         sendOTPEmail(email, newOTP);

//         return res.status(200).json({
//             success: true,
//             message: 'OTP resent successfully',
//             data: data,
//           });
        
        
//         } 
//     return res.status(404).json({
//         success: false,
//         message: ' Not found'
//     });
//     } catch (error) {
//         console.error('error in server', error)
//         res.status(500).json({
//         success:false,
//         message:"Internal server Error: ",error,
        
//     });
//     }
// }



const ResendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate that the email is provided
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (user) {
            // Check if the user is blocked from resending OTP
            if (user.otpBlockedUntil && Date.now() < user.otpBlockedUntil) {
                const remainingTime = Math.round((user.otpBlockedUntil - Date.now()) / 60000);
                return res.status(403).json({
                    success: false,
                    message: `You are blocked from resending OTP. Try again in ${remainingTime} minute(s)`,
                });
            }

            // Check if too many OTP attempts have been made
            if (user.otpAttempts >= 3) {
                user.otpBlockedUntil = Date.now() + 10 * 60 * 1000; // Block for 10 minutes
                user.otpAttempts = 0;
                await user.save();

                return res.status(403).json({
                    success: false,
                    message: 'Too many attempts. You are blocked for 10 minutes',
                });
            }

            // Generate and send OTP
            const newOTP = generateOTP();
            user.otp = newOTP;
            user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
            user.otpAttempts += 1;

            const savedUser = await user.save();

            // Send OTP via email
            sendOTPEmail(email, newOTP);

            return res.status(200).json({
                success: true,
                message: 'OTP resent successfully',
                data: savedUser,
            });
        }

        // If no user found, search in the Employee (Teams) collection
        let employee = await Teams.findOne({ email });
        if (employee) {
            // Check if the employee is blocked from resending OTP
            if (employee.otpBlockedUntil && Date.now() < employee.otpBlockedUntil) {
                const remainingTime = Math.round((employee.otpBlockedUntil - Date.now()) / 60000);
                return res.status(403).json({
                    success: false,
                    message: `You are blocked from resending OTP. Try again in ${remainingTime} minute(s)`,
                });
            }

            // Check if too many OTP attempts have been made
            if (employee.otpAttempts >= 3) {
                employee.otpBlockedUntil = Date.now() + 10 * 60 * 1000;
                employee.otpAttempts = 0;
                await employee.save();

                return res.status(403).json({
                    success: false,
                    message: 'Too many attempts. You are blocked for 10 minutes',
                });
            }

            // Generate and send OTP
            const newOTP = generateOTP();
            employee.otp = newOTP;
            employee.otpExpiry = Date.now() + 10 * 60 * 1000;
            employee.otpAttempts += 1;

            const savedEmployee = await employee.save();

            // Send OTP via email
            sendOTPEmail(email, newOTP);

            return res.status(200).json({
                success: true,
                message: 'OTP resent successfully',
                data: savedEmployee,
            });
        }

        // If neither user nor employee is found, return not found
        return res.status(404).json({
            success: false,
            message: 'User or employee not found',
        });
    } catch (error) {
        console.error('Error in server:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


//complete profile status

const completeProfile = async (req, res) => {
    const userId = req.params.userId;


    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const updatedUser = await User.findById(userId);
        console.log("is that user mate", updatedUser);


        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the profileCompleted field to true
        updatedUser.profileCompleted = true;
        await updatedUser.save();

        return res.status(200).json({
            message: "Profile completed successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    registerUser,
    loginUser, 
    completeProfile,

    ForgotPassword,
    VerifyOTP,
    ResendOTP

}