"use client";

import { useState } from "react";
import EmailAuth from "./auth/EmailAuth";
import SocialAuth from "./auth/SocialAuth";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === "login"
              ? "Sign in to your account"
              : "Sign up to get started"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Email/Password Form */}
          <EmailAuth mode={mode} />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Google Sign In */}
          <SocialAuth />
        </div>

        {/* Toggle Login/Signup */}
        <p className="text-center mt-6 text-gray-600">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
