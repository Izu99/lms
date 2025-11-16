import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../types/api.types';
import { API_URL } from '../../../lib/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ApiClient {
  static async get<T>(url: string): Promise<T> {
    const response = await api.get<any>(url);
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      return response.data.data as T;
    }
    return response.data as T;
  }

  static async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await api.post<ApiResponse<T>>(url, data);
    return response.data.data!;
  }

  static async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await api.put<ApiResponse<T>>(url, data);
    return response.data.data!;
  }

  static async delete<T>(url: string): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data.data!;
  }

  static async upload<T>(url: string, formData: FormData): Promise<T> {
    const response = await api.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  }
}

export default api;