import { PaperData } from './paper.types';
import { VideoData } from './video.types';

export interface CoursePackageData {
  _id: string;
  title: string;
  description?: string;
  price: number;
  videos: (string | VideoData)[]; // Array of Video IDs or populated videos
  papers: (string | PaperData)[]; // Array of Paper IDs or populated papers
  freeForPhysicalStudents: boolean;
  freeForAllInstituteYear: boolean;
  institute?: { _id: string; name: string }; // Populated Institute
  year?: { _id: string; name: string };      // Populated Year
  createdBy: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

