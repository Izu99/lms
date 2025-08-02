'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";


export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Student Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome, {user?.username}! Here you can view your enrolled courses and track your progress.</p>
      </CardContent>
    </Card>
  );
}
