"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { Settings, User, Bell, Lock, Globe } from "lucide-react";

export default function TeacherSettingsPage() {
  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
              <Settings className="w-6 h-6 text-white" />
            </div>
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {[
            { icon: User, title: "Profile Settings", description: "Update your personal information" },
            { icon: Bell, title: "Notifications", description: "Manage notification preferences" },
            { icon: Lock, title: "Security", description: "Change password and security settings" },
            { icon: Globe, title: "Language & Region", description: "Set your language and timezone" },
          ].map((setting, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
                  <setting.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{setting.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                </div>
                <span className="text-gray-400 dark:text-gray-500">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
