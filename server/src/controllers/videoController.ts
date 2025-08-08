import { Request, Response } from 'express';
import { Video } from '../models/Video';
import fs from 'fs';
import path from 'path';

// Get all videos
export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Video.find()
      .populate('uploadedBy', 'username role')
      .populate('class', 'name location')
      .populate('year', 'year name');
    res.json({ videos });
  } catch (error) {
    console.error("Get all videos error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload new video
export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { title, description, class: classId, year: yearId } = req.body;
    const videoFile = req.file;
    
    if (!videoFile) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }
    
    if (!title || !classId || !yearId) {
      return res.status(400).json({ message: 'Title, class, and year are required' });
    }

    // Use req.user._id instead of (req as any).userId
    const userId = (req as any).user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication failed - no user ID' });
    }

    const newVideo = new Video({
      title,
      description,
      videoUrl: videoFile.path,
      uploadedBy: userId,  // This will now work
      class: classId,
      year: yearId,
    });

    await newVideo.save();
    await newVideo.populate('uploadedBy', 'username role');
    await newVideo.populate('class', 'name location');
    await newVideo.populate('year', 'year name');
    
    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error("Upload video error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update video
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const update: any = {};
    const { title, description, class: classId, year: yearId } = req.body || {};
    
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (classId !== undefined) update.class = classId;
    if (yearId !== undefined) update.year = yearId;

    // Handle new file if uploaded
    if (req.file) {
      const prev = await Video.findById(req.params.id);
      if (prev && prev.videoUrl) {
        try {
          fs.unlinkSync(path.join(__dirname, '../../', prev.videoUrl));
        } catch (e) { 
          console.log("Old file not found, continuing..."); 
        }
      }
      update.videoUrl = req.file.path;
    }

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    )
      .populate('uploadedBy', 'username role')
      .populate('class', 'name location')
      .populate('year', 'year name');
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json({ message: 'Video updated successfully', video });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete video
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete file from filesystem
    if (video.videoUrl) {
      try {
        fs.unlinkSync(path.join(__dirname, '../../', video.videoUrl));
      } catch (e) {
        console.log("File not found, continuing with deletion...");
      }
    }

    await video.deleteOne();
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single video
export const getVideoById = async (req: Request, res: Response) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploadedBy', 'username role')
      .populate('class', 'name location')
      .populate('year', 'year name');
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ video });
  } catch (error) {
    console.error("Get video by ID error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
