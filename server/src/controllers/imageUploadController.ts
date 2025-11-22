import { Request, Response } from 'express';

export const uploadPaperOptionImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  // File is saved in 'uploads/paper-options/'
  const imageUrl = `/uploads/paper-options/${req.file.filename}`;
  res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};

export const uploadIdCardImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  const imageUrl = `/uploads/id-cards/${req.file.filename}`;
  res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};

export const uploadPaperContentImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  const imageUrl = `/uploads/paper-content/${req.file.filename}`;
  res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};

export const uploadExplanationImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No explanation image file provided.' });
  }

  const imageUrl = `/uploads/explanations/${req.file.filename}`;
  res.status(200).json({ 
    imageUrl, 
    message: 'Explanation image uploaded successfully.',
    filename: req.file.filename
  });
};
