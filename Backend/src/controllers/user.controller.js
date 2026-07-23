const bcrypt = require("bcryptjs");
const pool = require("../config/database");

// GET /users  [admin only]
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, username, role, is_active, last_login_at, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get users error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /users  [admin only]
const createUser = async (req, res) => {
  const { name, username, password, role } = req.body;

  if (!name || !username || !password || !role) {
    return res.status(400).json({ message: "name, username, password, and role are required" });
  }

  const validRoles = ["admin", "maintenance", "operator"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "role must be admin, maintenance, or operator" });
  }

  try {
    // Check if username already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, username, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, username, role, is_active, created_at`,
      [name, username, password_hash, role]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create user error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /users/:id/deactivate  [admin only]
const deactivateUser = async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deactivating themselves
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: "You cannot deactivate your own account" });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET is_active = FALSE, updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, username, role, is_active`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Deactivate user error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /users/:id  [admin only]
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, role, is_active } = req.body;

  const validRoles = ["admin", "maintenance", "operator"];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ message: "role must be admin, maintenance, or operator" });
  }

  // Prevent admin from deactivating themselves
  if (parseInt(id) === req.user.id && is_active === false) {
    return res.status(400).json({ message: "You cannot deactivate your own account" });
  }

  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (name       !== undefined) { fields.push(`name = $${idx++}`);      values.push(name); }
    if (role       !== undefined) { fields.push(`role = $${idx++}`);      values.push(role); }
    if (is_active  !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, name, username, role, is_active, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Update user error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /users/:id/reset-password  [admin only]
const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { new_password } = req.body;

  if (!new_password || new_password.length < 6) {
    return res.status(400).json({ message: "new_password must be at least 6 characters" });
  }

  try {
    const password_hash = await bcrypt.hash(new_password, 10);

    const result = await pool.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
      [password_hash, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllUsers, createUser, deactivateUser, updateUser, resetPassword };