const express = require("express");
const router = express.Router();
const {check} = require("express-validator")

const userController = require("../controllers/user")

router.post("/register",[
    check("name","name should be at least 3 characters long.").isLength({min:3}),
    check("email","valid email is required").isEmail(),
    check("password","password should be at least 8 characters long.").isLength({min:8})
],
userController.createUser   
);

module.exports = router;