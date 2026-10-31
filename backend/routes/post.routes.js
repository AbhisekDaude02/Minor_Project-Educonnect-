const router = require("express").Router();
const { auth } = require("../middleware/auth");
const c = require("../controllers/controller");
router.get("/", auth, c.listPosts);
router.post("/", auth, c.createPost);
router.post("/:id/like", auth, c.toggleLike);
router.post("/:id/comments", auth, c.addComment);
module.exports = router;
