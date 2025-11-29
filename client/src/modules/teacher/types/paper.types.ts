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
  paperType?: 'MCQ' | 'Structure-Essay';
  institute?: {
    _id: string;
    name: string;
    location: string;
  };
  year?: {
    _id: string;
    year: number;
    name: string;
  };
  thumbnailUrl?: string;
}
