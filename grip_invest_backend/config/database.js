const mysql = require("mysql2/promise");

// MySQL pool configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Sana@2926",
  database: process.env.DB_NAME || "grip_mini_investment",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
};

module.exports = { pool, testConnection };
