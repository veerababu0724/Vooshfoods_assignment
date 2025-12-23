import express from "express";
import cors from "cors";
import pkg from "pg";
import "dotenv/config";


const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


// Products list
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY product_id"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Metrics
app.get("/api/metrics", async (req, res) => {
  try {
    const total = await pool.query("SELECT COUNT(*) FROM products");
    const avg = await pool.query(
      "SELECT ROUND(AVG(price_usd),2) AS avg_price FROM products"
    );

    res.json({
      total_products: total.rows[0].count,
      avg_price_usd: avg.rows[0].avg_price
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pipeline status
app.get("/api/status", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT status, last_run_time, error_message
      FROM pipeline_status
      ORDER BY last_run_time DESC
      LIMIT 1
      `
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------- SERVER -------------------- */

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
