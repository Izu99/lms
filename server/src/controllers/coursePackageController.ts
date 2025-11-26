import { Request, Response } from 'express';
import { CoursePackage } from '../models/CoursePackage';
import { Video } from '../models/Video';
import { Paper } from '../models/Paper';
import { Tute } from '../models/Tute'; // Import Tute model
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

    // No specific filtering for students for now, show all packages
    // if (user.role === 'student') {
    //   query = {
    //     $or: [
    //       { availability: 'all' },
    //       { availability: 'physical', 'studentType': user.studentType },
    //       { institute: user.institute, year: user.year },
    //     ],
    //   };
    // }

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

    // Basic authorization for students (can be expanded)
    // const user = (req as any).user;
    // if (user.role === 'student') {
    //   const isAuthorized =
    //     coursePackage.freeForAllInstituteYear ||
    //     (coursePackage.freeForPhysicalStudents && user.studentType === 'Physical') ||
    //     (coursePackage.institute?.equals(user.institute) && coursePackage.year?.equals(user.year));

    //   if (!isAuthorized) {
    //     return res.status(403).json({ message: 'Not authorized to view this course package' });
    //   }
    // }

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

    if (!title || price === undefined || !Array.isArray(videos) || !Array.isArray(papers) || !Array.isArray(tutes) || !availability) {
      return res.status(400).json({ message: 'Title, price, videos (array), papers (array), tutes (array), and availability are required' });
    }

    // Validate video, paper, and tute IDs
    const existingVideos = await Video.find({ _id: { $in: videos } });
    if (existingVideos.length !== videos.length) {
      return res.status(400).json({ message: 'One or more video IDs are invalid' });
    }
    const existingPapers = await Paper.find({ _id: { $in: papers } });
    if (existingPapers.length !== papers.length) {
      return res.status(400).json({ message: 'One or more paper IDs are invalid' });
    }
    const existingTutes = await Tute.find({ _id: { $in: tutes } });
    if (existingTutes.length !== tutes.length) {
      return res.status(400).json({ message: 'One or more tute IDs are invalid' });
    }

    const createdBy = (req as any).user.id;

    const newCoursePackage = new CoursePackage({
      title,
      description,
      price,
      backgroundImage,
      videos,
      papers,
      tutes, // Include tutes
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

    await coursePackage.deleteOne();
    res.json({ message: 'Course package deleted successfully' });
  } catch (error) {
    console.error("Delete course package error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
