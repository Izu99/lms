export interface YearData {
  _id: string;
  name: string;
  institute?: { _id: string; name: string }; // Optional, if year is tied to an institute
  createdAt: string;
  updatedAt: string;
}