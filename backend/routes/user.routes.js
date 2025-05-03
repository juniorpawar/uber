const express= require("express");
const {body} = require("express-validator")
const router = express.Router();

const userController = require("../controllers/user.controller")  // importing whole module
const authMiddelware = require("../middlewares/auth.middleware")

router.post("/register" ,[
    body("email").isEmail().withMessage("Invalid email"),
    body("fullName.firstName").isLength({ min: 3}).withMessage("First name must be at least 3 characters long"),
    body("password").isLength({ min: 6}).withMessage("password must be at least 6 characters long")
] , userController.registerUser)  // accessing the elements by member access operator (userController.registerUser)

router.post("/login" ,[
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6}).withMessage("password must be at least 6 characters long")
] , userController.loginUser) 

router.get("/profile" , authMiddelware.authUser ,userController.getUserProfile)
router.get("/logout" , authMiddelware.authUser , userController.logoutUser)

module.exports = router;