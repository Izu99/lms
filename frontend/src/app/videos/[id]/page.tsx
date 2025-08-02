'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function VideoPage({ params }: { params: { id: string } }) {
  const [video, setVideo] = useState<any>(null);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/videos/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setVideo(data);
        } else {
          const data = await res.json();
          setError(data.message || 'Failed to fetch video');
        }
      } catch (error) {
        setError('Something went wrong. Please try again.');
      }
    };

    if (token) {
      fetchVideo();
    }
  }, [token, params.id]);

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <div className="aspect-w-16 aspect-h-9">
        <video src={`http://localhost:5000/${video.filePath}`} controls className="w-full h-full object-cover" />
      </div>
      <p className="mt-4 text-gray-600">{video.description}</p>
    </div>
  );
}