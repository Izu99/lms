import { Request, Response } from 'express';
import { Tute } from '../models/Tute';
import { User } from '../models/User';
import path from 'path';
import fs from 'fs/promises';

// Create a new tute
export const createTute = async (req: Request, res: Response) => {
  try {
    const { title, description, availability, price, institute, year, academicLevel } = req.body;
    const teacherId = (req as any).user?.id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainFile = files?.file ? files.file[0] : undefined;
    const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : undefined;

    console.log('Create Tute Request:', { title, teacherId, hasMainFile: !!mainFile, hasThumbnail: !!thumbnailFile });

    if (!teacherId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!mainFile) {
      return res.status(400).json({ message: 'Main file is required' });
    }

    // Determine file type for main file
    const fileExt = path.extname(mainFile.originalname).toLowerCase();
    let fileType: 'pdf' | 'pptx' | 'ppt' | 'image';

    if (fileExt === '.pdf') {
      fileType = 'pdf';
    } else if (fileExt === '.pptx') {
      fileType = 'pptx';
    } else if (fileExt === '.ppt') {
      fileType = 'ppt';
    } else if (['.jpeg', '.jpg', '.png', '.gif', '.webp'].includes(fileExt)) {
      fileType = 'image';
    } else {
      return res.status(400).json({ message: 'Invalid main file type. Only PDF, PowerPoint, and image files are allowed.' });
    }

    const fileUrl = `/${mainFile.path.replace(/\\/g, '/')}`;
    let thumbnailUrl = thumbnailFile ? `/${thumbnailFile.path.replace(/\\/g, '/')}` : undefined;

    // If the main file is an image and no specific thumbnail is set, use the main file for preview
    if (fileType === 'image' && !thumbnailUrl) {
      thumbnailUrl = fileUrl;
    }

    const tute = new Tute({
      title,
      description,
      teacherId,
      fileUrl,
      fileType,
      thumbnailUrl,
      availability: availability || 'all',
      price: price || 0,
      institute,
      year,
      academicLevel // Add academicLevel
    });

    await tute.save();
    console.log('Tute created successfully:', tute._id);
    res.status(201).json({ message: 'Tute created successfully', tute });
  } catch (error: any) {
    console.error('Error creating tute:', error);
    res.status(500).json({
      message: 'Failed to create tute',
      error: error.message
    });
  }
};

// Get all tutes for a teacher
// Get all tutes for a teacher
export const getTeacherTutes = async (req: Request, res: Response) => {
  try {
    const teacherId = (req as any).user.id;
    const { institute, year, academicLevel } = req.query;

    const filter: any = { teacherId };
    if (institute && institute !== 'all') filter.institute = institute;
    if (year && year !== 'all') filter.year = year;
    if (academicLevel && academicLevel !== 'all') filter.academicLevel = academicLevel;

    const tutes = await Tute.find(filter)
      .populate('institute', 'name location')
      .populate('year', 'year name')
      .sort({ createdAt: -1 });
    res.status(200).json(tutes);
  } catch (error) {
    console.error('Error fetching tutes:', error);
    res.status(500).json({ message: 'Failed to fetch tutes' });
  }
};

// Get a single tute by ID
export const getTuteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tute = await Tute.findById(id).populate('teacherId', 'firstName lastName');

    if (!tute) {
      return res.status(404).json({ message: 'Tute not found' });
    }

    res.status(200).json(tute);
  } catch (error) {
    console.error('Error fetching tute:', error);
    res.status(500).json({ message: 'Failed to fetch tute' });
  }
};

// Update a tute
export const updateTute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, availability, price, institute, year, academicLevel } = req.body;
    const teacherId = (req as any).user.id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainFile = files?.file ? files.file[0] : undefined;
    const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : undefined;

    const tute = await Tute.findOne({ _id: id, teacherId });

    if (!tute) {
      return res.status(404).json({ message: 'Tute not found or unauthorized' });
    }

    // Update fields
    if (title) tute.title = title;
    if (description !== undefined) tute.description = description;
    if (availability) tute.availability = availability;
    if (price !== undefined) tute.price = price;
    if (institute) tute.institute = institute;
    if (year) tute.year = year;
    if (academicLevel) tute.academicLevel = academicLevel; // Add academicLevel


    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // If new main file is uploaded, delete old file and update
    if (mainFile) {
      // Delete old main file
      if (tute.fileUrl) {
        try {
          const oldPath = new URL(tute.fileUrl).pathname;
          const oldFilePath = oldPath.substring(1);
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.error('Error deleting old main file:', err);
        }
      }

      // Update with new main file
      const fileExt = path.extname(mainFile.originalname).toLowerCase();
      let fileType: 'pdf' | 'pptx' | 'ppt' | 'image';

      if (fileExt === '.pdf') {
        fileType = 'pdf';
      } else if (fileExt === '.pptx') {
        fileType = 'pptx';
      } else if (fileExt === '.ppt') {
        fileType = 'ppt';
      } else if (['.jpeg', '.jpg', '.png', '.gif', '.webp'].includes(fileExt)) {
        fileType = 'image';
      } else {
        return res.status(400).json({ message: 'Invalid main file type' });
      }

      tute.fileUrl = `${baseUrl}/${mainFile.path.replace(/\\/g, '/')}`;
      tute.fileType = fileType;
    }

    // If new thumbnail image is uploaded, delete old and update
    if (thumbnailFile) {
      // Delete old thumbnail image if it exists
      if (tute.thumbnailUrl) {
        try {
          const oldThumbnailPath = new URL(tute.thumbnailUrl).pathname.substring(1);
          await fs.unlink(oldThumbnailPath);
        } catch (err) {
          console.error('Error deleting old thumbnail image:', err);
        }
      }
      // Update with new thumbnail image
      tute.thumbnailUrl = `${baseUrl}/${thumbnailFile.path.replace(/\\/g, '/')}`;
    }

    // If the main file is an image and no specific thumbnail is set, use the main file for preview
    if (tute.fileType === 'image' && !thumbnailFile) {
      tute.thumbnailUrl = tute.fileUrl;
    }

    await tute.save();
    res.status(200).json({ message: 'Tute updated successfully', tute });
  } catch (error) {
    console.error('Error updating tute:', error);
    res.status(500).json({ message: 'Failed to update tute' });
  }
};

// Delete a tute
export const deleteTute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = (req as any).user.id;

    const tute = await Tute.findOne({ _id: id, teacherId });

    if (!tute) {
      return res.status(404).json({ message: 'Tute not found or unauthorized' });
    }

    // Delete associated files
    if (tute.fileUrl) {
      try {
        const filePath = new URL(tute.fileUrl).pathname.substring(1);
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Error deleting main file ${tute.fileUrl}:`, err);
      }
    }
    if (tute.thumbnailUrl && tute.thumbnailUrl !== tute.fileUrl) {
      try {
        const thumbnailPath = new URL(tute.thumbnailUrl).pathname.substring(1);
        await fs.unlink(thumbnailPath);
      } catch (err) {
        console.error(`Error deleting thumbnail image ${tute.thumbnailUrl}:`, err);
      }
    }

    await Tute.findByIdAndDelete(id);
    res.status(200).json({ message: 'Tute deleted successfully' });
  } catch (error) {
    console.error('Error deleting tute:', error);
    res.status(500).json({ message: 'Failed to delete tute' });
  }
};

// Get tutes for students
export const getStudentTutes = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;

    // Get student info
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Filter based on student type
    const query: any = {};
    if (student.studentType === 'Physical') {
      // Physical students can access all tutes except paid ones (unless purchased, but logic here is for list)
      // Assuming 'paid' tutes shouldn't be in the free list or handled separately
      query.availability = { $in: ['all', 'physical'] };
    } else {
      // Online students can only access 'all' tutes
      query.availability = 'all';
    }

    const tutes = await Tute.find(query)
      .populate('teacherId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json(tutes);
  } catch (error) {
    console.error('Error fetching student tutes:', error);
    res.status(500).json({ message: 'Failed to fetch tutes' });
  }
};
