import { Router } from 'express'
import { BSON } from 'bson'
import { LIMIT_UPLOAD } from '../utils/constants.mjs';
import db from '../../db/conn.mjs'

import multer from 'multer'
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// let newFileName = ""

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the root directory
const rootPath = path.join(__dirname, '../../'); // Navigate to the root directory

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(rootPath, 'uploads');
    cb(null, uploadPath); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Generate unique filenames
  },
});

const upload = multer({ storage })

router.post('/api/upload', upload.single('photo'), async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate the file URL (adjust based on your hosting setup)
    const avatarUrl = `/uploads/${file.filename}`;

    res.json({ message: 'Avatar uploaded successfully', avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

router.get('/api/uploads/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);

  // Send the file if it exists, otherwise send a 404 error
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// Serve static files from the "uploads" folder
// router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

export default router
