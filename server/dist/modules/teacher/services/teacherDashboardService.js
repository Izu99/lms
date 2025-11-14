"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherDashboardService = void 0;
const Video_1 = require("../../../models/Video");
const Paper_1 = require("../../../models/Paper");
const User_1 = require("../../../models/User");
const StudentAttempt_1 = require("../../../models/StudentAttempt");
// Helper to safely convert date to ISO string
function safeISOString(date) {
    if (!date) {
        return new Date(0).toISOString();
    }
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            return new Date(0).toISOString();
        }
        return d.toISOString();
    }
    catch (e) {
        return new Date(0).toISOString();
    }
}
class TeacherDashboardService {
    static async getDashboardStats(teacherId) {
        try {
            const [totalVideos, totalPapers, totalStudents, teacherVideos, allAttempts] = await Promise.all([
                Video_1.Video.countDocuments({ uploadedBy: teacherId }),
                Paper_1.Paper.countDocuments({ teacherId }),
                User_1.User.countDocuments({ role: 'student' }),
                Video_1.Video.find({ uploadedBy: teacherId }).select('views'),
                StudentAttempt_1.StudentAttempt.find().populate({
                    path: 'paperId',
                    select: 'teacherId',
                    model: 'Paper'
                })
            ]);
            const totalViews = teacherVideos.reduce((sum, video) => sum + (video.views || 0), 0);
            // Filter attempts for teacher's papers
            const teacherAttempts = allAttempts.filter(attempt => {
                // Ensure attempt.paperId exists and is an object after population
                if (!attempt.paperId || typeof attempt.paperId !== 'object') {
                    return false;
                }
                const paper = attempt.paperId; // Explicitly type for safety
                // Ensure paper.teacherId exists and matches the teacherId
                return paper.teacherId && paper.teacherId.toString() === teacherId;
            });
            const activeStudents = new Set(teacherAttempts
                .filter(attempt => {
                if (!attempt.createdAt)
                    return false;
                const daysSinceActivity = (Date.now() - new Date(attempt.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                return daysSinceActivity <= 7; // Active in last 7 days
            })
                .map(attempt => attempt.studentId ? attempt.studentId.toString() : null)
                .filter(id => id !== null)).size;
            return {
                totalVideos,
                totalPapers,
                totalStudents,
                totalViews,
                averageEngagement: totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0,
                activeStudents
            };
        }
        catch (error) {
            console.error('ERROR in getDashboardStats:', error);
            throw error;
        }
    }
    static async getRecentVideos(teacherId, limit = 5) {
        try {
            const videos = await Video_1.Video.find({ uploadedBy: teacherId })
                .populate('institute', 'name location')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
            return videos.map((video) => ({
                _id: video._id.toString(),
                title: video.title,
                description: video.description,
                videoUrl: video.videoUrl,
                views: video.views || 0,
                createdAt: video.createdAt,
                updatedAt: video.updatedAt,
                uploadedBy: video.uploadedBy,
                class: video.class,
                institute: video.institute ? {
                    _id: video.institute._id ? video.institute._id.toString() : undefined,
                    name: video.institute.name,
                    location: video.institute.location
                } : null,
                year: null // Temporarily disable year population to avoid ObjectId errors
            }));
        }
        catch (error) {
            console.error('ERROR in getRecentVideos:', error);
            return []; // Return empty array on error
        }
    }
    static async getRecentPapers(teacherId, limit = 5) {
        const papers = await Paper_1.Paper.find({ teacherId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        const paperIds = papers.map(paper => paper._id);
        const attempts = await StudentAttempt_1.StudentAttempt.find({
            paperId: { $in: paperIds },
            status: 'submitted'
        }).lean();
        return papers.map(paper => {
            const paperAttempts = attempts.filter(attempt => attempt.paperId && paper._id && attempt.paperId.toString() === paper._id.toString());
            const totalScore = paperAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
            const averageScore = paperAttempts.length > 0 ? totalScore / paperAttempts.length : 0;
            return {
                _id: paper._id ? paper._id.toString() : '',
                title: paper.title,
                description: paper.description,
                deadline: paper.deadline,
                timeLimit: paper.timeLimit,
                totalQuestions: paper.totalQuestions,
                teacherId: paper.teacherId ? paper.teacherId.toString() : '',
                availability: paper.availability,
                createdAt: paper.createdAt,
                updatedAt: paper.updatedAt,
                submissionCount: paperAttempts.length,
                averageScore,
                completionRate: 0 // TODO: Calculate based on enrolled students
            };
        });
    }
    static async getStudentsSummary(teacherId, limit = 10) {
        try {
            const students = await User_1.User.find({ role: 'student' })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
            const studentIds = students.map(student => student._id).filter(id => id !== undefined && id !== null);
            const attempts = await StudentAttempt_1.StudentAttempt.find({
                studentId: { $in: studentIds },
                status: 'submitted'
            }).populate({
                path: 'paperId',
                select: 'teacherId',
                model: 'Paper'
            }).lean();
            return students.map(student => {
                const studentAttempts = attempts.filter(attempt => attempt.studentId && student._id && attempt.studentId.toString() === student._id.toString() &&
                    attempt.paperId &&
                    attempt.paperId.teacherId &&
                    attempt.paperId.teacherId.toString() === teacherId);
                const totalScore = studentAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
                const averageScore = studentAttempts.length > 0 ? totalScore / studentAttempts.length : 0;
                const lastActivity = studentAttempts.length > 0
                    ? new Date(Math.max(...studentAttempts.map(a => a.createdAt ? new Date(a.createdAt).getTime() : 0)))
                    : undefined;
                return {
                    _id: student._id ? student._id.toString() : '',
                    username: student.username,
                    email: student.email,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    role: student.role,
                    status: student.status || 'pending',
                    createdAt: student.createdAt,
                    updatedAt: student.updatedAt,
                    year: student.year ? student.year.toString() : null, // Now year is just a string like "2022", "2023", "2024"
                    completedPapers: studentAttempts.length,
                    averageScore,
                    lastActivity
                };
            });
        }
        catch (error) {
            console.error('ERROR in getStudentsSummary:', error);
            return []; // Return empty array on error
        }
    }
    static async getAnalytics(teacherId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        // TODO: Implement detailed analytics
        // This is a simplified version
        return {
            videoViews: [],
            paperSubmissions: [],
            studentEngagement: {
                active: 0,
                inactive: 0
            }
        };
    }
}
exports.TeacherDashboardService = TeacherDashboardService;
