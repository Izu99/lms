import React from "react";
import { Video, FileText, Edit, Trash2, School, Eye } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { getFileUrl } from "@/lib/fileUtils";
import { useRouter } from "next/navigation";
import { CoursePackageData } from "@/modules/shared/types/course-package.types";


interface CoursePackageCardProps {
  pkg: CoursePackageData;
  onEdit: (pkg: CoursePackageData) => void;
  onDelete: (id: string) => void;
}

export function CoursePackageCard({ pkg, onEdit, onDelete }: CoursePackageCardProps) {
  const router = useRouter();
  // Default cosmic background image
  const defaultBackground = "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80";
  const backgroundImage = pkg.backgroundImage ? getFileUrl(pkg.backgroundImage, 'image') : defaultBackground;

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt={pkg.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultBackground;
          }}
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full p-6 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-3xl font-bold text-white leading-tight">
            {pkg.title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 min-h-[80px]">
            {pkg.description || "No description provided."}
          </p>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-gray-400 text-xl font-medium">LKR</span>
            <span className="text-3xl font-bold text-green-400">
              {pkg.price.toFixed(2)}
            </span>
          </div>

          {/* Availability Badge */}
          <div className="flex items-center space-x-4">
            {pkg.availability === "all" && (
              <span className="bg-green-500/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                Free for All
              </span>
            )}
            {pkg.availability === "physical" && (
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                Free for Physical
              </span>
            )}
            {pkg.availability === "paid" && (
              <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full">
                Premium
              </span>
            )}
          </div>

          {/* Institute & Year */}
          {pkg.institute && typeof pkg.institute !== 'string' && pkg.year && typeof pkg.year !== 'string' ? (
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <School className="w-4 h-4" />
              For {pkg.institute.name} - {pkg.year.name}
            </p>
          ) : (
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <School className="w-4 h-4" />
              General Package
            </p>
          )}

          {/* Includes Section */}
          <div className="space-y-2 text-gray-200">
            <h4 className="font-semibold text-white">Includes:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-400" />
                <span>{pkg.videos.length} Videos</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <span>{pkg.papers.length} Papers</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => router.push(`/teacher/course-packages/${pkg._id}`)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg"
            title="View Details"
          >
            <Eye className="w-4 h-4" /> View
          </button>
          <button
            onClick={() => onEdit(pkg)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-all duration-200 text-sm font-medium border border-white/20"
            title="Edit"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => onDelete(pkg._id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/80 hover:bg-red-700/80 backdrop-blur-md text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Demo component
export default function CoursePackageDemo() {
  const samplePackage: CoursePackageData = {
    _id: "1",
    title: "ICT Lesson Package",
    description: "This is a comprehensive package for theory students covering all fundamental ICT concepts with detailed video explanations and practice papers.",
    price: 200.00,
    availability: "all",
    institute: { _id: "inst1", name: "Dakma" },
    year: { _id: "year1", name: "2020" },
    videos: [],
    papers: [],
    createdBy: { _id: "user1", username: "teacher" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    backgroundImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80"
  };

  const handleEdit = (pkg: CoursePackageData) => {
    console.log("Edit package:", pkg);
    alert(`Editing: ${pkg.title}`);
  };

  const handleDelete = (id: string) => {
    console.log("Delete package:", id);
    alert(`Delete package ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-md mx-auto">
        <CoursePackageCard
          pkg={samplePackage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}