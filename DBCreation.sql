CREATE DATABASE schools_db;
USE schools_db 

CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  contact VARCHAR(20),
  image TEXT,
  email_id TEXT NOT NULL
);
