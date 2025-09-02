/* eslint-disable @typescript-eslint/no-require-imports */
// pages/api/schools.js
import connection from '../../lib/db';
import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';

// Set up multer storage (for saving images)
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/schoolImages',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('image'));

apiRoute.post(async (req, res) => {
  const { name, address, city, state, contact, email_id } = req.body;
  const image = req.file ? `/schoolImages/${req.file.filename}` : null;

  if (!name || !email_id) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  const sql = 'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    const [result] = await connection.execute(sql, [name, address, city, state, contact, image, email_id]);
    res.status(201).json({ message: 'School added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRoute.get(async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT id, name, address, city, image FROM schools');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // required for multer
  },
};

