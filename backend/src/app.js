const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Base route for server health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Compensation Intelligence API is online and healthy.",
    version: "1.0.0"
  });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Requested endpoint not found."
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred on the server.",
    error: err.message
  });
});

module.exports = app;
