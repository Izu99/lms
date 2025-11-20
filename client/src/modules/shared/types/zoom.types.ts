export interface MeetingDetails {
  title: string;
  description?: string;
  zoomLink: string;
  youtubeLink?: string;
}

export interface ZoomLinkData {
  _id: string;
  meeting: MeetingDetails; // Encapsulate meeting details
  uploadedBy: {
    _id: string;
    username: string;
  };
  institute: {
    _id: string;
    name: string;
  };
  year: {
    _id: string;
    name: string;
  };
  createdAt: string;
}
