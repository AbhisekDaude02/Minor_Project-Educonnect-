
const mongoose = require("mongoose");

const User = require("../models/usersModel");
const Connection = require("../models/connectionModel");
const Message = require("../models/messageModel");

// ============================================
// HELPERS
// ============================================

const validId = (id) => {
  return mongoose.isValidObjectId(id);
};

// Check if two users are accepted friends
const friendShipCheck = async (user1, user2) => {
  if (!validId(user1) || !validId(user2)) {
    return false;
  }

  const connection = await Connection.exists({
    status: "accepted",
    $or: [
      {
        sender: user1,
        recevier: user2,
      },
      {
        sender: user2,
        recevier: user1,
      },
    ],
  });

  return Boolean(connection);
};

// Populate user details on messages
const populateMessage = (query) => {
  return query
    .populate(
      "sender",
      "fullName email role profilepic"
    )
    .populate(
      "recevier",
      "fullName email role profilepic"
    );
};

// Send a Socket.IO event to a user's private room
const emitToUser = (req, userId, event, payload) => {
  const io = req.app.get("io");

  if (!io) {
    console.warn(
      "Socket.IO is not initialized. Event:",
      event
    );
    return;
  }

  io.to(`user:${String(userId)}`).emit(
    event,
    payload
  );
};

// ============================================
// 1. SEND MESSAGE
// ============================================

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.userId;

    // Validate receiver
    if (!validId(receiverId)) {
      return res.status(400).json({
        message: "Invalid receiver ID",
      });
    }

    // Prevent messaging yourself
    if (
      String(senderId) === String(receiverId)
    ) {
      return res.status(400).json({
        message: "You cannot message yourself",
      });
    }

    // Check receiver and friendship
    const [receiver, friendship] =
      await Promise.all([
        User.findById(receiverId).select("_id"),
        friendShipCheck(senderId, receiverId),
      ]);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    if (!friendship) {
      return res.status(403).json({
        message:
          "Only accepted connections can send messages",
      });
    }

    // Get message content and type
    const content = String(
      req.body.content || ""
    ).trim();

    const type = req.body.type || "text";

    const allowedTypes = [
      "text",
      "image",
      "file",
      "audio",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid message type",
      });
    }

    // Validate text
    if (type === "text" && !content) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    if (content.length > 10000) {
      return res.status(400).json({
        message:
          "Message cannot exceed 10000 characters",
      });
    }

    // ========================================
    // HANDLE ATTACHMENTS
    // ========================================

    let attachment;

    if (req.file) {
      if (type === "text") {
        return res.status(400).json({
          message:
            "Use image, file, or audio type for uploads",
        });
      }

      if (
        type === "image" &&
        !req.file.mimetype.startsWith("image/")
      ) {
        return res.status(400).json({
          message: "Invalid image file",
        });
      }

      if (
        type === "audio" &&
        !req.file.mimetype.startsWith("audio/")
      ) {
        return res.status(400).json({
          message: "Invalid audio file",
        });
      }

      attachment = {
        url: `/uploads/messages/${req.file.filename}`,
        name: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };
    } else if (type !== "text") {
      return res.status(400).json({
        message: "Attachment is required",
      });
    }

    // ========================================
    // SAVE MESSAGE IN MONGODB
    // ========================================

    const savedMessage = await Message.create({
      sender: senderId,
      recevier: receiverId,
      content,
      type,
      attachment,
      isRead: false,
    });

    // Populate sender and receiver
    const newMessage = await populateMessage(
      Message.findById(savedMessage._id)
    );

    // ========================================
    // REAL-TIME SOCKET.IO DELIVERY
    // ========================================

    // Send instantly to receiver
    emitToUser(
      req,
      receiverId,
      "message:new",
      newMessage
    );

    // Send to sender's connected devices
    emitToUser(
      req,
      senderId,
      "message:new",
      newMessage
    );

    console.log(
      "Message saved and emitted:",
      savedMessage._id
    );

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error(
      "Error sending message:",
      error
    );

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};

// ============================================
// 2. GET MESSAGES BETWEEN TWO USERS
// ============================================

const getMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendId = req.params.userId;

    if (!validId(friendId)) {
      return res.status(400).json({
        message: "Invalid friend ID",
      });
    }

    const areFriends = await friendShipCheck(
      userId,
      friendId
    );

    if (!areFriends) {
      return res.status(403).json({
        message:
          "You can only view messages with accepted connections",
      });
    }

    const messages = await populateMessage(
      Message.find({
        $or: [
          {
            sender: userId,
            recevier: friendId,
          },
          {
            sender: friendId,
            recevier: userId,
          },
        ],
      }).sort({
        createdAt: 1,
      })
    );

    return res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.error(
      "Error getting messages:",
      error
    );

    return res.status(500).json({
      message: "Failed to get messages",
    });
  }
};

// ============================================
// 3. GET ALL CONVERSATIONS
// ============================================

const getAllConversation = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all accepted connections
    const connections = await Connection.find({
      status: "accepted",
      $or: [
        { sender: userId },
        { recevier: userId },
      ],
    })
      .populate(
        "sender",
        "fullName email role profilepic"
      )
      .populate(
        "recevier",
        "fullName email role profilepic"
      );

    const conversations = [];
    const seenUsers = new Set();

    for (const connection of connections) {
      const sender = connection.sender;
      const receiver = connection.recevier;

      if (!sender || !receiver) {
        continue;
      }

      const otherUser =
        String(sender._id) === String(userId)
          ? receiver
          : sender;

      const otherUserId =
        String(otherUser._id);

      // Prevent duplicate conversations
      if (seenUsers.has(otherUserId)) {
        continue;
      }

      seenUsers.add(otherUserId);

      // Get latest message
      const lastmessage = await Message.findOne({
        $or: [
          {
            sender: userId,
            recevier: otherUserId,
          },
          {
            sender: otherUserId,
            recevier: userId,
          },
        ],
      })
        .sort({ createdAt: -1 })
        .lean();

      // Count unread messages
      const unread =
        await Message.countDocuments({
          sender: otherUserId,
          recevier: userId,
          isRead: false,
        });

      conversations.push({
        user: otherUser,
        lastmessage,
        unread,
      });
    }

    // Latest conversations first
    conversations.sort((a, b) => {
      const dateA =
        a.lastmessage?.createdAt || 0;

      const dateB =
        b.lastmessage?.createdAt || 0;

      return (
        new Date(dateB).getTime() -
        new Date(dateA).getTime()
      );
    });

    return res.status(200).json({
      message:
        "Conversations fetched successfully",
      conversations,
    });
  } catch (error) {
    console.error(
      "Error getting conversations:",
      error
    );

    return res.status(500).json({
      message: "Failed to get conversations",
    });
  }
};

// ============================================
// 4. MARK MESSAGES AS READ
// ============================================

const markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendId = req.params.userId;

    if (!validId(friendId)) {
      return res.status(400).json({
        message: "Invalid friend ID",
      });
    }

    const areFriends = await friendShipCheck(
      userId,
      friendId
    );

    if (!areFriends) {
      return res.status(403).json({
        message:
          "You are not connected with this user",
      });
    }

    const result = await Message.updateMany(
      {
        sender: friendId,
        recevier: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    // Notify sender that messages were read
    emitToUser(
      req,
      friendId,
      "message:read",
      {
        readerId: String(userId),
        senderId: String(friendId),
      }
    );

    // Also notify reader's other devices
    emitToUser(
      req,
      userId,
      "message:read",
      {
        readerId: String(userId),
        senderId: String(friendId),
      }
    );

    return res.status(200).json({
      message:
        "Messages marked as read successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "Error marking messages as read:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to mark messages as read",
    });
  }
};

// ============================================
// EXPORT CONTROLLERS
// ============================================

module.exports = {
  sendMessage,
  getMessage,
  getAllConversation,
  markMessagesAsRead,
};
