
const mongoose = require("mongoose");
const User = require("../models/usersModel");
const Connection = require("../models/connectionModel");

const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId)
      .select(
        "fullName role profilepic bio location createdAt isverified " +
        "university program semester jobTitle company " +
        "experienceLevel skills website linkedin github"
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const connectionCount = await Connection.countDocuments({
      status: "accepted",
      $or: [
        { sender: userId },
        { recevier: userId },
      ],
    });

    return res.status(200).json({
      user,
      connectionCount,
    });
  } catch (error) {
    console.error("Public profile error:", error);

    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

module.exports = { getPublicProfile };
