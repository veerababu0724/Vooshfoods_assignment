import fetch from "node-fetch";
import { pool } from "./db.js";
import { initTables } from "./initTables.js";
import "dotenv/config";


const API_URL = "https://fakestoreapi.com/products";

async function logError(message) {
  await pool.query(
    "INSERT INTO error_logs (error_message) VALUES ($1)",
    [message]
  );
}

async function updatePipelineStatus(status, errorMessage = null) {
  await pool.query(
    `
    INSERT INTO pipeline_status (last_run_time, status, error_message)
    VALUES (NOW(), $1, $2)
    `,
    [status, errorMessage]
  );
}

async function runPipeline() {
  try {
    // 1️⃣ Ensure tables exist
    await initTables();

    // 2️⃣ Fetch data
    const response = await fetch(API_URL, { timeout: 5000 });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // 3️⃣ Transform
    const products = data.map(p => ({
      id: p.id,
      title: p.title.trim(),
      category: p.category.toLowerCase(),
      price_usd: p.price,
      price_inr: Number((p.price * 83).toFixed(2)),
      rating: p.rating?.rate ?? null,
      rating_count: p.rating?.count ?? 0,
      image_url: p.image
    }));

    // 4️⃣ Store (UPSERT)
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const p of products) {
        await client.query(
          `
          INSERT INTO products (
            product_id, title, category, price_usd, price_inr,
            rating, rating_count, image_url, updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
          ON CONFLICT (product_id)
          DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            price_usd = EXCLUDED.price_usd,
            price_inr = EXCLUDED.price_inr,
            rating = EXCLUDED.rating,
            rating_count = EXCLUDED.rating_count,
            image_url = EXCLUDED.image_url,
            updated_at = NOW();
          `,
          [
            p.id,
            p.title,
            p.category,
            p.price_usd,
            p.price_inr,
            p.rating,
            p.rating_count,
            p.image_url
          ]
        );
      }

      await client.query("COMMIT");
    } catch (dbErr) {
      await client.query("ROLLBACK");
      throw dbErr;
    } finally {
      client.release();
    }

    // 5️⃣ Mark success
    await updatePipelineStatus("OK");
    console.log("✅ Pipeline finished successfully");

  } catch (err) {
    console.error("❌ Pipeline failed:", err.message);
    await logError(err.message);
    await updatePipelineStatus("FAILED", err.message);
  } finally {
    await pool.end();
  }
}

runPipeline();
