const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

let poolInstance = null;

function getPool() {
  if (poolInstance) {
    return poolInstance;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Please configure backend/.env"
    );
  }

  poolInstance = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.PGSSLMODE === "require"
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
  });

  return poolInstance;
}

async function query(text, params = []) {
  const pool = getPool();
  return pool.query(text, params);
}

async function testConnection() {
  const result = await query("SELECT PostGIS_Full_Version() AS version");
  return result.rows[0].version;
}

module.exports = {
  getPool,
  query,
  testConnection,
};
