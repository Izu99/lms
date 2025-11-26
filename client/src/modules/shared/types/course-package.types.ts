import { PaperData } from './paper.types';
import { VideoData } from './video.types';

export interface CoursePackageData {
  _id: string;
  title: string;
  description?: string;
  price: number;
  backgroundImage?: string;
  videos: (string | VideoData)[]; // Array of Video IDs or populated videos
  papers: (string | PaperData)[]; // Array of Paper IDs or populated papers
  tutes?: (string | unknown)[]; // Array of Tute IDs or populated tutes
  availability: "all" | "physical" | "paid";
  institute?: string | { _id: string; name: string }; // Institute ID or populated institute
  year?: string | { _id: string; name: string };      // Year ID or populated year
  academicLevel?: string; // Add academicLevel property
  createdBy: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

