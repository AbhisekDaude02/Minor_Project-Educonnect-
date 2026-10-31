// Create or promote an administrator using explicit environment credentials.
// Run from backend: ADMIN_NAME="Platform Admin" ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="..." node scripts/create-admin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
(async () => {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGO_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
    throw new Error("Set MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD (minimum 12 characters).");
  }
  await mongoose.connect(MONGO_URI);
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { name: ADMIN_NAME.trim(), email, password, role: "Admin", emailVerified: true, accountStatus: "active" }, $setOnInsert: { university: "", bio: "Platform administrator" } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  console.log(`Administrator configured: ${user.email}`);
  await mongoose.disconnect();
})().catch(async err => { console.error(err.message); try { await mongoose.disconnect(); } finally { process.exit(1); } });
