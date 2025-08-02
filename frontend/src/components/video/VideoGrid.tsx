
import { useState, useEffect } from 'react';
import VideoCard from './VideoCard';

export default function VideoGrid({ videos: initialVideos }) {
    const [videos, setVideos] = useState(initialVideos);

    useEffect(() => {
        setVideos(initialVideos);
    }, [initialVideos]);

    const handleDelete = (deletedVideoId) => {
        setVideos(videos.filter((video) => video._id !== deletedVideoId));
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
                <VideoCard key={video._id} video={video} onDelete={handleDelete} />
            ))}
        </div>
    );
}
