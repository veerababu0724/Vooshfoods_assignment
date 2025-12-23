import { pool } from "./db.js";

export async function initTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      price_usd NUMERIC,
      price_inr NUMERIC,
      rating NUMERIC,
      rating_count INTEGER,
      image_url TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pipeline_status (
      id SERIAL PRIMARY KEY,
      last_run_time TIMESTAMP,
      status TEXT,
      error_message TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS error_logs (
      id SERIAL PRIMARY KEY,
      error_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Tables initialized");
}
