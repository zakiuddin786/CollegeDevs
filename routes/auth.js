const express = require("express");
const router = express.Router();
const {check}=require("express-validator");

const auth = require("../middleware/auth");
const User = require("../models/User");
const authController = require('../controllers/auth');

router.get("/",auth,async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        // console.log(user);
        res.json(user);
    }
    catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }

})
router.post(
    "/login"
    ,[
    check("email","valid email is required").isEmail(),
    check("password","Password is required").exists()
],
    authController.login
)

module.exports = router;