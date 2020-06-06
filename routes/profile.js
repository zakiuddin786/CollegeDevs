const express = require("express");
const router = express.Router();

const {check, validationResult}=require("express-validator");


const auth = require("../middleware/auth");
const profileController = require("../controllers/profile");

router.get("/me", auth,
    // res.send("Profile Route");
    profileController.getProfile
);

router.post("/",[ auth, [
    check("status","Status is required").not().isEmpty(),
    check("skills","Skills are required!").not().isEmpty()
]] ,
profileController.updateProfile
);

module.exports = router;