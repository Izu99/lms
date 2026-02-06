"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDashboardService = void 0;
const Video_1 = require("../../../models/Video");
const Paper_1 = require("../../../models/Paper");
const StudentAttempt_1 = require("../../../models/StudentAttempt");
class StudentDashboardService {
    static async getDashboardStats(studentId, academicLevel) {
        const videoFilter = {};
        const paperFilter = { deadline: { $gte: new Date() } };
        if (academicLevel) {
            videoFilter.academicLevel = academicLevel;
            paperFilter.academicLevel = academicLevel;
        }
        const [availableVideos, availablePapers, completedAttempts] = await Promise.all([
            Video_1.Video.countDocuments(videoFilter),
            Paper_1.Paper.countDocuments(paperFilter),
            StudentAttempt_1.StudentAttempt.find({ studentId, status: 'submitted' })
        ]);
        const totalScore = completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
        const averageScore = completedAttempts.length > 0 ? totalScore / completedAttempts.length : 0;
        return {
            availableVideos,
            availablePapers,
            completedPapers: completedAttempts.length,
            totalWatchTime: 0, // TODO: Implement watch time tracking
            averageScore,
            progressPercentage: availablePapers > 0 ? (completedAttempts.length / availablePapers) * 100 : 0
        };
    }
    static async getRecentVideos(studentId, academicLevel, limit = 5) {
        const filter = {};
        if (academicLevel) {
            filter.academicLevel = academicLevel;
        }
        const videos = await Video_1.Video.find(filter)
            .populate('institute', 'name location')
            .populate('year', 'year name')
            .populate('uploadedBy', 'username firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return videos.map((video) => ({
            ...video,
            _id: video._id.toString(),
            createdAt: video.createdAt,
            updatedAt: video.updatedAt,
            class: video.class,
            uploadedBy: video.uploadedBy ? {
                ...video.uploadedBy,
                _id: video.uploadedBy._id.toString()
            } : undefined,
            institute: video.institute ? {
                ...video.institute,
                _id: video.institute._id.toString()
            } : video.institute,
            year: video.year || null
        }));
    }
    static async getAvailablePapers(studentId, academicLevel, limit = 5) {
        const filter = { deadline: { $gte: new Date() } };
        if (academicLevel) {
            filter.academicLevel = academicLevel;
        }
        const papers = await Paper_1.Paper.find(filter)
            .sort({ deadline: 1 })
            .limit(limit)
            .lean();
        const paperIds = papers.map(paper => paper._id);
        const attempts = await StudentAttempt_1.StudentAttempt.find({
            studentId,
            paperId: { $in: paperIds }
        }).lean();
        const attemptMap = new Map(attempts.map(attempt => [attempt.paperId.toString(), attempt]));
        return papers.map(paper => {
            const attempt = attemptMap.get(paper._id.toString());
            const timeRemaining = paper.deadline ? Math.max(0, new Date(paper.deadline).getTime() - Date.now()) : 0;
            return {
                _id: paper._id.toString(),
                title: paper.title,
                description: paper.description,
                deadline: paper.deadline,
                timeLimit: paper.timeLimit,
                totalQuestions: paper.totalQuestions,
                teacherId: paper.teacherId.toString(),
                availability: paper.availability,
                createdAt: paper.createdAt,
                updatedAt: paper.updatedAt,
                isCompleted: attempt?.status === 'submitted' || false,
                score: attempt?.score,
                percentage: attempt?.percentage,
                submittedAt: attempt?.submittedAt,
                timeRemaining: timeRemaining > 0 ? Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)) : 0
            };
        });
    }
    static async getRecentActivity(studentId, limit = 10) {
        try {
            const attempts = await StudentAttempt_1.StudentAttempt.find({ studentId })
                .populate('paperId', 'title')
                .sort({ updatedAt: -1 })
                .limit(limit)
                .lean();
            const processedActivities = attempts
                .filter(attempt => !!attempt.paperId) // Filter out attempts where paperId couldn't be populated
                .map(attempt => {
                try {
                    const paperTitle = attempt.paperId.title; // Access title from populated paperId
                    return {
                        type: attempt.status === 'submitted' ? 'paper_completed' : 'paper_started',
                        title: paperTitle,
                        timestamp: attempt.status === 'submitted' ? attempt.submittedAt : attempt.startedAt, // Ensure timestamp is Date
                        score: attempt.status === 'submitted' ? attempt.percentage : undefined // Use percentage for score
                    };
                }
                catch (error) {
                    console.error('Error processing attempt for recent activity:', attempt, error);
                    return null;
                }
            });
            // Filter out any null activities that resulted from processing errors
            return processedActivities.filter((activity) => activity !== null);
        }
        catch (error) {
            console.error('Error fetching recent activity:', error);
            return [];
        }
    }
}
exports.StudentDashboardService = StudentDashboardService;
