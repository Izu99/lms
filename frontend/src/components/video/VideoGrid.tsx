'use client';

import Link from 'next/link';

export default function VideoGrid({ videos }: { videos: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video: any) => (
        <Link href={`/videos/${video._id}`} key={video._id}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
            <div className="aspect-w-16 aspect-h-9">
              <video src={`http://localhost:5000/${video.filePath}`} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-gray-600">{video.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}