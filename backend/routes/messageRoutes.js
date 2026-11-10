
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authmiddleware = require("../middlewares/authmiddleware");

const {
  sendMessage,
  getMessage,
  getAllConversation,
  markMessagesAsRead,
} = require("../controllers/messageController");

const router = express.Router();

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "messages"
);

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeExtension = extension
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "");

    cb(
      null,
      `${Date.now()}-${require("crypto")
        .randomBytes(12)
        .toString("hex")}${safeExtension}`
    );
  },
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/mpeg",
  "application/pdf",
  "text/plain",
];

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }

    cb(null, true);
  },
});

router.use(authmiddleware);

router.get("/getallmessage", getAllConversation);
router.get("/getmessage/:userId", getMessage);
router.put("/read/:userId", markMessagesAsRead);

router.post(
  "/sendmessage/:userId",
  (req, res, next) => {
    upload.single("attachment")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      next();
    });
  },
  sendMessage
);

module.exports = router;
