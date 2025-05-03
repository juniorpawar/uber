const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, "First name must be at lesat 3 charactes long"]
        },
        lastName: {
            type: String,
            minlength: [3, "Last name must be at lesat 3 charactes long"]
        }
    },
    email: {
        type:String,
        required: true,
        unique : true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    },
    status:{
        type: String,
        enum: ['active' , 'inactive'],
        default: 'inactive'
    },
    vehicle: {
        color:{
            type: String,
            required: true,
            minlength: [3 ,"Colour must be at leat 3 characters long"]
        },
        plate:{
            type: String,
            required: true,
            minlength: [3 ,"Plate must be at leat 3 characters long"]
        },
        capacity:{
            type: Number,
            required: true,
            minlength: [1 ,"Capacity must be at leat 1"]
        },
        vehicleType:{
            type: String,
            required: true,
            enum:['car','bike','auto']
        }
    },
    location: {
        latitude:{
            type: Number
        },
        longitude:{
            type: Number
        }
    }
}) 

captainSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({_id: this._id} , process.env.JWT_SECRET ,{expiresIn:'24h'});
    return token;
}

captainSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password , this.password)
}

captainSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password ,10)
}

const Captain = mongoose.model("captains" , captainSchema)

module.exports = Captain;