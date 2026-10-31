function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);
  if (err.code === 11000) return res.status(409).json({ message: "A record with the same unique value already exists" });
  if (err.name === "ValidationError") return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(", ") });
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid data supplied" });
  if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ message: "File is too large" });
  res.status(err.statusCode || 500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
}
module.exports = { notFound, errorHandler };
