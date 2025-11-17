import { Types } from 'mongoose';

export interface CoursePackageData {
  _id: string;
  title: string;
  description?: string;
  price: number;
  videos: string[]; // Array of Video IDs
  papers: string[]; // Array of Paper IDs
  freeForPhysicalStudents: boolean;
  freeForAllInstituteYear: boolean;
  institute?: { _id: string; name: string }; // Populated Institute
  year?: { _id: string; name: string };      // Populated Year
  createdBy: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}
