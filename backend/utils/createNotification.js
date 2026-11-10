
const Notification = require("../models/notificationModel");

const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  referenceId = null,
  referenceModel = null,
  io = null,
}) => {
  try {
    if (!recipient || !sender) return null;

    // Do not notify yourself
    if (recipient.toString() === sender.toString()) {
      return null;
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      referenceId,
      referenceModel,
    });

    const populatedNotification =
      await Notification.findById(notification._id)
        .populate("sender", "fullName email role profilepic");

    // Real-time notification (if Socket.IO is configured)
    if (io) {
      io.to(recipient.toString()).emit(
        "new-notification",
        populatedNotification
      );
    }

    return populatedNotification;

  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

module.exports = createNotification;
