import { Router } from 'express'
import { BSON } from 'bson'
import { LIMIT_UPLOAD } from '../utils/constants.mjs';
import db from '../../db/conn.mjs'

import multer from 'multer'

const router = Router();

let newFileName = ""

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    console.log(file)
    const originalName = file.originalname.split('.')[0]
    const extension = file.mimetype.split('/').pop()
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    newFileName = `${originalName}-${uniqueSuffix}.${extension}`
    cb(null, newFileName)
  }
})
const upload = multer({ storage })

router.post('/api/upload', upload.single('photo'), async (req, res, next) => {
  console.log('///', req)
  res.json({path: newFileName}).status(201)
});

export default router