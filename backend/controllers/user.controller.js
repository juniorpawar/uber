const { ERR_REQ_ALREADY_SENT } = require("web3");
const User = require("../models/userModel");
const userService = require("../services/user.service")
const { validationResult } = require("express-validator")
const BlacklistTokenModel = require("../models/blacklistToken.model");
const blacklistTokenModel = require("../models/blacklistToken.model");


module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req); // checking for any errors from the express-validator side

    if (!errors.isEmpty()) {               // if any errors then return 
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { fullName, email, password } = req.body; // if no errors then extracting fields form the request body (use of json/form data parser is required)
    
    const existingUser = await User.findOne({ email }); // checking if the user already exists in the database
    if (existingUser) {                                             // if user already exists then return error message
        return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await User.hashPassword(password);
    const newUser = await userService.createUser({  // calling a service defined in SERVICES module to create a new user
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password
    });

    const token = newUser.generateAuthToken(); // calling the function defined in User model
    return res.status(201).json({ token, newUser })
}

module.exports.loginUser = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.ststus(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select("+password")
    if (!user) {
        return res.status(401).json({ message: "invalid email" })
    }

    const isCorrect = await user.comparePassword(password) // calling the method that was defined in the user model to comapre the given password and the password of the caller i.e. user
    if (!isCorrect) {
        return res.status(401).json({ message: "invalid email or password" })
    }

    const token = user.generateAuthToken();
    res.cookie("token", token)
    return res.status(200).json({ token, user })
}

module.exports.getUserProfile = async function (req, res, next) {
    return res.status(200).json(req.user) // returning the authorized user set by the middleware as a response that contains user details
}

module.exports.logoutUser = async function (req, res, next) {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]; // extracting token form headers or cookies
    res.clearCookie('token');
    await blacklistTokenModel.create({ token })

    res.status(200).json({ message: "User Logged out successfully" })
}