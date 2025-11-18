import React from "react";
import { Button } from "@/components/ui/button";
import { CoursePackageData } from "@/modules/shared/types/course-package.types";
import {
  Video,
  FileText,
  Edit,
  Trash2,
  School,
} from "lucide-react";

interface CoursePackageCardProps {
  pkg: CoursePackageData;
  onEdit: (pkg: CoursePackageData) => void;
  onDelete: (id: string) => void;
}

export function CoursePackageCard({ pkg, onEdit, onDelete }: CoursePackageCardProps) {
  return (
    <div className="theme-card p-6 flex flex-col justify-between rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1">
      <div>
        <h3 className="text-2xl font-bold theme-text-primary mb-2 leading-tight">
          {pkg.title}
        </h3>
        <p className="theme-text-secondary text-sm mb-4 line-clamp-3 min-h-[60px]">
          {pkg.description || "No description provided."}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">LKR {pkg.price.toFixed(2)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm theme-text-secondary">
          {pkg.institute && pkg.year ? (
            <div className="flex items-center gap-1">
              <School className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>
                {pkg.institute.name} - {pkg.year.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <School className="w-4 h-4 text-gray-400" />
              <span>General Package</span>
            </div>
          )}

          {pkg.availability === "all" && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full">
              Free for All
            </span>
          )}
          {pkg.availability === "physical" && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">
              Free for Physical
            </span>
          )}
        </div>

        <div className="mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm font-medium theme-text-primary mb-2">Includes:</p>
          <ul className="space-y-1 text-sm theme-text-secondary">
            <li className="flex items-center gap-2">
              <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{pkg.videos.length} Videos</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>{pkg.papers.length} Papers</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onEdit(pkg)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
        <button
          onClick={() => onDelete(pkg._id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}
