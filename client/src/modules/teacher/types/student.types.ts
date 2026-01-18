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
  institute?: { _id: string; name: string; location?: string };
  year?: { _id: string; name: string; year?: number };
  academicLevel?: string;
  studentType?: string;
  createdAt: string;
}
