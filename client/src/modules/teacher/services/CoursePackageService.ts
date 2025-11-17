import { api as ApiClient } from '@/lib/api-client';
import { CoursePackageData } from '../../shared/types/course-package.types';

export class CoursePackageService {
  static async getCoursePackages(): Promise<CoursePackageData[]> {
    const response = await ApiClient.get<{ coursePackages: CoursePackageData[] }>('/course-packages');
    return response.data.coursePackages || [];
  }

  static async getCoursePackageById(id: string): Promise<CoursePackageData> {
    const response = await ApiClient.get<{ coursePackage: CoursePackageData }>(`/course-packages/${id}`);
    return response.coursePackage;
  }

  static async createCoursePackage(
    title: string,
    description: string,
    price: number,
    videos: string[],
    papers: string[],
    freeForPhysicalStudents: boolean,
    freeForAllInstituteYear: boolean,
    institute?: string,
    year?: string
  ): Promise<CoursePackageData> {
    const response = await ApiClient.post<{ coursePackage: CoursePackageData }>(
      '/course-packages',
      {
        title,
        description,
        price,
        videos,
        papers,
        freeForPhysicalStudents,
        freeForAllInstituteYear,
        institute,
        year,
      }
    );
    return response.coursePackage;
  }

  static async updateCoursePackage(
    id: string,
    title: string,
    description: string,
    price: number,
    videos: string[],
    papers: string[],
    freeForPhysicalStudents: boolean,
    freeForAllInstituteYear: boolean,
    institute?: string,
    year?: string
  ): Promise<CoursePackageData> {
    const response = await ApiClient.put<{ coursePackage: CoursePackageData }>(
      `/course-packages/${id}`,
      {
        title,
        description,
        price,
        videos,
        papers,
        freeForPhysicalStudents,
        freeForAllInstituteYear,
        institute,
        year,
      }
    );
    return response.coursePackage;
  }

  static async deleteCoursePackage(id: string): Promise<void> {
    await ApiClient.delete(`/course-packages/${id}`);
  }
}
