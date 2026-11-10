
const express = require("express");

const authMiddleware = require("../middlewares/authmiddleware");

const {
  getCommunityUsers,
  sendFriendRequest,
  getFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getMyFriends,
} = require("../controllers/connectionController");

const {
  getPublicProfile,
} = require("../controllers/publicProfileController");

const router = express.Router();

// Protect all connection routes
router.use(authMiddleware);

// Get all registered users with connection status
router.get("/users", getCommunityUsers);

// Get a registered user's public profile
router.get("/profile/:userId", getPublicProfile);

// Send friend request
router.post("/sendrequest/:userId", sendFriendRequest);

// Get incoming pending requests
router.get("/getrequest", getFriendRequest);

// Accept friend request
router.put("/acceptrequest/:requestId", acceptFriendRequest);

// Reject friend request
router.put("/rejectrequest/:requestId", rejectFriendRequest);

// Get accepted friends
router.get("/getfriends", getMyFriends);

module.exports = router;
