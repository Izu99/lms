export interface StudentData {
  _id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  status?: string;
  completedPapers?: number;
  averageScore?: number;
  createdAt: string;
}
