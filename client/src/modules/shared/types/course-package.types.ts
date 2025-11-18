import { PaperData } from './paper.types';
import { VideoData } from './video.types';

export interface CoursePackageData {
  _id: string;
  title: string;
  description?: string;
  price: number;
  videos: (string | VideoData)[]; // Array of Video IDs or populated videos
  papers: (string | PaperData)[]; // Array of Paper IDs or populated papers
  availability: "all" | "physical";
  institute?: string; // Institute ID
  year?: string;      // Year ID
  createdBy: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

