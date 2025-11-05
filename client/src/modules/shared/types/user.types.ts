export type UserRole = 'student' | 'teacher' | 'admin';
export type StudentStatus = 'active' | 'inactive' | 'pending' | 'paid' | 'unpaid';

export interface User {
  _id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status?: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}