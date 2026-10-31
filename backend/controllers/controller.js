const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Connection = require("../models/Connection");
const Job = require("../models/Job");
const Message = require("../models/Message");
const Post = require("../models/Post");
const Resource = require("../models/Resource");
const EmailToken = require("../models/EmailToken");
const Notification = require("../models/Notification");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const PUBLIC_USER = "name role university bio skills avatar";
const PAGE_SIZE = 12;

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const isId = (id) => mongoose.isValidObjectId(id);
const clean = (value, max = 2000) => typeof value === "string" ? value.trim().slice(0, max) : value;
const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

function publicUser(user) {
  const value = user.toObject ? user.toObject() : { ...user };
  delete value.password;
  return value;
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 8 && password.length <= 128;
}

function validateOpportunity(body) {
  const type = body.type;
  if (!['Job', 'Internship'].includes(type)) return "Type must be Job or Internship";
  if (!clean(body.title, 160) || !clean(body.company, 160) || !clean(body.description, 5000)) {
    return "Title, company and description are required";
  }
  if (body.deadline && Number.isNaN(Date.parse(body.deadline))) return "Invalid deadline";
  if (body.deadline && new Date(body.deadline) < new Date()) return "Deadline cannot be in the past";
  return null;
}

// -------------------- Auth --------------------
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, university, bio } = req.body || {};
  const normalizedEmail = clean(email, 254)?.toLowerCase();
  if (!clean(name, 100) || !normalizedEmail || !password || !role) {
    return res.status(400).json({ message: "Name, email, password and role are required" });
  }
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return res.status(400).json({ message: "Please provide a valid email" });
  if (!validatePassword(password)) return res.status(400).json({ message: "Password must be 8-128 characters" });
  if (!["Student", "Professional"].includes(role)) return res.status(400).json({ message: "Invalid role" });
  if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({
    name: clean(name, 100), email: normalizedEmail, password: await bcrypt.hash(password, 12), role,
    university: clean(university, 160) || "", bio: clean(bio, 1000) || ""
  });
  const verifyToken = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ user: user._id, tokenHash: crypto.createHash("sha256").update(verifyToken).digest("hex"), purpose: "verify", expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
  let emailSent = false;
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: String(process.env.SMTP_SECURE).toLowerCase() === "true", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    const link = `${process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${verifyToken}`;
    await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: user.email, subject: "Verify your EduConnect email", text: `Verify your email by opening: ${link}`, html: `<p>Welcome to EduConnect.</p><p><a href="${link}">Verify your email</a></p><p>This link expires in 24 hours.</p>` });
    emailSent = true;
  }
  const response = { message: emailSent ? "Account created. Check your email to verify your account." : "Account created. SMTP is not configured; configure SMTP to send verification emails.", emailSent, user: publicUser(user) };
  if (process.env.NODE_ENV === "development" && !emailSent) response.developmentVerificationToken = verifyToken;
  res.status(201).json(response);
});

const login = asyncHandler(async (req, res) => {
  const email = clean(req.body?.email, 254)?.toLowerCase();
  const password = req.body?.password;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password" });
  if (user.accountStatus === "suspended") return res.status(403).json({ message: "This account is suspended" });
  if (!user.emailVerified && process.env.NODE_ENV !== "development") return res.status(403).json({ message: "Please verify your email before logging in" });
  res.json({ token: signToken(user._id), user: publicUser(user) });
});

// -------------------- Users / Network --------------------
const getMe = asyncHandler(async (req, res) => res.json(req.user));

const listUsers = asyncHandler(async (req, res) => {
  const q = clean(req.query.q, 100) || "";
  const filter = { _id: { $ne: req.user._id } };
  if (q) {
    const re = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ name: re }, { university: re }, { role: re }, { skills: re }];
  }
  const users = await User.find(filter).select(PUBLIC_USER).sort({ name: 1 }).limit(30).lean();
  res.json(users);
});

const getUser = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid user id" });
  const user = await User.findById(req.params.id).select(PUBLIC_USER).lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

const updateMe = asyncHandler(async (req, res) => {
  const allowed = ["name", "university", "bio", "skills", "avatar"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      if (key === "skills") req.user[key] = Array.isArray(req.body[key]) ? req.body[key].map(x => clean(String(x), 60)).filter(Boolean).slice(0, 30) : [];
      else req.user[key] = clean(String(req.body[key]), key === "bio" ? 1000 : 200);
    }
  }
  if (!req.user.name) return res.status(400).json({ message: "Name cannot be empty" });
  await req.user.save();
  res.json(publicUser(req.user));
});

const listConnections = asyncHandler(async (req, res) => {
  const rows = await Connection.find({ $or: [{ sender: req.user._id }, { receiver: req.user._id }] })
    .populate("sender", PUBLIC_USER).populate("receiver", PUBLIC_USER).sort({ updatedAt: -1 }).lean();
  res.json(rows);
});

const createConnection = asyncHandler(async (req, res) => {
  const targetId = req.params.userId;
  if (!isId(targetId)) return res.status(400).json({ message: "Invalid user id" });
  if (targetId === req.user._id.toString()) return res.status(400).json({ message: "Cannot connect to yourself" });
  if (!await User.exists({ _id: targetId })) return res.status(404).json({ message: "User not found" });
  const existing = await Connection.findOne({ $or: [{ sender: req.user._id, receiver: targetId }, { sender: targetId, receiver: req.user._id }] });
  if (existing) return res.status(409).json({ message: existing.status === "rejected" ? "A connection already exists" : "Connection request already exists" });
  try {
    const row = await Connection.create({ sender: req.user._id, receiver: targetId });
    await row.populate("sender", PUBLIC_USER);
    await row.populate("receiver", PUBLIC_USER);
    res.status(201).json(row);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Connection request already exists" });
    throw err;
  }
});

const updateConnection = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid connection id" });
  const { status } = req.body || {};
  if (!["accepted", "rejected"].includes(status)) return res.status(400).json({ message: "Status must be accepted or rejected" });
  const row = await Connection.findOne({ _id: req.params.id, receiver: req.user._id });
  if (!row) return res.status(404).json({ message: "Incoming request not found" });
  row.status = status;
  await row.save();
  await row.populate("sender", PUBLIC_USER);
  await row.populate("receiver", PUBLIC_USER);
  res.json(row);
});

// -------------------- Jobs / Internships --------------------
function opportunityFilter(query) {
  const filter = {};
  const and = [];
  const q = clean(query.q, 100);
  if (q) {
    const re = new RegExp(escapeRegex(q), "i");
    and.push({ $or: [{ title: re }, { company: re }, { description: re }, { skills: re }, { location: re }] });
  }
  if (["Job", "Internship"].includes(query.type)) filter.type = query.type;
  if (query.location) filter.location = new RegExp(escapeRegex(clean(query.location, 100)), "i");
  and.push({ $or: [{ deadline: { $exists: false } }, { deadline: null }, { deadline: { $gte: new Date() } }] });
  if (and.length) filter.$and = and;
  return filter;
}

const listOpportunities = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || PAGE_SIZE));
  const filter = opportunityFilter(req.query);
  const [items, total] = await Promise.all([
    Job.find(filter).populate("postedBy", "name role university avatar").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Job.countDocuments(filter)
  ]);
  res.json({ jobs: items, opportunities: items, total, page, pages: Math.ceil(total / limit) });
});

const createOpportunity = asyncHandler(async (req, res) => {
  const error = validateOpportunity(req.body || {});
  if (error) return res.status(400).json({ message: error });
  const skills = Array.isArray(req.body.skills) ? req.body.skills : String(req.body.skills || "").split(",");
  const job = await Job.create({
    title: clean(req.body.title, 160), company: clean(req.body.company, 160), description: clean(req.body.description, 5000),
    location: clean(req.body.location, 160) || "Remote", type: req.body.type,
    skills: skills.map(s => clean(String(s), 60)).filter(Boolean).slice(0, 30),
    deadline: req.body.deadline ? new Date(req.body.deadline) : undefined, postedBy: req.user._id
  });
  await job.populate("postedBy", "name role university avatar");
  res.status(201).json(job);
});

const getOpportunity = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid opportunity id" });
  const job = await Job.findById(req.params.id).populate("postedBy", "name role university avatar");
  if (!job) return res.status(404).json({ message: "Opportunity not found" });
  res.json(job);
});

const updateOpportunity = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid opportunity id" });
  const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
  if (!job) return res.status(404).json({ message: "Opportunity not found or not owned by you" });
  const next = { ...job.toObject(), ...req.body, type: req.body.type || job.type };
  const error = validateOpportunity(next);
  if (error) return res.status(400).json({ message: error });
  ["title", "company", "description", "location", "type"].forEach(k => { if (req.body[k] !== undefined) job[k] = clean(req.body[k], k === "description" ? 5000 : 160); });
  if (req.body.skills !== undefined) job.skills = (Array.isArray(req.body.skills) ? req.body.skills : String(req.body.skills).split(",")).map(s => clean(String(s), 60)).filter(Boolean).slice(0, 30);
  if (req.body.deadline !== undefined) job.deadline = req.body.deadline ? new Date(req.body.deadline) : undefined;
  await job.save();
  await job.populate("postedBy", "name role university avatar");
  res.json(job);
});

const deleteOpportunity = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid opportunity id" });
  const result = await Job.deleteOne({ _id: req.params.id, postedBy: req.user._id });
  if (!result.deletedCount) return res.status(404).json({ message: "Opportunity not found or not owned by you" });
  res.status(204).send();
});

const applyToOpportunity = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid opportunity id" });
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Opportunity not found" });
  if (job.deadline && job.deadline < new Date()) return res.status(409).json({ message: "Applications are closed for this opportunity" });
  if (job.postedBy.toString() === req.user._id.toString()) return res.status(400).json({ message: "You cannot apply to your own opportunity" });
  if (job.applications.some(a => a.student.toString() === req.user._id.toString())) return res.status(409).json({ message: "Already applied" });
  job.applications.push({ student: req.user._id, coverLetter: clean(req.body?.coverLetter, 3000) || "" });
  await job.save();
  const application = job.applications[job.applications.length - 1];
  await Notification.create({ recipient: job.postedBy, actor: req.user._id, type: "application", message: `${req.user.name} applied for ${job.title}`, link: "/jobs/mine" });
  req.app.get("io")?.to(`user:${job.postedBy}`).emit("notification:new", { type: "application", message: `${req.user.name} applied for ${job.title}` });
  res.status(201).json({ message: "Application submitted", application });
});

const listMyOpportunities = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).populate("applications.student", "name email university role").sort({ createdAt: -1 });
  res.json(jobs);
});

const listMyApplications = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ "applications.student": req.user._id }).populate("postedBy", "name company role university").sort({ createdAt: -1 }).lean();
  const applications = [];
  for (const job of jobs) {
    const application = job.applications.find(a => a.student.toString() === req.user._id.toString());
    if (application) applications.push({ ...application, opportunity: { ...job, applications: undefined } });
  }
  res.json(applications);
});

const updateApplication = asyncHandler(async (req, res) => {
  const allowed = ["Applied", "Shortlisted", "Rejected", "Accepted"];
  if (!allowed.includes(req.body?.status)) return res.status(400).json({ message: "Invalid application status" });
  if (!isId(req.params.jobId) || !isId(req.params.applicationId)) return res.status(400).json({ message: "Invalid id" });
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
  if (!job) return res.status(404).json({ message: "Opportunity not found" });
  const application = job.applications.id(req.params.applicationId);
  if (!application) return res.status(404).json({ message: "Application not found" });
  application.status = req.body.status;
  await job.save();
  await Notification.create({ recipient: application.student, actor: req.user._id, type: "application_status", message: `Your application for ${job.title} is now ${application.status}`, link: "/jobs/applications" });
  req.app.get("io")?.to(`user:${application.student}`).emit("notification:new", { type: "application_status", message: `Your application for ${job.title} is now ${application.status}` });
  res.json(application);
});

// -------------------- Messages --------------------
const getMessages = asyncHandler(async (req, res) => {
  if (!isId(req.params.userId)) return res.status(400).json({ message: "Invalid user id" });
  if (!await User.exists({ _id: req.params.userId })) return res.status(404).json({ message: "User not found" });
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));
  const messages = await Message.find({ $or: [{ sender: req.user._id, receiver: req.params.userId }, { sender: req.params.userId, receiver: req.user._id }] })
    .sort({ createdAt: -1 }).limit(limit).populate("sender", "name avatar").populate("receiver", "name avatar");
  res.json(messages.reverse());
});

const sendMessage = asyncHandler(async (req, res) => {
  const receiver = req.body?.receiver;
  const text = clean(req.body?.text, 5000);
  if (!isId(receiver)) return res.status(400).json({ message: "Valid receiver is required" });
  if (!text) return res.status(400).json({ message: "Message cannot be empty" });
  if (receiver === req.user._id.toString()) return res.status(400).json({ message: "You cannot message yourself" });
  if (!await User.exists({ _id: receiver })) return res.status(404).json({ message: "Receiver not found" });
  const message = await Message.create({ sender: req.user._id, receiver, text });
  await message.populate("sender", "name avatar");
  await message.populate("receiver", "name avatar");
  await Notification.create({ recipient: receiver, actor: req.user._id, type: "message", message: `New message from ${req.user.name}`, link: `/messages/${req.user._id}` });
  req.app.get("io")?.to(`user:${receiver}`).emit("message:new", message);
  req.app.get("io")?.to(`user:${receiver}`).emit("notification:new", { type: "message", message: `New message from ${req.user.name}` });
  res.status(201).json(message);
});

// -------------------- Feed --------------------
const listPosts = asyncHandler(async (req, res) => {
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));
  const posts = await Post.find().populate("author", "name role university avatar").populate("comments.user", "name avatar").sort({ createdAt: -1 }).limit(limit).lean();
  res.json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  const text = clean(req.body?.text, 5000) || "";
  const image = clean(req.body?.image, 500) || "";
  if (!text && !image) return res.status(400).json({ message: "Post text or image is required" });
  const post = await Post.create({ author: req.user._id, text, image });
  await post.populate("author", "name role university avatar");
  res.status(201).json(post);
});

const toggleLike = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid post id" });
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  const index = post.likes.findIndex(id => id.toString() === req.user._id.toString());
  if (index >= 0) post.likes.splice(index, 1); else post.likes.push(req.user._id);
  await post.save();
  res.json({ liked: index < 0, likes: post.likes.length });
});

const addComment = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid post id" });
  const text = clean(req.body?.text, 1000);
  if (!text) return res.status(400).json({ message: "Comment is required" });
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.comments.push({ user: req.user._id, text });
  await post.save();
  await post.populate("comments.user", "name avatar");
  res.json(post);
});

// -------------------- Resources --------------------
const listResources = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || PAGE_SIZE));
  const filter = {};
  ["subject", "university", "category"].forEach(k => { if (req.query[k]) filter[k] = new RegExp(escapeRegex(clean(req.query[k], 100)), "i"); });
  if (req.query.q) filter.$text = { $search: clean(req.query.q, 100) };
  const [resources, total] = await Promise.all([
    Resource.find(filter).populate("uploadedBy", "name university role avatar").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Resource.countDocuments(filter)
  ]);
  res.json({ resources, total, page, pages: Math.ceil(total / limit) });
});

const createResource = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please select a file" });
  if (!clean(req.body.title, 200) || !clean(req.body.subject, 120)) return res.status(400).json({ message: "Title and subject are required" });
  const resource = await Resource.create({
    title: clean(req.body.title, 200), description: clean(req.body.description, 2000) || "", subject: clean(req.body.subject, 120),
    university: clean(req.body.university, 160) || "", category: ["Notes", "Guide", "Question Paper", "Other"].includes(req.body.category) ? req.body.category : "Notes",
    fileName: req.file.originalname, fileUrl: `/uploads/${req.file.filename}`, uploadedBy: req.user._id
  });
  await resource.populate("uploadedBy", "name university role avatar");
  res.status(201).json(resource);
});


// -------------------- Email verification / password reset --------------------
const verifyEmail = asyncHandler(async (req, res) => {
  const token = clean(req.body?.token, 200);
  if (!token) return res.status(400).json({ message: "Verification token is required" });
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const record = await EmailToken.findOne({ tokenHash, purpose: "verify", expiresAt: { $gt: new Date() } });
  if (!record) return res.status(400).json({ message: "Verification token is invalid or expired" });
  await User.updateOne({ _id: record.user }, { $set: { emailVerified: true } });
  await EmailToken.deleteMany({ user: record.user, purpose: "verify" });
  res.json({ success: true, message: "Email verified successfully. You can now log in." });
});

const resendVerification = asyncHandler(async (req, res) => {
  const email = clean(req.body?.email, 254)?.toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required" });
  const user = await User.findOne({ email });
  if (!user || user.emailVerified) return res.json({ message: "If the account requires verification, an email will be sent." });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return res.status(503).json({ message: "Email service is not configured" });
  await EmailToken.deleteMany({ user: user._id, purpose: "verify" });
  const token = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ user: user._id, tokenHash: crypto.createHash("sha256").update(token).digest("hex"), purpose: "verify", expiresAt: new Date(Date.now()+86400000) });
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: String(process.env.SMTP_SECURE).toLowerCase() === "true", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  const link = `${process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${token}`;
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: user.email, subject: "Verify your EduConnect email", text: `Verify your email: ${link}` });
  res.json({ message: "If the account requires verification, an email will be sent." });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = clean(req.body?.email, 254)?.toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required" });
  const user = await User.findOne({ email });
  const generic = { message: "If an account exists for this email, password-reset instructions will be sent." };
  if (!user || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return res.json(generic);
  await EmailToken.deleteMany({ user: user._id, purpose: "reset" });
  const token = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ user: user._id, tokenHash: crypto.createHash("sha256").update(token).digest("hex"), purpose: "reset", expiresAt: new Date(Date.now()+3600000) });
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: String(process.env.SMTP_SECURE).toLowerCase() === "true", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  const link = `${process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: user.email, subject: "Reset your EduConnect password", text: `Reset your password within one hour: ${link}` });
  res.json(generic);
});

const resetPassword = asyncHandler(async (req, res) => {
  const token = clean(req.body?.token, 200), password = req.body?.password;
  if (!token || !validatePassword(password)) return res.status(400).json({ message: "A valid token and password of 8-128 characters are required" });
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const record = await EmailToken.findOne({ tokenHash, purpose: "reset", expiresAt: { $gt: new Date() } });
  if (!record) return res.status(400).json({ message: "Reset token is invalid or expired" });
  const hash = await bcrypt.hash(password, 12);
  await User.updateOne({ _id: record.user }, { $set: { password: hash } });
  await EmailToken.deleteMany({ user: record.user, purpose: "reset" });
  res.json({ message: "Password reset successfully. Please log in again." });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!validatePassword(newPassword)) return res.status(400).json({ message: "New password must be 8-128 characters" });
  const user = await User.findById(req.user._id).select("+password");
  if (!user || !(await bcrypt.compare(currentPassword || "", user.password))) return res.status(400).json({ message: "Current password is incorrect" });
  user.password = await bcrypt.hash(newPassword, 12); await user.save();
  res.json({ message: "Password changed successfully" });
});

const listNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(limit).populate("actor", "name avatar").lean();
  res.json({ notifications, unread: await Notification.countDocuments({ recipient: req.user._id, readAt: null }) });
});
const markNotificationRead = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid notification id" });
  const item = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { $set: { readAt: new Date() } }, { new: true });
  if (!item) return res.status(404).json({ message: "Notification not found" });
  res.json(item);
});
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, readAt: null }, { $set: { readAt: new Date() } });
  res.json({ message: "Notifications marked as read" });
});

const adminListUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1), limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
  const [users, total] = await Promise.all([User.find().select("-password").sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit).lean(), User.countDocuments()]);
  res.json({ users, total, page, pages: Math.ceil(total/limit) });
});
const adminSetUserStatus = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ message: "Invalid user id" });
  if (!['active','suspended'].includes(req.body?.accountStatus)) return res.status(400).json({ message: "accountStatus must be active or suspended" });
  if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: "You cannot suspend your own account" });
  const user = await User.findByIdAndUpdate(req.params.id, { $set: { accountStatus: req.body.accountStatus } }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});
const adminStats = asyncHandler(async (req, res) => {
  const [users, students, professionals, jobs, resources, posts] = await Promise.all([User.countDocuments(), User.countDocuments({role:"Student"}), User.countDocuments({role:"Professional"}), Job.countDocuments(), Resource.countDocuments(), Post.countDocuments()]);
  res.json({ users, students, professionals, opportunities: jobs, resources, posts });
});

module.exports = {
  asyncHandler, register, login, getMe, listUsers, getUser, updateMe,
  listConnections, createConnection, updateConnection,
  listOpportunities, createOpportunity, getOpportunity, updateOpportunity, deleteOpportunity,
  applyToOpportunity, listMyOpportunities, listMyApplications, updateApplication,
  getMessages, sendMessage, listPosts, createPost, toggleLike, addComment,
  listResources, createResource, verifyEmail, resendVerification, forgotPassword, resetPassword, changePassword,
  listNotifications, markNotificationRead, markAllNotificationsRead, adminListUsers, adminSetUserStatus, adminStats
};
