
const Connection = require("../models/connectionModel");

const getAcceptedFriends = async (userId) => {
  try {
    const connections = await Connection.find({
      status: "accepted",
      $or: [
        { sender: userId },
        { recevier: userId },
      ],
    });

    const friends = connections.map((connection) => {
      if (connection.sender.toString() === userId.toString()) {
        return connection.recevier;
      }

      return connection.sender;
    });

    return friends;

  } catch (error) {
    console.error("Get accepted friends error:", error);
    return [];
  }
};

module.exports = getAcceptedFriends;
