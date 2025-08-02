
import { Request, Response } from 'express';
import fs from 'fs';
import Video from '../models/Video';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const uploadVideo = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ message: 'Video file is required' });
  }

  try {
    const newVideo = await Video.create({ title, description, filePath });
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getVideo = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const user = await User.findById(req.user?.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role !== 'teacher' && !user.allowedVideos.includes(id as any)) {
            return res.status(403).json({ message: "You have to pay or come to physical class" });
        }

        const video = await Video.findById(id);
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const getVideoCount = async (req: Request, res: Response) => {
    try {
        const count = await Video.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const deleteVideo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Delete the video file from the uploads folder
        fs.unlinkSync(video.filePath);

        await Video.findByIdAndDelete(id);
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
