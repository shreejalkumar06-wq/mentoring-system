import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("<YOUR-PASSWORD>") || process.env.DATABASE_URL.includes("[YOUR-PASSWORD]")) {
  console.error("Missing DATABASE_URL password. Replace <YOUR-PASSWORD> in .env with your Supabase database password.");
  process.exit(1);
}

const rootDir = process.cwd();
const schemaPath = path.join(rootDir, "supabase", "schema.sql");
const seedPath = path.join(rootDir, "supabase", "seed.sql");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

try {
  const schema = await fs.readFile(schemaPath, "utf8");
  const seed = await fs.readFile(seedPath, "utf8");

  await client.connect();
  await client.query(schema);
  await client.query(seed);
  console.log("Supabase schema and seed data applied successfully.");
} catch (error) {
  console.error("Failed to apply Supabase setup:", error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
