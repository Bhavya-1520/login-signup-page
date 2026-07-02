"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";

function AuthSwitch() {
  const { user, loading } = useAuth();

  // Show the login page immediately while checking auth status
  // This prevents the blank loading screen
  if (loading) {
    return <LoginPage />;
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
