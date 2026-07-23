const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes — added one by one as we build them
// app.use("/api/auth",       require("./routes/auth.routes"));
// app.use("/api/users",      require("./routes/user.routes"));
// app.use("/api/assets",     require("./routes/asset.routes"));
// app.use("/api/breakdown-types", require("./routes/breakdownType.routes"));
// app.use("/api/locations",  require("./routes/location.routes"));
// app.use("/api/tickets",    require("./routes/ticket.routes"));
// app.use("/api/dashboard",  require("./routes/dashboard.routes"));
// app.use("/api/reports",    require("./routes/report.routes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;