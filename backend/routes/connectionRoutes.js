const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const { sendFriendRequest, getFriendRequest, acceptFriendRequest, rejectFriendRequest, getMyFriends } = require("../controllers/connectionController");

const router = express.Router();

router.post("/sendrequest/:userId",authMiddleware,sendFriendRequest);
router.get("/getrequest",authMiddleware,getFriendRequest);
router.put("/acceptrequest/:requestId",authMiddleware,acceptFriendRequest);
router.put("/rejectrequest/:requestId",authMiddleware,rejectFriendRequest);
router.get("/getfriends",authMiddleware,getMyFriends);

module.exports=router;