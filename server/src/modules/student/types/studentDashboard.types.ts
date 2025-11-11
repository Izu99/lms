import { PaperBase, BaseEntity } from '../../shared/types/common.types';

export interface StudentDashboardStats {
  availableVideos: number;
  availablePapers: number;
  completedPapers: number;
  totalWatchTime: number;
  averageScore: number;
  progressPercentage: number;
}

export interface StudentVideoSummary extends BaseEntity {
  title: string;
  description: string;
  videoUrl: string;
  class: any;
  year: any;
  views: number;
  institute?: {
    _id: string;
    name: string;
    location: string;
  };
  uploadedBy?: {
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