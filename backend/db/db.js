const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    port: process.env.PG_PORT,
    password: process.env.PG_PASS,
    database: process.env.PG_DATABASE
});

(async () => {
  try {
    console.log("Database connected ✅");
  } catch (err) {
    console.error("Database connection failed ❌", err);
    process.exit(1);
  }
})();

module.exports = { pool };