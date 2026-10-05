const express = require("express");
const router = express.Router();

const {sendMessage,getMessage,getAllConversation,markMessagesAsRead}=require("../controllers/messageController");
const authmiddleware = require("../middlewares/authmiddleware")

router.post("/sendmessage/:userId",authmiddleware,sendMessage);
router.get("/getmessage/:userId",authmiddleware,getMessage);
router.get("/getallmessage",authmiddleware,getAllConversation);
router.put("/read/:userId",authmiddleware,markMessagesAsRead);

module.exports = router;