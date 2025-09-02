import { nextConnect } from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import connection from '../../lib/db';

// Ensure image directory exists
const imageDir = '/tmp/schoolImages';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: imageDir,
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
    }
  },
});

// Create API route with error handling
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Apply multer middleware
apiRoute.use(upload.single('image'));

// POST: Add a new school
apiRoute.post(async (req, res) => {
  const { name, address, city, state, contact, email_id } = req.body;
  if (!name || !email_id) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  const image = req.file ? req.file.filename : null;

  try {
    const sql =
      'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await connection.execute(sql, [
      name,
      address,
      city,
      state,
      contact,
      image,
      email_id,
    ]);
    res.status(201).json({ message: 'School added', id: result.insertId, image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all schools
apiRoute.get(async (req, res) => {
  try {
    const [rows] = await connection.execute(
      'SELECT id, name, address, city, image FROM schools'
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Required for multer
  },
};
