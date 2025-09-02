// lib/db.js
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
  host: 'localhost',
  user: 'dbusername',
  password: 'dbpassword',
  database: 'schools_db',
});
module.exports = connection;

