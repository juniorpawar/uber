const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model")

module.exports.authUser = async (req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // extracting token form headers or cookies
    if(!token){
        return res.status(401).json({message: "Unauthorized user"})
    }

    const isBlacklisted = await blacklistTokenModel.findOne({token : token}) // finding the token in black list
    if(isBlacklisted){
        console.log("token found ",isBlacklisted)
        return res.status(401).json({ message:"Unauthorized user via old token" }) // if found the user is unauthorized
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET); // verifying token with secret key using jwt
        const user = await User.findById(decoded._id);  // extracting the whole user form the database to send its full information as response (excluding password)
        req.user = user;
        return next();
    }catch(err) {
        return res.status(401).json({message: "Unauthorized user"})
    }
}