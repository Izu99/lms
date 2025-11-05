import { VideoBase, PaperBase } from '../../shared/types/common.types';

export interface StudentDashboardStats {
  availableVideos: number;
  availablePapers: number;
  completedPapers: number;
  totalWatchTime: number;
  averageScore: number;
  progressPercentage: number;
}

export interface StudentVideoSummary extends VideoBase {
  institute: {
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

export interface StudentPaperSummary extends PaperBase {
  isCompleted: boolean;
  score?: number;
  percentage?: number;
  submittedAt?: Date;
  timeRemaining?: number;
}

export interface StudentActivity {
  type: 'video_watched' | 'paper_completed' | 'paper_started';
  title: string;
  timestamp: Date;
  score?: number;
}