
const getAcceptedFriends = require("./getAcceptedFriends");
const createNotification = require("./createNotification");

const notifyFriends = async ({
  userId,
  type,
  message,
  referenceId,
  referenceModel,
  io = null,
}) => {
  try {
    const friends = await getAcceptedFriends(userId);

    await Promise.all(
      friends.map((friendId) =>
        createNotification({
          recipient: friendId,
          sender: userId,
          type,
          message,
          referenceId,
          referenceModel,
          io,
        })
      )
    );

  } catch (error) {
    console.error("Notify friends error:", error);
  }
};

module.exports = notifyFriends;
