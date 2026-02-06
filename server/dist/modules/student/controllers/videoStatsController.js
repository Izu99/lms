"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoStats = void 0;
const Video_1 = require("../../../models/Video");
const VideoWatch_1 = require("../../../models/VideoWatch");
const getVideoStats = async (req, res) => {
    try {
        const user = req.user;
        const studentId = user.id;
        const videoFilter = {};
        if (user.role === 'student' && user.academicLevel) {
            videoFilter.academicLevel = user.academicLevel;
        }
        const totalVideos = await Video_1.Video.countDocuments(videoFilter);
        const watchedVideos = await VideoWatch_1.VideoWatch.find({ student: studentId });
        const totalWatchedCount = new Set(watchedVideos.map(w => w.video.toString())).size;
        const totalWatchTime = watchedVideos.reduce((acc, w) => acc + w.watchDuration, 0);
        res.json({
            totalVideos,
            totalWatchedCount,
            totalWatchTime,
        });
    }
    catch (error) {
        console.error("Get video stats error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getVideoStats = getVideoStats;
