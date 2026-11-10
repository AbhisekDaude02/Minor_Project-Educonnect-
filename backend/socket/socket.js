
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const mongoose = require("mongoose");

const Connection = require("../models/connectionModel");

// userId -> number of connected browser tabs/devices
const onlineUsers = new Map();

// Check whether two users are accepted connections
const checkFriendShip = async (user1, user2) => {
  if (
    !mongoose.isValidObjectId(user1) ||
    !mongoose.isValidObjectId(user2)
  ) {
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

const socketConnection = (io) => {
  // =========================================
  // AUTHENTICATE SOCKET CONNECTION
  // =========================================

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(
        socket.handshake.headers.cookie || ""
      );

      // IMPORTANT:
      // Match this cookie name with your login controller.
      const token = cookies.token;

      if (!token) {
        return next(
          new Error("Authentication token missing")
        );
      }

      // IMPORTANT:
      // Match this secret with authmiddleware.js.
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

      const userId = decoded.userId || decoded.id;

      if (!mongoose.isValidObjectId(userId)) {
        return next(new Error("Invalid user"));
      }

      socket.userId = String(userId);

      next();
    } catch (error) {
      console.error(
        "Socket authentication error:",
        error.message
      );

      next(new Error("Unauthorized"));
    }
  });

  // =========================================
  // SOCKET CONNECTION
  // =========================================

  io.on("connection", (socket) => {
    const userId = socket.userId;

    console.log(
      "User connected:",
      userId,
      socket.id
    );

    // Join the authenticated user's private room
    socket.join(`user:${userId}`);

    const previousCount =
      onlineUsers.get(userId) || 0;

    onlineUsers.set(userId, previousCount + 1);

    // Broadcast presence only when first device connects
    if (previousCount === 0) {
      io.emit("presence:update", {
        userId,
        online: true,
      });
    }

    // =========================================
    // GET ONLINE USERS
    // =========================================

    socket.on("presence:get", (callback) => {
      if (typeof callback === "function") {
        callback([...onlineUsers.keys()]);
      }
    });

    // =========================================
    // TYPING INDICATOR
    // =========================================

    socket.on("typing:start", async (data = {}) => {
      try {
        const receiverId = data.to;

        if (
          !(await checkFriendShip(
            userId,
            receiverId
          ))
        ) {
          return;
        }

        io.to(`user:${receiverId}`).emit(
          "typing:start",
          { userId }
        );
      } catch (error) {
        console.error("Typing error:", error);
      }
    });

    socket.on("typing:stop", async (data = {}) => {
      try {
        const receiverId = data.to;

        if (
          !(await checkFriendShip(
            userId,
            receiverId
          ))
        ) {
          return;
        }

        io.to(`user:${receiverId}`).emit(
          "typing:stop",
          { userId }
        );
      } catch (error) {
        console.error("Stop typing error:", error);
      }
    });

    // =========================================
    // WEBRTC AUDIO / VIDEO SIGNALING
    // =========================================

    const forwardCallEvent = (eventName) => {
      socket.on(eventName, async (data = {}) => {
        try {
          const receiverId = data.to;
          const callId = data.callId;

          if (
            !receiverId ||
            typeof callId !== "string" ||
            callId.length > 128
          ) {
            return;
          }

          const areFriends =
            await checkFriendShip(
              userId,
              receiverId
            );

          if (!areFriends) {
            socket.emit("call:error", {
              message:
                "You can only call accepted connections",
            });
            return;
          }

          const payload = {
            from: userId,
            callId,
          };

          if (eventName === "call:offer") {
            if (
              !["audio", "video"].includes(data.type) ||
              data.offer?.type !== "offer"
            ) {
              return;
            }

            payload.type = data.type;
            payload.offer = data.offer;
          }

          if (eventName === "call:answer") {
            if (data.answer?.type !== "answer") {
              return;
            }

            payload.answer = data.answer;
          }

          if (eventName === "call:ice") {
            if (!data.candidate) return;

            payload.candidate = data.candidate;
          }

          io.to(`user:${receiverId}`).emit(
            eventName,
            payload
          );
        } catch (error) {
          console.error(
            `${eventName} error:`,
            error
          );
        }
      });
    };

    [
      "call:offer",
      "call:answer",
      "call:ice",
      "call:end",
      "call:reject",
    ].forEach(forwardCallEvent);

    // =========================================
    // DISCONNECT
    // =========================================

    socket.on("disconnect", () => {
      const count =
        onlineUsers.get(userId) || 1;

      if (count <= 1) {
        onlineUsers.delete(userId);

        io.emit("presence:update", {
          userId,
          online: false,
        });
      } else {
        onlineUsers.set(userId, count - 1);
      }

      console.log(
        "User disconnected:",
        userId,
        socket.id
      );
    });
  });
};

module.exports = socketConnection;
