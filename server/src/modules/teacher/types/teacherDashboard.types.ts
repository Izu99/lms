import { VideoBase, PaperBase, UserBase } from '../../shared/types/common.types';

export interface TeacherDashboardStats {
  totalVideos: number;
  totalPapers: number;
  totalStudents: number;
  totalViews: number;
  averageEngagement: number;
  activeStudents: number;
}

export interface TeacherVideoSummary extends VideoBase {
  institute: {
    _id: string;
    name: string;
    location: string;
  } | null;
  year: string | null; // Changed to match current implementation
}

export interface TeacherPaperSummary extends PaperBase {
  submissionCount: number;
  averageScore: number;
  completionRate: number;
}

export interface StudentSummary extends UserBase {
  year?: string | null; // Changed to match current implementation (year is now a string)
  status: string;
  lastActivity?: Date;
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