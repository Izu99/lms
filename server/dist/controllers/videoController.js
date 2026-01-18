"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoAnalytics = exports.recordWatch = exports.getVideoById = exports.deleteVideo = exports.updateVideo = exports.incrementViewCount = exports.uploadVideo = exports.getAllVideos = void 0;
const Video_1 = require("../models/Video");
const VideoWatch_1 = require("../models/VideoWatch");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Get all videos
// Get all videos
const getAllVideos = async (req, res) => {
    try {
        const { institute, year, academicLevel } = req.query;
        const filter = {};
        if (institute && institute !== 'all')
            filter.institute = institute;
        if (year && year !== 'all')
            filter.year = year;
        // Note: Video model might not have academicLevel yet, but adding logic for consistency if it does or will
        if (academicLevel && academicLevel !== 'all')
            filter.academicLevel = academicLevel;
        const videos = await Video_1.Video.find(filter)
            .populate('uploadedBy', 'username role')
            .populate('institute', 'name location')
            .populate('year', 'year name')
            .sort({ createdAt: -1 });
        res.json({ videos });
    }
    catch (error) {
        console.error("Get all videos error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllVideos = getAllVideos;
// Upload new video
const uploadVideo = async (req, res) => {
    try {
        const { title, description, institute: instituteId, year: yearId, academicLevel, availability, price } = req.body;
        const files = req.files;
        const videoFile = files?.video?.[0];
        const thumbnailFile = files?.thumbnail?.[0];
        if (!videoFile) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }
        if (!title || !instituteId || !yearId) {
            return res.status(400).json({ message: 'Title, institute, and year are required' });
        }
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication failed - no user ID' });
        }
        const newVideo = new Video_1.Video({
            title,
            description,
            videoUrl: `videos/files/${videoFile.filename}`,
            thumbnailUrl: thumbnailFile ? `videos/images/${thumbnailFile.filename}` : undefined,
            uploadedBy: userId,
            institute: instituteId,
            year: yearId,
            academicLevel, // Add academicLevel
            views: 0,
            availability,
            price,
        });
        await newVideo.save();
        await newVideo.populate('uploadedBy', 'username role');
        await newVideo.populate('institute', 'name location');
        await newVideo.populate('year', 'year name');
        res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
    }
    catch (error) {
        console.error("Upload video error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.uploadVideo = uploadVideo;
// NEW: Increment view count endpoint
const incrementViewCount = async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await Video_1.Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, // Increment views by 1
        { new: true });
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json({ message: 'View count updated', views: video.views });
    }
    catch (error) {
        console.error("Increment view error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.incrementViewCount = incrementViewCount;
// Update video
const updateVideo = async (req, res) => {
    try {
        const update = {};
        const { title, description, institute: instituteId, year: yearId, academicLevel, availability, price } = req.body || {};
        if (title !== undefined)
            update.title = title;
        if (description !== undefined)
            update.description = description;
        if (instituteId !== undefined)
            update.institute = instituteId;
        if (yearId !== undefined)
            update.year = yearId;
        if (academicLevel !== undefined)
            update.academicLevel = academicLevel; // Add academicLevel
        if (availability !== undefined)
            update.availability = availability;
        if (price !== undefined)
            update.price = price;
        const files = req.files;
        const videoFile = files?.video?.[0];
        const thumbnailFile = files?.thumbnail?.[0];
        // Handle new video file if uploaded
        if (videoFile) {
            const prev = await Video_1.Video.findById(req.params.id);
            if (prev && prev.videoUrl) {
                try {
                    // Check if previous url was full path or relative
                    const oldFilename = prev.videoUrl.split('/').pop();
                    fs_1.default.unlinkSync(path_1.default.join(__dirname, '../../', 'uploads/videos/files', oldFilename));
                }
                catch (e) {
                    console.log("Old video file not found, continuing...");
                }
            }
            update.videoUrl = `videos/files/${videoFile.filename}`;
        }
        // Handle new thumbnail image if uploaded
        if (thumbnailFile) {
            const prev = await Video_1.Video.findById(req.params.id);
            if (prev && prev.thumbnailUrl) {
                try {
                    const oldFilename = prev.thumbnailUrl.split('/').pop();
                    fs_1.default.unlinkSync(path_1.default.join(__dirname, '../../', 'uploads/videos/images', oldFilename));
                }
                catch (e) {
                    console.log("Old thumbnail image not found, continuing...");
                }
            }
            update.thumbnailUrl = `videos/images/${thumbnailFile.filename}`;
        }
        const video = await Video_1.Video.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true })
            .populate('uploadedBy', 'username role')
            .populate('institute', 'name location')
            .populate('year', 'year name');
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json({ message: 'Video updated successfully', video });
    }
    catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.updateVideo = updateVideo;
// Delete video
const deleteVideo = async (req, res) => {
    try {
        const video = await Video_1.Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        // Delete video file from filesystem
        if (video.videoUrl) {
            try {
                fs_1.default.unlinkSync(path_1.default.join(__dirname, '../../', 'uploads/videos/files', video.videoUrl));
            }
            catch (e) {
                console.log("Video file not found, continuing with deletion...");
            }
        }
        // Delete thumbnail image from filesystem
        if (video.thumbnailUrl) {
            try {
                // Extract filename from path if it's a full path
                const thumbnailFilename = video.thumbnailUrl.includes('/')
                    ? video.thumbnailUrl.split('/').pop()
                    : video.thumbnailUrl;
                fs_1.default.unlinkSync(path_1.default.join(__dirname, '../../', 'uploads/videos/images', thumbnailFilename));
            }
            catch (e) {
                console.log("Thumbnail image not found, continuing with deletion...");
            }
        }
        await video.deleteOne();
        res.json({ message: 'Video deleted successfully' });
    }
    catch (error) {
        console.error("Delete video error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteVideo = deleteVideo;
// Get single video
// Get single video
const Payment_1 = require("../models/Payment"); // Import Payment model
const getVideoById = async (req, res) => {
    try {
        const video = await Video_1.Video.findById(req.params.id)
            .populate('uploadedBy', 'username role')
            .populate('institute', 'name location')
            .populate('year', 'year name');
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        const requestingUser = req.user;
        // If user is not a student, or is a teacher/admin, grant full access
        if (!requestingUser || requestingUser.role !== 'student') {
            return res.json({ video });
        }
        // Access control logic for students
        const studentType = requestingUser.studentType;
        let hasAccess = false;
        let paymentRequired = false;
        if (video.availability === 'all') {
            hasAccess = true;
        }
        else if (video.availability === 'physical' && studentType === 'Physical') {
            hasAccess = true;
        }
        else if (video.availability === 'paid' || (video.price && video.price > 0)) {
            paymentRequired = true;
        }
        else {
            // Default to free if price is 0 and no specific restriction
            hasAccess = true;
        }
        if (paymentRequired) {
            // Check if user has already paid
            const payment = await Payment_1.Payment.findOne({
                userId: requestingUser.id,
                itemId: video._id,
                status: 'PAID'
            });
            if (payment) {
                hasAccess = true;
                paymentRequired = false; // Override payment requirement since they paid
            }
            else {
                return res.status(402).json({
                    message: 'Payment required to access this video.',
                    price: video.price,
                    videoTitle: video.title,
                    videoId: video._id,
                    currency: 'LKR' // Send currency for frontend button
                });
            }
        }
        if (!hasAccess) {
            // This case should ideally not be reached if logic is exhaustive, but as a fallback
            return res.status(403).json({ message: 'Access denied to this video.' });
        }
        res.json({ video });
    }
    catch (error) {
        console.error("Get video by ID error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getVideoById = getVideoById;
// Record video watch data
const recordWatch = async (req, res) => {
    try {
        const { videoId, duration, completed } = req.body;
        const studentId = req.user.id;
        let videoWatch = await VideoWatch_1.VideoWatch.findOne({ video: videoId, student: studentId });
        if (videoWatch) {
            videoWatch.watchDuration = duration;
            videoWatch.completed = completed;
        }
        else {
            videoWatch = new VideoWatch_1.VideoWatch({
                video: videoId,
                student: studentId,
                watchDuration: duration,
                completed: completed,
            });
        }
        await videoWatch.save();
        res.status(200).json({ message: 'Watch data recorded' });
    }
    catch (error) {
        console.error("Record watch data error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.recordWatch = recordWatch;
// Get video analytics
const getVideoAnalytics = async (req, res) => {
    try {
        const videoId = req.params.id;
        const watches = await VideoWatch_1.VideoWatch.find({ video: videoId }).populate('student', 'username');
        const totalWatches = watches.length;
        const uniqueViewers = new Set(watches.map(w => w.student._id.toString())).size;
        const averageWatchTime = totalWatches > 0 ? watches.reduce((acc, w) => acc + w.watchDuration, 0) / totalWatches : 0;
        const completedCount = watches.filter(w => w.completed).length;
        res.json({
            totalWatches,
            uniqueViewers,
            averageWatchTime,
            completedCount,
            watches,
        });
    }
    catch (error) {
        console.error("Get video analytics error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getVideoAnalytics = getVideoAnalytics;
