const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const http = require("http");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const resourceRoutes = require("./routes/resource.routes");
const jobRoutes = require("./routes/job.routes");
const connectionRoutes = require("./routes/connection.routes");
const messageRoutes = require("./routes/message.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
const server = http.createServer(app);
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const io = new Server(server, { cors: { origin: clientUrl, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] } });
app.set("io", io);

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.use(cors({ origin: clientUrl, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads"), { maxAge: "1d" }));

// Friendly root endpoint: opening http://localhost:5000 in a browser should not return 404.
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Welcome to EduConnect API",
    health: "/api/health",
    apiPrefix: "/api"
  });
});

app.get("/api/health", (req, res) => res.json({ ok: true, service: "EduConnect API", timestamp: new Date().toISOString() }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

// Authenticate Socket.IO connections with the same JWT used by REST endpoints.
// Never trust a user ID sent by the browser to determine room membership.
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!mongoose.isValidObjectId(decoded.id)) return next(new Error("Invalid token subject"));
    socket.data.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", socket => {
  // The room is derived from the verified token, never from client-supplied IDs.
  socket.join(`user:${socket.data.userId}`);
});

const PORT = Number(process.env.PORT) || 5000;
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("MONGO_URI and JWT_SECRET must be configured in backend/.env");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => server.listen(PORT, () => console.log(`EduConnect API running on http://localhost:${PORT}`)))
  .catch(err => { console.error("MongoDB connection failed:", err.message); process.exit(1); });

process.on("SIGTERM", async () => { await mongoose.connection.close(); server.close(() => process.exit(0)); });
