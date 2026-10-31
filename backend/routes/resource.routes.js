const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const { auth } = require("../middleware/auth");
const c = require("../controllers/controller");
const uploadDir = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 12);
    cb(null, `${crypto.randomUUID()}${ext}`);
  }
});
const allowedExtensions = new Set([".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".png", ".jpg", ".jpeg"]);
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(ext)) {
      const error = new Error("Unsupported file type. Upload PDF, DOC/DOCX, PPT/PPTX, TXT, PNG, or JPG files.");
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  }
});
router.get("/", auth, c.listResources);
router.post("/", auth, upload.single("file"), c.createResource);
module.exports = router;
