
const mongoose = require("mongoose");
const Connection = require("../models/connectionModel");
const User = require("../models/usersModel");
const createNotification = require("../utils/createNotification");

const isValidId = (id) => mongoose.isValidObjectId(id);

// GET PEOPLE + CONNECTION STATUS
const getCommunityUsers = async (req, res) => {
  try {
    const userId = req.user.userId;

    const users = await User.find({
      _id: { $ne: userId },
    })
      .select("fullName email role profilepic")
      .sort({ createdAt: -1 })
      .lean();

    const connections = await Connection.find({
      $or: [{ sender: userId }, { recevier: userId }],
    }).lean();

    const connectionMap = new Map();

    for (const connection of connections) {
      const sender = connection.sender.toString();
      const receiver = connection.recevier.toString();

      const otherId = sender === userId.toString()
        ? receiver
        : sender;

      let status = "none";

      if (connection.status === "accepted") {
        status = "friends";
      } else if (connection.status === "pending") {
        status = sender === userId.toString()
          ? "sent"
          : "received";
      }

      connectionMap.set(otherId, {
        connectionStatus: status,
        connectionId: connection._id,
      });
    }

    const communityUsers = users.map((user) => ({
      ...user,
      connectionStatus:
        connectionMap.get(user._id.toString())
          ?.connectionStatus || "none",
      connectionId:
        connectionMap.get(user._id.toString())
          ?.connectionId || null,
    }));

    return res.status(200).json({
      message: "Community users fetched successfully",
      users: communityUsers,
    });
  } catch (error) {
    console.error("Get community users error:", error);

    return res.status(500).json({
      message: "Failed to fetch community users",
    });
  }
};

// SEND FRIEND REQUEST
const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const recevierId = req.params.userId;

    if (!isValidId(recevierId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (senderId.toString() === recevierId.toString()) {
      return res.status(400).json({
        message: "You cannot send a request to yourself",
      });
    }

    const receiver = await User.findById(recevierId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let connection = await Connection.findOne({
      $or: [
        { sender: senderId, recevier: recevierId },
        { sender: recevierId, recevier: senderId },
      ],
    });

    if (connection) {
      if (connection.status === "pending") {
        return res.status(409).json({
          message: "A friend request is already pending",
        });
      }

      if (connection.status === "accepted") {
        return res.status(409).json({
          message: "You are already connected",
        });
      }

      connection.sender = senderId;
      connection.recevier = recevierId;
      connection.status = "pending";

      await connection.save();
    } else {
      connection = await Connection.create({
        sender: senderId,
        recevier: recevierId,
        status: "pending",
      });
    }

    await createNotification({
      recipient: recevierId,
      sender: senderId,
      type: "friend_request",
      message: "sent you a friend request",
      referenceId: connection._id,
      referenceModel: "Connection",
      io: req.app.get("io"),
    });

    return res.status(201).json({
      message: "Friend request sent successfully",
      connection,
    });
  } catch (error) {
    console.error("Send friend request error:", error);

    return res.status(500).json({
      message: "Failed to send friend request",
    });
  }
};

// GET INCOMING PENDING REQUESTS
const getFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;

    const connections = await Connection.find({
      recevier: userId,
      status: "pending",
    })
      .populate("sender", "fullName email role profilepic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Friend requests fetched successfully",
      connections,
    });
  } catch (error) {
    console.error("Get requests error:", error);

    return res.status(500).json({
      message: "Failed to get friend requests",
    });
  }
};

// ACCEPT FRIEND REQUEST
const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requestId = req.params.requestId;

    if (!isValidId(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    const request = await Connection.findOneAndUpdate(
      {
        _id: requestId,
        recevier: userId,
        status: "pending",
      },
      { $set: { status: "accepted" } },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        message: "Pending friend request not found",
      });
    }

    await createNotification({
      recipient: request.sender,
      sender: userId,
      type: "friend_accept",
      message: "accepted your friend request",
      referenceId: request._id,
      referenceModel: "Connection",
      io: req.app.get("io"),
    });

    return res.status(200).json({
      message: "Friend request accepted successfully",
      connection: request,
    });
  } catch (error) {
    console.error("Accept request error:", error);

    return res.status(500).json({
      message: "Failed to accept friend request",
    });
  }
};

// REJECT FRIEND REQUEST
const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requestId = req.params.requestId;

    if (!isValidId(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    const request = await Connection.findOneAndUpdate(
      {
        _id: requestId,
        recevier: userId,
        status: "pending",
      },
      { $set: { status: "rejected" } },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        message: "Pending friend request not found",
      });
    }

    return res.status(200).json({
      message: "Friend request rejected successfully",
    });
  } catch (error) {
    console.error("Reject request error:", error);

    return res.status(500).json({
      message: "Failed to reject friend request",
    });
  }
};

// GET ACCEPTED FRIENDS

const getMyFriends = async (req, res) => {
  try {
    const userId = req.user.userId;

    const connections = await Connection.find({
      $or: [
        { sender: userId },
        { recevier: userId },
      ],
      status: "accepted",
    })
      .populate("sender", "fullName email role profilepic")
      .populate("recevier", "fullName email role profilepic");

    const friends = connections
      .map((connection) => {
        if (
          connection.sender?._id.toString() === userId.toString()
        ) {
          return connection.recevier;
        }

        return connection.sender;
      })
      .filter(Boolean);

    return res.status(200).json({
      friends,
    });
  } catch (error) {
    console.error("Get friends error:", error);

    return res.status(500).json({
      message: "Failed to get friends",
    });
  }
};


module.exports = {
  getCommunityUsers,
  sendFriendRequest,
  getFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getMyFriends,
};
