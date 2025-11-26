import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Define the base directory for all uploads
const UPLOAD_BASE_DIR = 'uploads';

const storage = multer.diskStorage({
  /**
   * Dynamically determines the destination directory based on the 'uploadType'
   * field in the request body. This centralizes file upload logic.
   *
   * Expected 'uploadType' values:
   * - 'paper': For the main paper file (e.g., a PDF for a Structure and Essay paper).
   * - 'question': For images associated with a question.
   * - 'option': For images associated with an answer option (MCQ).
   * - 'explanation': For images associated with an explanation.
   * - 'id-card': For ID card images.
   */
  destination: (req, file, cb) => {
    // Attempt to get uploadType from query string first, then from body, default to 'misc'
    const uploadType = (req as any).uploadType || 'misc';
    let subDir = '';
    switch (uploadType) {
      case 'paper':
        subDir = 'paper';
        break;
      case 'question':
        subDir = 'paper/questions';
        break;
      case 'option':
        subDir = 'paper/answers'; // Mapping 'option' to 'answers'
        break;
      case 'explanation':
        subDir = 'paper/explanations';
        break;
      case 'id-card':
        subDir = 'id-cards';
        break;
      case 'paper-preview': // New case for paper preview images
        subDir = 'paper/previews';
        break;
      default:
        // Fallback for unknown types to a generic 'misc' folder
        subDir = 'misc';
        break;
    }

    // Construct the full directory path
    const dir = path.join(UPLOAD_BASE_DIR, subDir);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Pass the destination directory to multer
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generate a unique, secure filename using timestamp + random hash
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const ext = path.extname(sanitizedName);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// File filter for security - allow images and PDFs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf'  // Allow PDFs for Structure-Essay papers
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP images and PDF files are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

// Separate upload instance for PDFs (papers, documents)
const pdfFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['application/pdf'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'));
  }
};

export const uploadPdf = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for PDFs
  }
});

