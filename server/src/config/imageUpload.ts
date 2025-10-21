import multer from 'multer';
import path from 'path';
import fs from 'fs';

const paperOptionsDir = 'uploads/paper-options';

// Create the directory if it doesn't exist
if (!fs.existsSync(paperOptionsDir)) {
  fs.mkdirSync(paperOptionsDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, paperOptionsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, JPG, and WEBP image files are allowed!') as any, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});
