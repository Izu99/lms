
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VideoPlayer from '@/components/video/VideoPlayer';

interface Video {
  title: string;
  description: string;
  filePath: string;
}

import PageLayout from '@/components/layout/PageLayout';

export default function VideoPage() {
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState('');
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/videos/${id}` , {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });

        if (res.ok) {
          const data = await res.json();
          setVideo(data);
        } else {
          const data = await res.json();
          setError(data.message);
        }
      } catch (error) {
        setError('Something went wrong');
      }
    };

    fetchVideo();
  }, [id]);

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <PageLayout>
      <div className="p-8">
        <h1 className="mb-4 text-3xl font-bold">{video.title}</h1>
        <p className="mb-4">{video.description}</p>
        <VideoPlayer src={`http://localhost:5000/${video.filePath}`} />
      </div>
    </PageLayout>
  );
}
