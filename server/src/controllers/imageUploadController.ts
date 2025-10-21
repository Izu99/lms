import { Request, Response } from 'express';

export const uploadPaperOptionImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  // Assuming the file is saved in 'uploads/paper-options/'
  const imageUrl = `/uploads/paper-options/${req.file.filename}`;
  res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};
