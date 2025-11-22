import fs from 'fs';
import path from 'path';

const UPLOADS_BASE_DIR = path.join(__dirname, '../../uploads');

export const deleteFile = async (filePath: string): Promise<void> => {
  if (!filePath) {
    return;
  }

  // Ensure the path is relative and within the uploads directory to prevent directory traversal
  const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  const absolutePath = path.join(UPLOADS_BASE_DIR, relativePath);

  // Basic security check to ensure we are deleting within the intended directory
  if (!absolutePath.startsWith(UPLOADS_BASE_DIR)) {
    console.error(`Attempt to delete file outside of uploads directory: ${absolutePath}`);
    return;
  }

  try {
    // Check if file exists before attempting to delete
    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
      console.log(`Successfully deleted file: ${absolutePath}`);
    } else {
      console.warn(`File not found, skipping deletion: ${absolutePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${absolutePath}:`, error);
  }
};
