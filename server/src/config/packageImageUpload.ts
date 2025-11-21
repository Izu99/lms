import multer from "multer";
import path from "path";
import fs from "fs";

const packageImageDir = "uploads/packages";

// Ensure the directory exists
if (!fs.existsSync(packageImageDir)) {
  fs.mkdirSync(packageImageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, packageImageDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadPackageImage = multer({ storage });
