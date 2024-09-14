const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
require('dotenv').config();

exports.generateJwtToken=( user) => {
    return jwt.sign(user, process.env.JWT_SECRET_KEY , {expiresIn:"10d"});
}
