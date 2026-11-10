
const multer = require("multer");

const { CloudinaryStorage } =
  require("multer-storage-cloudinary");

const { cloudinary } =
  require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const mimeType = file.mimetype || "";

    let resourceType = "raw";
    let folder = "educonnect/messages/files";

    if (mimeType.startsWith("image/")) {
      resourceType = "image";
      folder = "educonnect/messages/images";
    } else if (mimeType.startsWith("audio/")) {
      resourceType = "video";
      folder = "educonnect/messages/audio";
    }

    return {
      folder,
      resource_type: resourceType,
      public_id: `message_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`,
    };
  },
});

const fileFilter = (req, file, callback) => {
  const mimeType = file.mimetype || "";

  const allowed =
    mimeType.startsWith("image/") ||
    mimeType.startsWith("audio/") ||
    [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(mimeType);

  if (!allowed) {
    return callback(
      new Error("Unsupported attachment type")
    );
  }

  callback(null, true);
};

const messageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

module.exports = messageUpload;
