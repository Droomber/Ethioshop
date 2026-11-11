require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({
  origin: (process.env.CLIENT_ORIGIN || "http://127.0.0.1:5500,http://localhost:5500,http://localhost:3000,https://droomber.github.io/Ethioshop/").split(","),
  credentials: true
}));
app.use(express.json({ limit: "25kb" }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});
app.use("/api", apiLimiter);

// Health Endpoint
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "EthioMarket API" }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/reviews", require("./routes/reviews"));

// Global Error Handler Middleware
app.use((err, _req, res, _next) => {
  console.error("Internal Error:", err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ CRITICAL ERROR: MONGODB_URI is not defined in backend/.env file.");
  process.exit(1);
}

// Online Database Connection Routine
mongoose.connect(mongoUri)
  .then(() => {
    console.log("📦 Successfully connected to MongoDB Atlas!");
    app.listen(port, () => console.log(`🚀 EthioMarket API running on port ${port}`));
  })
  .catch(e => {
    console.error("❌ Database connection failed:", e.message);
    process.exit(1);
  });
