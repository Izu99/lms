"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoById = exports.deleteVideo = exports.updateVideo = exports.incrementViewCount = exports.uploadVideo = exports.getAllVideos = void 0;
const Video_1 = require("../models/Video");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Get all videos
const getAllVideos = async (req, res) => {
    try {
        const videos = await Video_1.Video.find()
            .populate('uploadedBy', 'username role')
            .populate('class', 'name location')
            .populate('year', 'year name');
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
        const { title, description, class: classId, year: yearId } = req.body;
        const videoFile = req.file;
        if (!videoFile) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }
        if (!title || !classId || !yearId) {
            return res.status(400).json({ message: 'Title, class, and year are required' });
        }
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication failed - no user ID' });
        }
        const newVideo = new Video_1.Video({
            title,
            description,
            videoUrl: videoFile.path,
            uploadedBy: userId,
            class: classId,
            year: yearId,
            views: 0, // NEW: Initialize with 0 views
        });
        await newVideo.save();
        await newVideo.populate('uploadedBy', 'username role');
        await newVideo.populate('class', 'name location');
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
        const { title, description, class: classId, year: yearId } = req.body || {};
        if (title !== undefined)
            update.title = title;
        if (description !== undefined)
            update.description = description;
        if (classId !== undefined)
            update.class = classId;
        if (yearId !== undefined)
            update.year = yearId;
        // Handle new file if uploaded
        if (req.file) {
            const prev = await Video_1.Video.findById(req.params.id);
            if (prev && prev.videoUrl) {
                try {
                    fs_1.default.unlinkSync(path_1.default.join(__dirname, '../../', prev.videoUrl));
                }
                catch (e) {
                    console.log("Old file not found, continuing...");
                }
            }
            update.videoUrl = req.file.path;
        }
        const video = await Video_1.Video.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true })
            .populate('uploadedBy', 'username role')
            .populate('class', 'name location')
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
        // Delete file from filesystem
        if (video.videoUrl) {
            try {
                fs_1.default.unlinkSync(path_1.default.join(__dirname, '../../', video.videoUrl));
            }
            catch (e) {
                console.log("File not found, continuing with deletion...");
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
const getVideoById = async (req, res) => {
    try {
        const video = await Video_1.Video.findById(req.params.id)
            .populate('uploadedBy', 'username role')
            .populate('class', 'name location')
            .populate('year', 'year name');
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json({ video });
    }
    catch (error) {
        console.error("Get video by ID error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getVideoById = getVideoById;
