import fs from 'fs';
import path from 'path';

const createUploadDirectories = () => {
  const directories = [
    'uploads',
    'uploads/id-cards',
    'uploads/paper-options',
    'uploads/profile-pictures'
  ];

  directories.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
  });
};

export default createUploadDirectories;