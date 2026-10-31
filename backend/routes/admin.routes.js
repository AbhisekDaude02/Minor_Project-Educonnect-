const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");
const c = require("../controllers/controller");
router.use(auth, requireRole("Admin"));
router.get("/stats", c.adminStats);
router.get("/users", c.adminListUsers);
router.patch("/users/:id/status", c.adminSetUserStatus);
module.exports = router;
