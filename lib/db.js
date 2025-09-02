import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.DB_HOST,      // Or 'localhost' if only local
  user: process.env.DB_USER,      // matches Vercel key
  password: process.env.DB_PASSWORD, // matches Vercel key
  database: process.env.DB_NAME,  // matches Vercel key
});
module.exports = connection;
