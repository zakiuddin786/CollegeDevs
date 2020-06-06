const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const profileController = require("../controllers/profile");

router.get("/me", auth,
    // res.send("Profile Route");
    profileController.getProfile
)

module.exports = router;