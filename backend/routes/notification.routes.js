const router = require("express").Router();
const { auth } = require("../middleware/auth");
const c = require("../controllers/controller");
router.use(auth);
router.get("/", c.listNotifications);
router.patch("/read-all", c.markAllNotificationsRead);
router.patch("/:id/read", c.markNotificationRead);
module.exports = router;
