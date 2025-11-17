export interface PaperData {
  _id: string;
  title: string;
  description?: string;
  totalQuestions: number;
  timeLimit: number; // in minutes
  passMark: number; // percentage
  institute?: { _id: string; name: string };
  year?: { _id: string; name: string };
  teacherId: string; // User ID
  createdAt: string;
  updatedAt: string;
}