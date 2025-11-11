import { Video } from '../../../models/Video';
import { Paper } from '../../../models/Paper';
import { User } from '../../../models/User';
import { StudentAttempt } from '../../../models/StudentAttempt';
import { 
  TeacherDashboardStats, 
  TeacherVideoSummary, 
  TeacherPaperSummary, 
  StudentSummary,
  TeacherAnalytics 
} from '../types/teacherDashboard.types';

// Helper to safely convert date to ISO string
function safeISOString(date: any): string {
  if (!date) {
    return new Date(0).toISOString(); 
  }
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return new Date(0).toISOString();
    }
    return d.toISOString();
  } catch (e) {
    return new Date(0).toISOString();
  }
}

// Type for lean documents with timestamps
interface LeanWithTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

// Type for populated paper in student attempt
interface PopulatedPaper {
  teacherId: string;
}

export class TeacherDashboardService {
  static async getDashboardStats(teacherId: string): Promise<TeacherDashboardStats> {
    try {
      const [
        totalVideos,
        totalPapers,
        totalStudents,
        teacherVideos,
        allAttempts
      ] = await Promise.all([
        Video.countDocuments({ uploadedBy: teacherId }),
        Paper.countDocuments({ teacherId }),
        User.countDocuments({ role: 'student' }),
        Video.find({ uploadedBy: teacherId }).select('views'),
        StudentAttempt.find().populate({
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
      const paper = attempt.paperId as { teacherId?: string }; // Explicitly type for safety
      // Ensure paper.teacherId exists and matches the teacherId
      return paper.teacherId && paper.teacherId.toString() === teacherId;
    });

    const activeStudents = new Set(
      teacherAttempts
        .filter(attempt => {
          if (!(attempt as any).createdAt) return false;
          const daysSinceActivity = (Date.now() - new Date((attempt as any).createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceActivity <= 7; // Active in last 7 days
        })
        .map(attempt => attempt.studentId ? attempt.studentId.toString() : null)
        .filter(id => id !== null)
    ).size;

      return {
        totalVideos,
        totalPapers,
        totalStudents,
        totalViews,
        averageEngagement: totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0,
        activeStudents
      };
    } catch (error) {
      console.error('ERROR in getDashboardStats:', error);
      throw error;
    }
  }

  static async getRecentVideos(teacherId: string, limit = 5): Promise<TeacherVideoSummary[]> {
    try {
      const videos = await Video.find({ uploadedBy: teacherId })
        .populate('institute', 'name location')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();



      return videos.map((video: any) => ({
        _id: video._id.toString(),
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        views: video.views || 0,
        createdAt: (video as any).createdAt,
        updatedAt: (video as any).updatedAt,
        uploadedBy: video.uploadedBy,
        class: video.class,
        institute: video.institute ? {
          _id: (video.institute as any)._id ? (video.institute as any)._id.toString() : undefined,
          name: (video.institute as any).name,
          location: (video.institute as any).location
        } : null,
        year: null // Temporarily disable year population to avoid ObjectId errors
      })) as TeacherVideoSummary[];
    } catch (error) {
      console.error('ERROR in getRecentVideos:', error);
      return []; // Return empty array on error
    }
  }

  static async getRecentPapers(teacherId: string, limit = 5): Promise<TeacherPaperSummary[]> {
    const papers = await Paper.find({ teacherId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const paperIds = papers.map(paper => paper._id);
    const attempts = await StudentAttempt.find({
      paperId: { $in: paperIds },
      status: 'submitted'
    }).lean();

    return papers.map(paper => {
      const paperAttempts = attempts.filter(attempt => 
        attempt.paperId && paper._id && attempt.paperId.toString() === paper._id.toString()
      );

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
        createdAt: (paper as any).createdAt,
        updatedAt: (paper as any).updatedAt,
        submissionCount: paperAttempts.length,
        averageScore,
        completionRate: 0 // TODO: Calculate based on enrolled students
      };
    });
  }

  static async getStudentsSummary(teacherId: string, limit = 10): Promise<StudentSummary[]> {
    try {
      const students = await User.find({ role: 'student' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();


      
      const studentIds = students.map(student => student._id).filter(id => id !== undefined && id !== null);
      const attempts = await StudentAttempt.find({
        studentId: { $in: studentIds },
        status: 'submitted'
      }).populate({
        path: 'paperId',
        select: 'teacherId',
        model: 'Paper'
      }).lean();

      return students.map(student => {
        const studentAttempts = attempts.filter(attempt =>
          attempt.studentId && student._id && attempt.studentId.toString() === student._id.toString() &&
          attempt.paperId &&
          (attempt.paperId as any).teacherId &&
          (attempt.paperId as any).teacherId.toString() === teacherId
        );

        const totalScore = studentAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
        const averageScore = studentAttempts.length > 0 ? totalScore / studentAttempts.length : 0;
        const lastActivity = studentAttempts.length > 0
          ? new Date(Math.max(...studentAttempts.map(a => (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0)))
          : undefined;

        return {
          _id: student._id ? student._id.toString() : '',
          username: student.username,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          role: student.role,
          status: student.status || 'pending',
          createdAt: (student as any).createdAt,
          updatedAt: (student as any).updatedAt,
          year: student.year ? student.year.toString() : null, // Now year is just a string like "2022", "2023", "2024"
          completedPapers: studentAttempts.length,
          averageScore,
          lastActivity
        };
        });
    } catch (error) {
      console.error('ERROR in getStudentsSummary:', error);
      return []; // Return empty array on error
    }
  }

  static async getAnalytics(teacherId: string, days = 30): Promise<TeacherAnalytics> {
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