
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function VideoCard({ video, onDelete }) {
    const { user } = useAuth();

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await fetch(`http://localhost:5000/api/videos/${video._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            onDelete(video._id);
        } catch (error) {
            console.error('Failed to delete video', error);
        }
    };

    return (
        <div className="block p-4 border rounded-md hover:bg-gray-100">
            <Link href={`/videos/${video._id}`} >
                <h3 className="text-lg font-bold">{video.title}</h3>
            </Link>
            {user?.role === 'teacher' && (
                <Button onClick={handleDelete} variant="destructive" className="mt-2">
                    Delete
                </Button>
            )}
        </div>
    );
}
