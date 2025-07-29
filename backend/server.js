const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./src/routes/auth");

const app = express();

// Get HOST and PORT from .env or default values
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Enable CORS for local frontend and local network access
app.use(
  cors({
    origin: [
      "http://localhost:5173",        // local dev frontend
      "http://192.168.0.8:5173",      // your LAN IP (adjust as needed)
    ],
    credentials: true,
  })
);

app.use(helmet());

// Add COOP and COEP headers to fix window.postMessage and window.closed issues
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server on local network
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
