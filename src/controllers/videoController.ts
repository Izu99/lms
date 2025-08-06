import { Request, Response } from 'express';
import { Video } from '../models/Video';
import fs from 'fs';
import path from 'path';

// Get all videos
export const getAllVideos = async (req: Request, res: Response) => {
  const videos = await Video.find().populate('uploadedBy', 'username role');
  res.json({ videos });
};

// Upload new video
export const uploadVideo = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const videoFile = req.file;
  if (!videoFile) return res.status(400).json({ message: 'No video file uploaded' });

  const newVideo = new Video({
    title,
    description,
    videoUrl: videoFile.path,
    uploadedBy: req.user!._id,
  });

  await newVideo.save();
  res.status(201).json({ message: 'Video uploaded', video: newVideo });
};

// Update video
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const update: any = {};
    // Provide default empty object if req.body is undefined
    const { title, description } = req.body || {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;

    // Handle new file if uploaded
    if (req.file) {
      const prev = await Video.findById(req.params.id);
      if (prev && prev.videoUrl) {
        try {
          // Remove old file
          fs.unlinkSync(path.join(__dirname, '../../', prev.videoUrl));
        } catch (e) { /* ignore */ }
      }
      update.videoUrl = req.file.path;
    }

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video updated', video });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};


// Delete video
export const deleteVideo = async (req: Request, res: Response) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  await video.deleteOne();
  res.json({ message: 'Video deleted' });
};

// Get single video (optional, for detail views)
export const getVideoById = async (req: Request, res: Response) => {
  const video = await Video.findById(req.params.id).populate('uploadedBy', 'username role');
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.json({ video });
};
