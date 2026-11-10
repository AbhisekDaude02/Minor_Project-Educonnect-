
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");

const { Server } = require("socket.io");

// Load environment variables first
dotenv.config();

// Database
const connectDB = require("./db");

// Routes
const userRoutes = require("./routes/userRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notesRoutes = require("./routes/notesRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Socket.IO
const socketConnection = require("./socket/socket");

// ==========================================
// EXPRESS APP
// ==========================================

const app = express();

const PORT = process.env.PORT || 3000;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// ==========================================
// STATIC UPLOADED FILES
// ==========================================

// Allows browser access to:
// http://localhost:3000/uploads/messages/file.webm
// http://localhost:3000/uploads/messages/image.jpg

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Educonnect server is running",
    status: "success",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", userRoutes);

app.use(
  "/api/connections",
  connectionRoutes
);

app.use("/api/post", postRoutes);

app.use("/api/message", messageRoutes);

app.use("/api/notes", notesRoutes);

app.use("/api/job", jobRoutes);

app.use(
  "/api/applyjob",
  jobApplicationRoutes
);

app.use(
  "/api/notification",
  notificationRoutes
);

// ==========================================
// HTTP SERVER
// ==========================================

const server = http.createServer(app);

// ==========================================
// SOCKET.IO SERVER
// ==========================================

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
    credentials: true,
  },

  transports: [
    "websocket",
    "polling",
  ],
});

// Make Socket.IO accessible from controllers
app.set("io", io);

// IMPORTANT:
// Register Socket.IO only once
socketConnection(io);

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(
        `Educonnect server running at http://localhost:${PORT}`
      );

      console.log(
        `Frontend allowed: ${CLIENT_URL}`
      );

      console.log(
        "Socket.IO initialized successfully"
      );
    });
  } catch (error) {
    console.error(
      "Server failed to start:",
      error
    );

    process.exit(1);
  }
};

startServer();
