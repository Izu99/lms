import { Request, Response } from 'express';
import { CoursePackage } from '../models/CoursePackage';
import { Video } from '../models/Video';
import { Paper } from '../models/Paper';
import { Tute } from '../models/Tute'; // Import Tute model
import { Payment } from '../models/Payment'; // Import Payment model
import { Types } from 'mongoose';

// Helper function to populate common fields
const populateCoursePackage = (query: any) => {
  return query
    .populate('videos', 'title description')
    .populate('papers', 'title description')
    .populate('tutes', 'title description')
    .populate('institute', 'name')
    .populate('year', 'name')
    .populate('createdBy', 'username');
};

// @desc    Get all course packages
// @route   GET /api/course-packages
// @access  Private (Teachers and Students)
export const getCoursePackages = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { institute, year, academicLevel } = req.query;
    let query: any = {};

    if (institute && institute !== 'all') query.institute = institute;
    if (year && year !== 'all') query.year = year;
    if (academicLevel && academicLevel !== 'all') query.academicLevel = academicLevel;

    const coursePackages = await populateCoursePackage(CoursePackage.find(query)).sort({ createdAt: -1 });
    res.json({ coursePackages });
  } catch (error) {
    console.error("Get course packages error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single course package by ID
// @route   GET /api/course-packages/:id
// @access  Private (Teachers and Students)
export const getCoursePackageById = async (req: Request, res: Response) => {
  try {
    const coursePackage = await populateCoursePackage(CoursePackage.findById(req.params.id));

    if (!coursePackage) {
      return res.status(404).json({ message: 'Course package not found' });
    }

    const requestingUser = (req as any).user;

    // If user is not a student, or is a teacher/admin, grant full access
    if (!requestingUser || requestingUser.role !== 'student') {
      return res.json({ coursePackage });
    }

    // Access control logic for students
    const studentType = requestingUser.studentType;

    let hasAccess = false;
    let paymentRequired = false;

    if (coursePackage.availability === 'all') {
      hasAccess = true;
    } else if (coursePackage.availability === 'physical' && studentType === 'Physical') {
      hasAccess = true;
    } else if (coursePackage.price && coursePackage.price > 0) {
      paymentRequired = true;
    } else {
      hasAccess = true;
    }

    if (paymentRequired) {
      // Check if user has already paid
      const payment = await Payment.findOne({
        userId: requestingUser.id,
        itemId: coursePackage._id,
        status: 'PAID'
      });

      if (payment) {
        hasAccess = true;
        paymentRequired = false;
      } else {
        return res.status(402).json({
          message: 'Payment required to access this course package.',
          price: coursePackage.price,
          title: coursePackage.title,
          itemId: coursePackage._id,
          itemModel: 'CoursePackage',
          currency: 'LKR'
        });
      }
    }

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied to this course package.' });
    }

    res.json({ coursePackage });
  } catch (error) {
    console.error("Get course package by ID error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a course package
// @route   POST /api/course-packages
// @access  Private (Teachers only)
export const createCoursePackage = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      videos,
      papers,
      tutes, // Add tutes
      availability,
      institute,
      year,
      academicLevel, // Add academicLevel
    } = req.body;

    const backgroundImage = req.file ? req.file.path : undefined;

    // Basic validation: title, price, availability required
    if (!title || price === undefined || !availability) {
      return res.status(400).json({ message: 'Title, price, and availability are required' });
    }

    // Ensure arrays are provided (can be empty)
    const videosList = Array.isArray(videos) ? videos : [];
    const papersList = Array.isArray(papers) ? papers : [];
    const tutesList = Array.isArray(tutes) ? tutes : [];

    // At least ONE of videos, papers, or tutes must be provided
    if (videosList.length === 0 && papersList.length === 0 && tutesList.length === 0) {
      return res.status(400).json({ message: 'Please select at least one item: video, paper, or tute (not all required)' });
    }

    // Validate video IDs if provided
    if (videosList.length > 0) {
      const existingVideos = await Video.find({ _id: { $in: videosList } });
      if (existingVideos.length !== videosList.length) {
        return res.status(400).json({ message: 'One or more video IDs are invalid' });
      }
    }

    // Validate paper IDs if provided
    if (papersList.length > 0) {
      const existingPapers = await Paper.find({ _id: { $in: papersList } });
      if (existingPapers.length !== papersList.length) {
        return res.status(400).json({ message: 'One or more paper IDs are invalid' });
      }
    }

    // Validate tute IDs if provided
    if (tutesList.length > 0) {
      const existingTutes = await Tute.find({ _id: { $in: tutesList } });
      if (existingTutes.length !== tutesList.length) {
        return res.status(400).json({ message: 'One or more tute IDs are invalid' });
      }
    }

    const createdBy = (req as any).user.id;

    const newCoursePackage = new CoursePackage({
      title,
      description,
      price,
      backgroundImage,
      videos: videosList,
      papers: papersList,
      tutes: tutesList, // Include tutes
      availability,
      institute: institute || undefined,
      year: year || undefined,
      academicLevel: academicLevel || undefined, // Add academicLevel
      createdBy,
    });

    await newCoursePackage.save();
    const populatedPackage = await populateCoursePackage(CoursePackage.findById(newCoursePackage._id));
    res.status(201).json({ message: 'Course package created successfully', coursePackage: populatedPackage });
  } catch (error) {
    console.error("Create course package error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a course package
// @route   PUT /api/course-packages/:id
// @access  Private (Teachers only)
export const updateCoursePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      videos,
      papers,
      tutes, // Add tutes
      availability,
      institute,
      year,
      academicLevel, // Add academicLevel
    } = req.body;

    const backgroundImage = req.file ? req.file.path : undefined;

    const coursePackage = await CoursePackage.findById(id);

    if (!coursePackage) {
      return res.status(404).json({ message: 'Course package not found' });
    }

    // Basic authorization: Only creator or admin can update
    const user = (req as any).user;
    if (coursePackage.createdBy.toString() !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course package' });
    }

    // Validate video, paper, and tute IDs if provided
    if (videos) {
      const existingVideos = await Video.find({ _id: { $in: videos } });
      if (existingVideos.length !== videos.length) {
        return res.status(400).json({ message: 'One or more video IDs are invalid' });
      }
    }
    if (papers) {
      const existingPapers = await Paper.find({ _id: { $in: papers } });
      if (existingPapers.length !== papers.length) {
        return res.status(400).json({ message: 'One or more paper IDs are invalid' });
      }
    }
    if (tutes) { // Validate tute IDs if provided
      const existingTutes = await Tute.find({ _id: { $in: tutes } });
      if (existingTutes.length !== tutes.length) {
        return res.status(400).json({ message: 'One or more tute IDs are invalid' });
      }
    }

    coursePackage.title = title || coursePackage.title;
    coursePackage.description = description || coursePackage.description;
    coursePackage.price = price !== undefined ? price : coursePackage.price;
    if (backgroundImage) {
      coursePackage.backgroundImage = backgroundImage;
    }
    coursePackage.videos = videos || coursePackage.videos;
    coursePackage.papers = papers || coursePackage.papers;
    coursePackage.tutes = tutes || coursePackage.tutes; // Update tutes
    coursePackage.availability = availability || coursePackage.availability;
    coursePackage.institute = institute || undefined;
    coursePackage.year = year || undefined;
    coursePackage.academicLevel = academicLevel || undefined; // Add academicLevel

    await coursePackage.save();
    const populatedPackage = await populateCoursePackage(CoursePackage.findById(coursePackage._id));
    res.json({ message: 'Course package updated successfully', coursePackage: populatedPackage });
  } catch (error) {
    console.error("Update course package error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a course package
// @route   DELETE /api/course-packages/:id
// @access  Private (Teachers only)
export const deleteCoursePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coursePackage = await CoursePackage.findById(id);

    if (!coursePackage) {
      return res.status(404).json({ message: 'Course package not found' });
    }

    // Basic authorization: Only creator or admin can delete
    const user = (req as any).user;
    if (coursePackage.createdBy.toString() !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course package' });
    }

    // Delete background image from filesystem
    if (coursePackage.backgroundImage) {
      try {
        const fs = require('fs');
        const path = require('path');
        // Extract filename from path if it's a full path
        const imageFilename = coursePackage.backgroundImage.includes('/')
          ? coursePackage.backgroundImage.split('/').pop()
          : coursePackage.backgroundImage;
        fs.unlinkSync(path.join(__dirname, '../../', 'uploads/packages/images', imageFilename!));
      } catch (e) {
        console.log("Background image not found, continuing with deletion...");
      }
    }

    await coursePackage.deleteOne();
    res.json({ message: 'Course package deleted successfully' });
  } catch (error) {
    console.error("Delete course package error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
