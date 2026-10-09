const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const{ createPost,getAllPost, getOnePost, updatePost, deletePost, likeUnlike, addComment, deleteComment} = require("../controllers/postController");
const postUpload = require("../middlewares/postImageUpload");

const router = express.Router();

router.post("/createpost",authMiddleware,postUpload.single("image"), createPost);
router.get("/getallpost",authMiddleware,getAllPost);
router.get("/getone/:postId",authMiddleware,getOnePost);
router.put("/update/:postId",authMiddleware,updatePost);
router.delete("/delete/:postId",authMiddleware,deletePost);
router.post("/like/:postId/like",authMiddleware,likeUnlike);
router.post("/comment/:postId/comment",authMiddleware,addComment);
router.delete("/deletecomment/:postId/comment/:commentId",authMiddleware,deleteComment)

module.exports = router;