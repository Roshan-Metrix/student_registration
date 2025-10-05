import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASS ,
  database: process.env.DB_NAME ,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // number of concurrent connections allowed
  queueLimit: 0, // unlimited queued requests
  multipleStatements: true,
});

// Function to get a database connection
const createDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connection Established');
    connection.release(); // release back to pool
    return pool;
  } catch (error) {
    console.error('❌ MySQL Connection Failed:', error.message);
    process.exit(1); // stop app if DB connection fails
  }
};

// Immediately test and confirm DB connection
createDB();

export default createDB;
