
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recevier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      default: "",
      maxlength: 10000,
    },
    type: {
      type: String,
      enum: ["text", "image", "file", "audio"],
      default: "text",
    },
    attachment: {
      url: String,
      name: String,
      mimeType: String,
      size: Number,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

messageSchema.index({
  sender: 1,
  recevier: 1,
  createdAt: -1,
});

messageSchema.index({
  recevier: 1,
  isRead: 1,
});

module.exports = mongoose.model("Message", messageSchema);
