export interface VideoData {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  views?: number;
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
  createdAt: string;
}
