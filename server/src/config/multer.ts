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
    console.log('📁 [MULTER] Processing file upload:');
    console.log('  - fieldname:', file.fieldname);
    console.log('  - mimetype:', file.mimetype);
    console.log('  - originalname:', file.originalname);

    // Get uploadType from req.uploadType (set by route middleware)
    const uploadType = (req as any).uploadType || 'misc';
    console.log('  - uploadType from req:', uploadType);
    let subDir = '';

    switch (uploadType) {
      case 'mcq-question':
        subDir = 'papers/mcq/questions';
        break;
      case 'mcq-option':
        subDir = 'papers/mcq/options';
        break;
      case 'mcq-explanation':
        subDir = 'papers/mcq/explanations';
        break;
      case 'structure-question-paper':
        subDir = 'papers/structure-essay/question-papers';
        break;
      case 'structure-student-answer':
        subDir = 'papers/structure-essay/student-answers';
        break;
      case 'structure-teacher-review':
        subDir = 'papers/structure-essay/teacher-reviews';
        break;
      case 'paper-thumbnail':
        // Check paperType from form body to determine subfolder
        const paperType = (req as any).body?.paperType;
        if (paperType === 'MCQ') {
          subDir = 'papers/mcq/thumbnails';
        } else if (paperType === 'Structure-Essay') {
          subDir = 'papers/structure-essay/thumbnails';
        } else {
          subDir = 'papers/thumbnails'; // fallback
        }
        break;
      case 'id-card':
        subDir = 'id-cards';
        break;
      default:
        // Fallback: check fieldname
        if (file.fieldname === 'thumbnail') {
          // Check paperType to route to correct thumbnail folder
          const paperType = (req as any).body?.paperType;
          if (paperType === 'MCQ') {
            subDir = 'papers/mcq/thumbnails';
          } else if (paperType === 'Structure-Essay') {
            subDir = 'papers/structure-essay/thumbnails';
          } else {
            subDir = 'papers/thumbnails'; // fallback
          }
        } else if (file.fieldname === 'file' && file.mimetype === 'application/pdf') {
          // Default for question papers if no uploadType specified
          subDir = 'papers/structure-essay/question-papers';
        } else {
          subDir = 'misc';
        }
        break;
    }

    // Construct the full directory path
    const dir = path.join(UPLOAD_BASE_DIR, subDir);
    console.log('  - Calculated subDir:', subDir);
    console.log('  - Full directory path:', dir);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      console.log('  - Creating directory:', dir);
      fs.mkdirSync(dir, { recursive: true });
    } else {
      console.log('  - Directory already exists');
    }

    // Pass the destination directory to multer
    console.log('✅ [MULTER] File will be saved to:', dir);
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

