"use client";

import { useState } from "react";
import EmailAuth from "./auth/EmailAuth";
import SocialAuth from "./auth/SocialAuth";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-[#2C1810]">
            {mode === "login" ? "Welcome back" : "Join Loom & Bloom"}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === "login"
              ? "Sign in to your account"
              : "Create an account to start ordering"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
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
                className="text-[#8B5E3C] font-medium hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-[#8B5E3C] font-medium hover:underline"
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
