const router = require("express").Router();
const { auth } = require("../middleware/auth");
const c = require("../controllers/controller");
router.get("/", auth, c.listConnections);
router.post("/:userId", auth, c.createConnection);
router.patch("/:id", auth, c.updateConnection);
module.exports = router;
