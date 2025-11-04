"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_URL } from "@/lib/constants";

interface User {
  username: string;
  role: "student" | "teacher" | "admin";
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Try to get fresh user data from backend
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser({
        username: response.data.user.username,
        role: response.data.user.role
      });
    } catch (error) {
      // If API fails, try to get from localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // If no saved user, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return { user, loading, logout, checkAuth };
};
