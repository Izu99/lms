export interface ZoomLinkData {
  _id: string;
  title: string;
  description?: string;
  link: string;
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
