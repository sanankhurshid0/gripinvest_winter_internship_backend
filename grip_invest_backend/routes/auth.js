const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
const { validateSignup, validateLogin } = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Signup route
router.post("/signup", validateSignup, async (req, res) => {
  const { first_name, last_name, email, password, risk_appetite } = req.body;

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password_hash, risk_appetite) VALUES (?, ?, ?, ?, ?)",
      [
        first_name,
        last_name || "",
        email,
        password_hash,
        risk_appetite || "moderate",
      ]
    );

    // Log transaction
    await pool.query(
      "INSERT INTO transaction_logs (email, endpoint, http_method, status_code) VALUES (?, ?, ?, ?)",
      [email, "/api/auth/signup", "POST", 201]
    );

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    // Log error transaction
    await pool.query(
      "INSERT INTO transaction_logs (email, endpoint, http_method, status_code, error_message) VALUES (?, ?, ?, ?, ?)",
      [
        email,
        "/api/auth/signup",
        "POST",
        error.code === "ER_DUP_ENTRY" ? 409 : 500,
        error.message,
      ]
    );

    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "Email already exists" });
    } else {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      res.status(500).json({ message: "Server error" });
    }
  }
});

// Login route
router.post("/login", validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      await pool.query(
        "INSERT INTO transaction_logs (email, endpoint, http_method, status_code, error_message) VALUES (?, ?, ?, ?, ?)",
        [email, "/api/auth/login", "POST", 401, "User not found"]
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      await pool.query(
        "INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code, error_message) VALUES (?, ?, ?, ?, ?, ?)",
        [user.id, email, "/api/auth/login", "POST", 401, "Invalid password"]
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Log successful login
    await pool.query(
      "INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code) VALUES (?, ?, ?, ?, ?)",
      [user.id, email, "/api/auth/login", "POST", 200]
    );

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        risk_appetite: user.risk_appetite,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, first_name, last_name, email, risk_appetite, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
