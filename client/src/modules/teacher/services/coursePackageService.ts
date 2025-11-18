import { api } from '@/lib/api-client';
import { CoursePackageData } from '@/modules/shared/types/course-package.types';

export class CoursePackageService {
  static async getCoursePackages(): Promise<CoursePackageData[]> {
    const response = await api.get<{ coursePackages: CoursePackageData[] }>('/course-packages');
    return response.data.coursePackages;
  }

  static async getCoursePackageById(id: string): Promise<CoursePackageData> {
    const response = await api.get<{ coursePackage: CoursePackageData }>(`/course-packages/${id}`);
    return response.data.coursePackage;
  }

  static async createCoursePackage(data: {
    title: string;
    description?: string;
    price: number;
    videos: string[];
    papers: string[];
    freeForAllInstituteYear?: boolean;
    freeForPhysicalStudents?: boolean;
    institute?: string;
    year?: string;
  }): Promise<CoursePackageData> {
    const response = await api.post<{ coursePackage: CoursePackageData }>('/course-packages', data);
    return response.data.coursePackage;
  }

  static async updateCoursePackage(id: string, data: {
    title?: string;
    description?: string;
    price?: number;
    videos?: string[];
    papers?: string[];
    freeForAllInstituteYear?: boolean;
    freeForPhysicalStudents?: boolean;
    institute?: string;
    year?: string;
  }): Promise<CoursePackageData> {
    const response = await api.put<{ coursePackage: CoursePackageData }>(`/course-packages/${id}`, data);
    return response.data.coursePackage;
  }

  static async deleteCoursePackage(id: string): Promise<void> {
    await api.delete(`/course-packages/${id}`);
  }
}
