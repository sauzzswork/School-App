import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import connection from '../../lib/db';

const imageDir = './public/schoolImages';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: imageDir,
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
  try {
    console.log('POST body:', req.body);
    console.log('POST file:', req.file);
    const { name, address, city, state, contact, email_id } = req.body;
    const image = req.file ? `/schoolImages/${req.file.filename}` : null;
    
    if (!name || !email_id) {
      console.log('Missing name or email');
      return res.status(400).json({ error: 'Name and Email are required' });
    }
    
    const sql = 'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await connection.execute(sql, [name, address, city, state, contact, image, email_id]);
    
    res.status(201).json({ message: 'School added', id: result.insertId });
  } catch (error) {
    console.error('POST error:', error);
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

export default function handler(req, res) {
  return apiRoute.run(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
