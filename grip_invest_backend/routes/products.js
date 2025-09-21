const express = require("express");
const { pool } = require("../config/database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get all investment products
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { risk_level, investment_type, sort_by = "annual_yield" } = req.query;

    let query = "SELECT * FROM investment_products WHERE 1=1";
    let params = [];

    if (risk_level) {
      query += " AND risk_level = ?";
      params.push(risk_level);
    }

    if (investment_type) {
      query += " AND investment_type = ?";
      params.push(investment_type);
    }

    // Add sorting
    const validSortFields = [
      "annual_yield",
      "tenure_months",
      "min_investment",
      "created_at",
    ];
    if (validSortFields.includes(sort_by)) {
      query += ` ORDER BY ${sort_by} DESC`;
    }

    const [products] = await pool.query(query, params);

    res.json({ products });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product details
router.get("/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const [products] = await pool.query(
      "SELECT * FROM investment_products WHERE id = ?",
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product: products[0] });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get recommended products based on user's risk appetite
router.get("/recommendations/for-me", authenticateToken, async (req, res) => {
  try {
    const [userRows] = await pool.query(
      "SELECT risk_appetite FROM users WHERE id = ?",
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRiskAppetite = userRows[0].risk_appetite;

    const [products] = await pool.query(
      "SELECT * FROM investment_products WHERE risk_level = ? ORDER BY annual_yield DESC LIMIT 5",
      [userRiskAppetite]
    );

    res.json({
      recommendations: products,
      risk_appetite: userRiskAppetite,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
