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

router.get("/",auth,
postController.getAllPosts
);

router.get("/:postId",auth,
postController.getPost);

router.delete("/:postId",auth,
postController.deletePost);

router.post("/like/:postId",auth,
postController.likePost);

router.put("/unLike/:postId",auth,
postController.unLikePost);

router.post("/comment/:postId",[auth,[
    check("text","Text is required!").not().isEmpty()
]],
postController.addComment
)

router.delete("/:postId/:commentId",auth,
postController.deleteComment);

module.exports = router;