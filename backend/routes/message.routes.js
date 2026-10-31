const router = require("express").Router();
const { auth } = require("../middleware/auth");
const c = require("../controllers/controller");
router.get("/:userId", auth, c.getMessages);
router.post("/", auth, c.sendMessage);
module.exports = router;
