"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoursePackage = exports.updateCoursePackage = exports.createCoursePackage = exports.getCoursePackageById = exports.getCoursePackages = void 0;
const CoursePackage_1 = require("../models/CoursePackage");
const Video_1 = require("../models/Video");
const Paper_1 = require("../models/Paper");
// Helper function to populate common fields
const populateCoursePackage = (query) => {
    return query
        .populate('videos', 'title description')
        .populate('papers', 'title description')
        .populate('institute', 'name')
        .populate('year', 'name')
        .populate('createdBy', 'username');
};
// @desc    Get all course packages
// @route   GET /api/course-packages
// @access  Private (Teachers and Students)
const getCoursePackages = async (req, res) => {
    try {
        const user = req.user;
        let query = {};
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
        const coursePackages = await populateCoursePackage(CoursePackage_1.CoursePackage.find(query)).sort({ createdAt: -1 });
        res.json({ coursePackages });
    }
    catch (error) {
        console.error("Get course packages error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCoursePackages = getCoursePackages;
// @desc    Get single course package by ID
// @route   GET /api/course-packages/:id
// @access  Private (Teachers and Students)
const getCoursePackageById = async (req, res) => {
    try {
        const coursePackage = await populateCoursePackage(CoursePackage_1.CoursePackage.findById(req.params.id));
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
    }
    catch (error) {
        console.error("Get course package by ID error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCoursePackageById = getCoursePackageById;
// @desc    Create a course package
// @route   POST /api/course-packages
// @access  Private (Teachers only)
const createCoursePackage = async (req, res) => {
    try {
        const { title, description, price, videos, papers, availability, institute, year, } = req.body;
        const backgroundImage = req.file ? req.file.path : undefined;
        if (!title || price === undefined || !Array.isArray(videos) || !Array.isArray(papers) || !availability) {
            return res.status(400).json({ message: 'Title, price, videos (array), papers (array), and availability are required' });
        }
        // Validate video and paper IDs
        const existingVideos = await Video_1.Video.find({ _id: { $in: videos } });
        if (existingVideos.length !== videos.length) {
            return res.status(400).json({ message: 'One or more video IDs are invalid' });
        }
        const existingPapers = await Paper_1.Paper.find({ _id: { $in: papers } });
        if (existingPapers.length !== papers.length) {
            return res.status(400).json({ message: 'One or more paper IDs are invalid' });
        }
        const createdBy = req.user.id;
        const newCoursePackage = new CoursePackage_1.CoursePackage({
            title,
            description,
            price,
            backgroundImage,
            videos,
            papers,
            availability,
            institute: institute || undefined,
            year: year || undefined,
            createdBy,
        });
        await newCoursePackage.save();
        const populatedPackage = await populateCoursePackage(CoursePackage_1.CoursePackage.findById(newCoursePackage._id));
        res.status(201).json({ message: 'Course package created successfully', coursePackage: populatedPackage });
    }
    catch (error) {
        console.error("Create course package error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createCoursePackage = createCoursePackage;
// @desc    Update a course package
// @route   PUT /api/course-packages/:id
// @access  Private (Teachers only)
const updateCoursePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, videos, papers, availability, institute, year, } = req.body;
        const backgroundImage = req.file ? req.file.path : undefined;
        const coursePackage = await CoursePackage_1.CoursePackage.findById(id);
        if (!coursePackage) {
            return res.status(404).json({ message: 'Course package not found' });
        }
        // Basic authorization: Only creator or admin can update
        const user = req.user;
        if (coursePackage.createdBy.toString() !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this course package' });
        }
        // Validate video and paper IDs if provided
        if (videos) {
            const existingVideos = await Video_1.Video.find({ _id: { $in: videos } });
            if (existingVideos.length !== videos.length) {
                return res.status(400).json({ message: 'One or more video IDs are invalid' });
            }
        }
        if (papers) {
            const existingPapers = await Paper_1.Paper.find({ _id: { $in: papers } });
            if (existingPapers.length !== papers.length) {
                return res.status(400).json({ message: 'One or more paper IDs are invalid' });
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
        coursePackage.availability = availability || coursePackage.availability;
        coursePackage.institute = institute || undefined;
        coursePackage.year = year || undefined;
        await coursePackage.save();
        const populatedPackage = await populateCoursePackage(CoursePackage_1.CoursePackage.findById(coursePackage._id));
        res.json({ message: 'Course package updated successfully', coursePackage: populatedPackage });
    }
    catch (error) {
        console.error("Update course package error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateCoursePackage = updateCoursePackage;
// @desc    Delete a course package
// @route   DELETE /api/course-packages/:id
// @access  Private (Teachers only)
const deleteCoursePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const coursePackage = await CoursePackage_1.CoursePackage.findById(id);
        if (!coursePackage) {
            return res.status(404).json({ message: 'Course package not found' });
        }
        // Basic authorization: Only creator or admin can delete
        const user = req.user;
        if (coursePackage.createdBy.toString() !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course package' });
        }
        await coursePackage.deleteOne();
        res.json({ message: 'Course package deleted successfully' });
    }
    catch (error) {
        console.error("Delete course package error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteCoursePackage = deleteCoursePackage;
