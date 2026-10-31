const router = require("express").Router();
const { auth } = require("../middleware/auth");
const c = require("../controllers/controller");
router.get("/me", auth, c.getMe);
router.get("/", auth, c.listUsers);
router.get("/:id", auth, c.getUser);
router.put("/me", auth, c.updateMe);
module.exports = router;
