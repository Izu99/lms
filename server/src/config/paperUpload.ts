import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const UPLOAD_DIR = 'uploads/papers';

// Ensure upload directories exist
const ensureDirectories = () => {
  const dirs = [
    // MCQ Folders
    path.join(UPLOAD_DIR, 'mcq/thumbnails'),
    path.join(UPLOAD_DIR, 'mcq/questions'),
    path.join(UPLOAD_DIR, 'mcq/options'),
    path.join(UPLOAD_DIR, 'mcq/explanations'),
    path.join(UPLOAD_DIR, 'mcq/content'), // For general content images if needed

    // Structure-Essay Folders
    path.join(UPLOAD_DIR, 'structure-essay/thumbnails'),
    path.join(UPLOAD_DIR, 'structure-essay/questions'),
    path.join(UPLOAD_DIR, 'structure-essay/answers'),
    path.join(UPLOAD_DIR, 'structure-essay/reviews')
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
    const uploadType = req.body.uploadType;
    const paperType = req.body.paperType; // 'MCQ' or 'Structure-Essay'

    if (file.fieldname === 'thumbnail') {
      if (paperType === 'Structure-Essay') {
        subDir = 'structure-essay/thumbnails';
      } else {
        // Default to MCQ if not specified or explicitly MCQ
        subDir = 'mcq/thumbnails';
      }
    } else if (uploadType === 'structure-essay-question') {
      subDir = 'structure-essay/questions';
    } else if (uploadType === 'student-answer') {
      subDir = 'structure-essay/answers';
    } else if (uploadType === 'teacher-review') {
      subDir = 'structure-essay/reviews';
    } else {
      // Fallback logic
      if (file.mimetype === 'application/pdf') {
        // If it's a PDF and we don't know the type, assume it's a structure essay question paper
        // or we could error out. But for now, let's put it in structure-essay/questions
        // as MCQ papers don't usually have PDFs.
        subDir = 'structure-essay/questions';
      } else {
        // Images fallback to MCQ thumbnails or content?
        // Let's default to mcq/thumbnails to be safe
        subDir = 'mcq/thumbnails';
      }
    }

    const fullPath = path.join(UPLOAD_DIR, subDir);
    // Ensure directory exists just in case
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Sanitize original name: remove spaces and special chars
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    const uploadType = req.body.uploadType || 'file';

    cb(null, `${uploadType}-${uniqueSuffix}-${sanitizedOriginalName}`);
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
