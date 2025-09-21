const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/database");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const investmentRoutes = require("./routes/investments");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (only in development)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/investments", investmentRoutes);

// Health check endpoint
app.get("/health", async (req, res) => {
  const dbStatus = await testConnection();
  res.status(dbStatus ? 200 : 500).json({
    status: dbStatus ? "ok" : "error",
    database: dbStatus ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Grip Invest Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      investments: "/api/investments",
      health: "/health",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Global error handler:", error);
  }
  res.status(500).json({
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("Failed to connect to database. Exiting...");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Grip Invest Backend running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
