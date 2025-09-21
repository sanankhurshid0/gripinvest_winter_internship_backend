const express = require("express");
const { pool } = require("../config/database");
const { authenticateToken } = require("../middleware/auth");
const { validateInvestment } = require("../middleware/validation");

const router = express.Router();

// Create new investment
router.post("/", authenticateToken, validateInvestment, async (req, res) => {
  const { product_id, amount } = req.body;

  try {
    // Get product details
    const [products] = await pool.query(
      "SELECT * FROM investment_products WHERE id = ?",
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Investment product not found" });
    }

    const product = products[0];

    // Validate investment amount
    if (amount < product.min_investment) {
      return res.status(400).json({
        message: `Minimum investment amount is ₹${product.min_investment}`,
      });
    }

    if (product.max_investment && amount > product.max_investment) {
      return res.status(400).json({
        message: `Maximum investment amount is ₹${product.max_investment}`,
      });
    }

    // Calculate expected return and maturity date
    const expectedReturn =
      amount +
      (amount * product.annual_yield * product.tenure_months) / (100 * 12);
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + product.tenure_months);

    // Create investment
    const [result] = await pool.query(
      `INSERT INTO investments (user_id, product_id, amount, expected_return, maturity_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,
        product_id,
        amount,
        expectedReturn,
        maturityDate.toISOString().split("T")[0],
      ]
    );

    // Log transaction
    await pool.query(
      "INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, req.user.email, "/api/investments", "POST", 201]
    );

    res.status(201).json({
      message: "Investment created successfully",
      investment: {
        id: result.insertId,
        product_name: product.name,
        amount,
        expected_return: expectedReturn,
        maturity_date: maturityDate.toISOString().split("T")[0],
        annual_yield: product.annual_yield,
        tenure_months: product.tenure_months,
      },
    });
  } catch (error) {
    // Log error transaction
    await pool.query(
      "INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code, error_message) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.user.id,
        req.user.email,
        "/api/investments",
        "POST",
        500,
        error.message,
      ]
    );

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's investments
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [investments] = await pool.query(
      `SELECT i.*, p.name as product_name, p.investment_type, p.risk_level 
       FROM investments i 
       JOIN investment_products p ON i.product_id = p.id 
       WHERE i.user_id = ? 
       ORDER BY i.invested_at DESC`,
      [req.user.id]
    );

    // Calculate portfolio summary
    const totalInvested = investments.reduce(
      (sum, inv) => sum + parseFloat(inv.amount),
      0
    );
    const totalExpectedReturn = investments.reduce(
      (sum, inv) => sum + parseFloat(inv.expected_return),
      0
    );
    const activeInvestments = investments.filter(
      (inv) => inv.status === "active"
    ).length;

    res.json({
      investments,
      portfolio_summary: {
        total_invested: totalInvested,
        total_expected_return: totalExpectedReturn,
        total_gain: totalExpectedReturn - totalInvested,
        active_investments: activeInvestments,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific investment details
router.get("/:investmentId", authenticateToken, async (req, res) => {
  try {
    const { investmentId } = req.params;

    const [investments] = await pool.query(
      `SELECT i.*, p.name as product_name, p.investment_type, p.risk_level, p.description 
       FROM investments i 
       JOIN investment_products p ON i.product_id = p.id 
       WHERE i.id = ? AND i.user_id = ?`,
      [investmentId, req.user.id]
    );

    if (investments.length === 0) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.json({ investment: investments[0] });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel investment (if within 24 hours)
router.patch("/:investmentId/cancel", authenticateToken, async (req, res) => {
  try {
    const { investmentId } = req.params;

    const [investments] = await pool.query(
      "SELECT * FROM investments WHERE id = ? AND user_id = ?",
      [investmentId, req.user.id]
    );

    if (investments.length === 0) {
      return res.status(404).json({ message: "Investment not found" });
    }

    const investment = investments[0];

    // Check if investment can be cancelled (within 24 hours)
    const investmentTime = new Date(investment.invested_at);
    const currentTime = new Date();
    const hoursDifference = (currentTime - investmentTime) / (1000 * 60 * 60);

    if (hoursDifference > 24) {
      return res.status(400).json({
        message: "Investment can only be cancelled within 24 hours of creation",
      });
    }

    if (investment.status !== "active") {
      return res.status(400).json({
        message: "Only active investments can be cancelled",
      });
    }

    // Update investment status
    await pool.query("UPDATE investments SET status = ? WHERE id = ?", [
      "cancelled",
      investmentId,
    ]);

    res.json({ message: "Investment cancelled successfully" });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
