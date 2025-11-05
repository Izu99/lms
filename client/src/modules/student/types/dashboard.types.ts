export interface StudentDashboardStats {
  availableVideos: number;
  availablePapers: number;
  completedPapers: number;
  totalWatchTime: number;
  averageScore: number;
  progressPercentage: number;
}

export interface StudentVideoSummary {
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
  uploadedBy: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface StudentPaperSummary {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  timeLimit: number;
  totalQuestions: number;
  isCompleted: boolean;
  score?: number;
  percentage?: number;
  submittedAt?: string;
  timeRemaining?: number;
}

export interface StudentActivity {
  type: 'video_watched' | 'paper_completed' | 'paper_started';
  title: string;
  timestamp: string;
  score?: number;
}

export interface StudentDashboardData {
  stats: StudentDashboardStats;
  recentVideos: StudentVideoSummary[];
  availablePapers: StudentPaperSummary[];
  recentActivity: StudentActivity[];
}