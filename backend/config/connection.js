import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const createDB = async () => mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements : true
});

createDB().then(connection => {
  if (global.connection = connection) {
  console.log('✅ Connected to MySQL');
  }else{
  console.log('❌ MySQL Connection Error');
  }
});

export default createDB;