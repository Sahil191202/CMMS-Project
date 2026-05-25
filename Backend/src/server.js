const app = require("./app");
const pool = require("./config/database");

const PORT = process.env.PORT || 5000;

// Test DB connection before starting server
pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});