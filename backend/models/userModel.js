const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullName: {  // object
        firstName: {
            type: String,
            required: true,
            minlength: [3, "firstname must be at least 3 characters long"]
        },
        lastName: {
            type: String,
            minLength: [3, "lastname must be at least 3 characters long"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "email must be greater than or equals to 5 characters"]
    },
    password: {
        type: String,
        required: true,
        select: false  // does not selects / extracts password for any find query 
    },
    socketId: {
        type: String,
    }
})

userSchema.methods.generateAuthToken = function () { // function to generate jwt token for the authorization
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    return token;
}

userSchema.methods.comparePassword = async function (password) { // a function that comapares password (parameter) and this.password refrencing to the user that calls this function
    const results = await bcrypt.compare(password, this.password); // returns true/false
    return results;
}

userSchema.statics.hashPassword = async function (password) {  // a function that genrates hashed passwords
    return await bcrypt.hash(password, 10);
}

const User = mongoose.model("users", userSchema)

module.exports = User