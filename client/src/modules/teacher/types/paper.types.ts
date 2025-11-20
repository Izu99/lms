export interface Question {
  _id: string;
}

export interface PaperData {
  _id: string;
  title: string;
  description?: string;
  deadline?: string;
  timeLimit?: number;
  questions: Question[];
  submissionCount?: number;
  averageScore?: number;
  createdAt: string;
  paperType?: 'MCQ' | 'Structure'; // Added for categorization based on backend
}
