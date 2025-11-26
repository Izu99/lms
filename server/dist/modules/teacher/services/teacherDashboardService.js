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
            const teacherPapers = await Paper_1.Paper.find({ teacherId }).select('_id');
            const teacherPaperIds = teacherPapers.map(p => p._id);
            // Calculate date for active students (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const [totalVideos, totalPapers, totalTutes, totalCoursePackages, totalStudents, teacherVideos, activeStudentIds, totalSubmissions] = await Promise.all([
                Video_1.Video.countDocuments({ uploadedBy: teacherId }),
                Paper_1.Paper.countDocuments({ teacherId }),
                // Import Tute model at the top: import { Tute } from '../../../models/Tute';
                (async () => {
                    try {
                        const Tute = require('../../../models/Tute').Tute;
                        return await Tute.countDocuments({ uploadedBy: teacherId });
                    }
                    catch (e) {
                        return 0;
                    }
                })(),
                // Import CoursePackage model at the top: import { CoursePackage } from '../../../models/CoursePackage';
                (async () => {
                    try {
                        const CoursePackage = require('../../../models/CoursePackage').CoursePackage;
                        return await CoursePackage.countDocuments({ createdBy: teacherId });
                    }
                    catch (e) {
                        return 0;
                    }
                })(),
                User_1.User.countDocuments({ role: 'student' }),
                Video_1.Video.find({ uploadedBy: teacherId }).select('views'),
                StudentAttempt_1.StudentAttempt.distinct('studentId', {
                    paperId: { $in: teacherPaperIds },
                    createdAt: { $gte: sevenDaysAgo }
                }),
                StudentAttempt_1.StudentAttempt.countDocuments({
                    paperId: { $in: teacherPaperIds },
                    status: 'submitted'
                })
            ]);
            const totalViews = teacherVideos.reduce((sum, video) => sum + (video.views || 0), 0);
            const activeStudents = activeStudentIds.length;
            const inactiveStudents = totalStudents - activeStudents;
            return {
                totalVideos,
                totalPapers,
                totalTutes,
                totalCoursePackages,
                totalStudents,
                totalViews,
                totalSubmissions,
                averageEngagement: totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0,
                activeStudents,
                inactiveStudents
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
                .populate('year', 'year name')
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
                class: video.institute ? {
                    _id: video.institute._id ? video.institute._id.toString() : '',
                    name: video.institute.name || 'Unknown',
                    location: video.institute.location || ''
                } : {
                    _id: '',
                    name: 'Unknown',
                    location: ''
                },
                year: video.year ? {
                    _id: video.year._id ? video.year._id.toString() : '',
                    year: video.year.year || 0,
                    name: video.year.name || ''
                } : null
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
            const teacherPapers = await Paper_1.Paper.find({ teacherId }).select('_id').lean();
            const teacherPaperIds = teacherPapers.map(p => p._id);
            const attempts = await StudentAttempt_1.StudentAttempt.find({
                paperId: { $in: teacherPaperIds },
                status: 'submitted'
            }).lean();
            const studentIds = [...new Set(attempts.map(a => a.studentId))];
            const students = await User_1.User.find({ _id: { $in: studentIds } })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
            const studentAttempts = await StudentAttempt_1.StudentAttempt.find({
                studentId: { $in: students.map(s => s._id) },
                paperId: { $in: teacherPaperIds },
                status: 'submitted'
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
    static async getPerformanceDistribution(teacherId) {
        const teacherPapers = await Paper_1.Paper.find({ teacherId }).select('_id').lean();
        const teacherPaperIds = teacherPapers.map(p => p._id);
        const attempts = await StudentAttempt_1.StudentAttempt.find({
            paperId: { $in: teacherPaperIds },
            status: 'submitted'
        }).select('percentage').lean();
        const distribution = {
            excellent: { count: 0, label: "Excellent (90-100%)" },
            good: { count: 0, label: "Good (75-89%)" },
            average: { count: 0, label: "Average (60-74%)" },
            belowAverage: { count: 0, label: "Below Average (<60%)" },
        };
        for (const attempt of attempts) {
            if (attempt.percentage >= 90) {
                distribution.excellent.count++;
            }
            else if (attempt.percentage >= 75) {
                distribution.good.count++;
            }
            else if (attempt.percentage >= 60) {
                distribution.average.count++;
            }
            else {
                distribution.belowAverage.count++;
            }
        }
        const totalAttempts = attempts.length;
        if (totalAttempts === 0) {
            return Object.values(distribution).map(d => ({ ...d, percentage: 0 }));
        }
        return [
            { ...distribution.excellent, percentage: (distribution.excellent.count / totalAttempts) * 100 },
            { ...distribution.good, percentage: (distribution.good.count / totalAttempts) * 100 },
            { ...distribution.average, percentage: (distribution.average.count / totalAttempts) * 100 },
            { ...distribution.belowAverage, percentage: (distribution.belowAverage.count / totalAttempts) * 100 },
        ];
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
