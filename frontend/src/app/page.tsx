
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to the LMS</h1>
      <div className="space-x-4">
        <Link href="/login" className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Login
        </Link>
        <Link href="/register" className="px-6 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700">
          Register
        </Link>
      </div>
    </div>
  );
}
