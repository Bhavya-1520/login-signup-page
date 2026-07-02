"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";

function AuthSwitch() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return <LoginPage />;
}

export default function AppContent() {
  return (
    <AuthProvider>
      <AuthSwitch />
    </AuthProvider>
  );
}
