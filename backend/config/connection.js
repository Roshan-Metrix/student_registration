import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// ✅ Create a single pool instance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

// ✅ Test connection only once at startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connection Established");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
    process.exit(1);
  }
})();

export default pool;
