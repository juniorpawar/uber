const User = require("../models/userModel");


module.exports.createUser = async({ firstName, lastName, email, password }) => {
    if(!firstName || !email || !password){
        throw new Error("All fields are required");
    }

    const newUser = User.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password : await User.hashPassword(password)
    })

    return newUser;
}