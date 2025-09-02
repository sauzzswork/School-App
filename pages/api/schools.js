/* eslint-disable @typescript-eslint/no-require-imports */
import connection from '../../lib/db';
import ncModule from 'next-connect';
const nc = ncModule.default || ncModule;
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const imageDir = '/tmp/schoolImages';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: imageDir,
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  }),
});

const apiRoute = nc({
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
  if (!name || !email_id) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }
  // Since /tmp folder is not publicly accessible, store the filename or consider external storage
  const image = req.file ? req.file.filename : null;
  try {
    const sql =
      'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
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
    bodyParser: false,
  },
};
