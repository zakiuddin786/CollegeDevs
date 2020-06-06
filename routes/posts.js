const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const auth = require("../middleware/auth");
const postController = require("../controllers/posts")

router.post("/",[auth,[
    check("text","Text is required!").not().isEmpty()
]],
postController.addPost
)

module.exports = router;