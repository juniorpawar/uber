const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const captainController = require("../controllers/captain.controller")

router.post("/register",[
    body("email").isEmail().withMessage("Invalid email"),
    body("fullName.firstName").isLength({ min: 3}).withMessage("First name must be at least 3 characters long"),
    body("password").isLength({ min: 6}).withMessage("password must be at least 6 characters long"),
    body("vehicle.color").isLength({min:3}).withMessage("vehicle color must be at leat 3 charaters long"),
    body("vehicle.plate").isLength({min: 3}).withMessage("vehicle plate must be at least 3 characters long"),
    body("vehicle.capacity").isInt({min: 1}).withMessage("Capacity must be at least 1"),
    body("vehicle.vehicleType").isIn(["car","bike","auto"]).withMessage("Invalid vehicle type")
], captainController.registerCaptain
)
module.exports = router