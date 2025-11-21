import { api as ApiClient } from '@/lib/api-client';
import { CoursePackageData } from '../../shared/types/course-package.types';

export class CoursePackageService {
  static async getCoursePackages(): Promise<CoursePackageData[]> {
    const response = await ApiClient.get<{ coursePackages: CoursePackageData[] }>('/course-packages');
    return response.data.coursePackages || [];
  }

  static async getCoursePackageById(id: string): Promise<CoursePackageData> {
    const response = await ApiClient.get<{ coursePackage: CoursePackageData }>(`/course-packages/${id}`);
    return response.data.coursePackage;
  }

  static async createCoursePackage(packageData: FormData): Promise<CoursePackageData> {
    const response = await ApiClient.post<{ coursePackage: CoursePackageData }>(
      '/course-packages',
      packageData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.coursePackage;
  }

  static async updateCoursePackage(id: string, packageData: FormData): Promise<CoursePackageData> {
    const response = await ApiClient.put<{ coursePackage: CoursePackageData }>(
      `/course-packages/${id}`,
      packageData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.coursePackage;
  }

  static async deleteCoursePackage(id: string): Promise<void> {
    await ApiClient.delete<void>(`/course-packages/${id}`);
  }
}
