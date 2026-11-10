
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authmiddleware");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

router.get("/all", authMiddleware, getNotifications);

router.get("/unread-count", authMiddleware, getUnreadCount);

router.put("/read-all", authMiddleware, markAllAsRead);

router.put("/read/:id", authMiddleware, markAsRead);

router.delete("/delete/:id", authMiddleware, deleteNotification);

module.exports = router;
