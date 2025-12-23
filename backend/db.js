import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

// Detect Render Postgres
const isRenderDB = process.env.DATABASE_URL.includes("render.com");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRenderDB
    ? { rejectUnauthorized: false }
    : false
});
