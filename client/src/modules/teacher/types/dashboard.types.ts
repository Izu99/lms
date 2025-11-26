export interface TeacherDashboardStats {
  totalVideos: number;
  totalPapers: number;
  totalTutes: number;
  totalCoursePackages: number;
  totalStudents: number;
  totalViews: number;
  totalSubmissions: number;
  averageEngagement: number;
  activeStudents: number;
  inactiveStudents: number;
}

export interface TeacherVideoSummary {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  views: number;
  createdAt: string;
  class: {
    _id: string;
    name: string;
    location: string;
  };
  year: {
    _id: string;
    year: number;
    name: string;
  };
}

export interface TeacherPaperSummary {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  timeLimit: number;
  totalQuestions: number;
  submissionCount: number;
  averageScore: number;
  completionRate: number;
}

export interface StudentSummary {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: string;
  status: string;
  year?: {
    _id: string;
    year: number;
    name: string;
  };
  lastActivity?: string;
  completedPapers: number;
  averageScore: number;
}

export interface TeacherAnalytics {
  videoViews: {
    date: string;
    views: number;
  }[];
  paperSubmissions: {
    date: string;
    submissions: number;
  }[];
  studentEngagement: {
    active: number;
    inactive: number;
  };
}

export interface DailyActivity {
  date: string;
  day: string;
  videos: number;
  papers: number;
  students: number;
}

export interface PerformanceDistributionData {
  label: string;
  count: number;
  percentage: number;
}

export interface TeacherDashboardData {
  stats: TeacherDashboardStats;
  recentVideos: TeacherVideoSummary[];
  recentPapers: TeacherPaperSummary[];
  students: StudentSummary[];
  dailyActivity: DailyActivity[]; // New field
  performanceDistribution: PerformanceDistributionData[];
}