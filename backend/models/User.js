const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["Student", "Professional", "Admin"], required: true, default: "Student" },
  university: { type: String, default: "", maxlength: 160 }, bio: { type: String, default: "", maxlength: 1000 },
  skills: [{ type: String, maxlength: 60 }], avatar: { type: String, default: "" },
  emailVerified: { type: Boolean, default: false }, accountStatus: { type: String, enum: ["active", "suspended"], default: "active" }
}, { timestamps: true });
userSchema.index({ name: 1 });
module.exports = mongoose.model("User", userSchema);
