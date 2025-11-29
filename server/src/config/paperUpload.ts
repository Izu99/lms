import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const UPLOAD_DIR = 'uploads/papers';

// Ensure upload directories exist
const ensureDirectories = () => {
  const dirs = [
    path.join(UPLOAD_DIR, 'files'),
    path.join(UPLOAD_DIR, 'images')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectories();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subDir = '';
    if (file.fieldname === 'file') {
      subDir = 'files';
    } else if (file.fieldname === 'thumbnail') {
      subDir = 'images';
    } else {
      subDir = 'files';
    }

    const fullPath = path.join(UPLOAD_DIR, subDir);
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'file') {
    // PDF files for papers
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF allowed for papers'));
    }
  } else if (file.fieldname === 'thumbnail') {
    // Image files
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type'));
    }
  } else {
    cb(null, true);
  }
};

export const uploadPaper = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for papers
  }
});
