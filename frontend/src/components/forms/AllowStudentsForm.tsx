
'use client';

import { useEffect, useState } from 'react';

interface Student {
  _id: string;
  username: string;
}

interface Video {
    _id: string;
    title: string;
}

export default function AllowStudentsForm() {
  const [students, setStudents] = useState<Student[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchStudentsAndVideos = async () => {
      try {
        const [studentsRes, videosRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/students', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch('http://localhost:5000/api/videos', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        if (!studentsRes.ok || !videosRes.ok) {
          const studentError = !studentsRes.ok ? await studentsRes.json() : null;
          const videoError = !videosRes.ok ? await videosRes.json() : null;
          setError(studentError?.message || videoError?.message || 'Failed to fetch data');
          return;
        }

        const studentsData = await studentsRes.json();
        const videosData = await videosRes.json();

        setStudents(studentsData);
        setVideos(videosData);
      } catch (error) {
        setError('Failed to fetch data');
      }
    };

    fetchStudentsAndVideos();
  }, []);

  const handleAllow = async () => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5000/api/users/allow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ studentId: selectedStudent, videoId: selectedVideo }),
      });

      if (res.ok) {
        setSuccess('Student allowed successfully');
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-96">
      <h2 className="mb-6 text-2xl font-bold">Allow Students</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {success && <p className="mb-4 text-green-500">{success}</p>}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Select Student</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.username}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Select Video</label>
        <select
          value={selectedVideo}
          onChange={(e) => setSelectedVideo(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select a video</option>
          {videos.map((video) => (
            <option key={video._id} value={video._id}>
              {video.title}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAllow}
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        disabled={!selectedStudent || !selectedVideo}
      >
        Allow
      </button>
    </div>
  );
}
