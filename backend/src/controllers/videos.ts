import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Video from '../models/Video';

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const filePath = req.file?.path;

    console.log('🔥 Uploading video with:');
    console.log('  Title:', title);
    console.log('  Desc:', description);
    console.log('  FilePath:', filePath);

    const newVideo = await Video.create({ title, description, filePath });
    console.log('✅ Video created:', newVideo);

    return res.status(201).json(newVideo);

  } catch (error: any) {
    console.error('❌ uploadVideo error:', error);
    return res.status(500).json({
      message: error.message || 'Something went wrong while uploading video',
    });
  }
};
