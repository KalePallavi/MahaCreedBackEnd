const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

const roleAuth = (requiredRole) => async(req, res, next) => {
    try {
        //extract token from header
        // const token = req.header('Authorization').replace('Bearer','');
        const token = req.header('Authorization')?.replace('Bearer ', '').trim();
        if(!token){
            return res.status(401).json({
                message: 'Authentication failed: Token missing'
            });
        }
        console.log("++++++++++++");
        console.log("vv",token);
        console.log("++++++++++++");
        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        // console.log("++++++++++++");
        console.log("+++++++",decoded);
        // console.log("*************",decoded.user.id);
        // console.log("++++++++++++");

        //check user in database
        const user = await User.findOne({_id:decoded.user.id,isActive:true});

        if(!user) {
            return res.status(401).json({
                message:"Authentication failed: User not found in user table"
            });
        }
        //check based on role
        if(user.role !== requiredRole) {
            return res.status(403).json({
                message: `Access denied : ${requiredRole}s only`
            });
        }
        //attched user infomation to the object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error: ',error);

        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                message:'Authentication failde : Token expired'
            });
        }else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Authentication failed: Invalid token'
            });
        }
        res.status(500).json({
            message:'Server error : Authentication failed'
        });
        
    }
}
module.exports = 
    roleAuth
;