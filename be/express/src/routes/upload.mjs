import { Router } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the root directory
const rootPath = path.join(__dirname, '../../'); // Navigate to the root directory

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const subpath = req.query?.subpath || '';
      const uploadPath = path.join(rootPath, `uploads${subpath}`);
      
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure all subdirectories are created
      }

      cb(null, uploadPath); // Save files to the determined upload path
    } catch (error) {
      cb(new Error(`Failed to create upload directory: ${error.message}`)); // Pass the error to multer
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Generate unique filenames
  },
});

const upload = multer({ storage })

router.post('/api/upload', upload.single('image'), async (req, res, next) => {
  try {
    const file = req.file;
    const subpath = `${req.query?.subpath}/` || ''

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate the file URL (adjust based on your hosting setup)
    const imageUrl = `/uploads/${subpath}${file.filename}`;

    res.json({ message: 'Image uploaded successfully', imageUrl });
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
