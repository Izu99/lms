export type UserRole = 'student' | 'teacher' | 'admin';
export type StudentStatus = 'active' | 'inactive' | 'pending' | 'paid' | 'unpaid';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBase extends BaseEntity {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export interface VideoBase extends BaseEntity {
  title: string;
  description: string;
  videoUrl: string;
  uploadedBy: string;
  class: string;
  year: string;
  views: number;
}

export interface PaperBase extends BaseEntity {
  title: string;
  description?: string;
  teacherId: string;
  deadline: Date;
  timeLimit: number;
  totalQuestions: number;
}