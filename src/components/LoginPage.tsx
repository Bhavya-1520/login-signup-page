"use client";

import { useState } from "react";
import EmailAuth from "./auth/EmailAuth";
import SocialAuth from "./auth/SocialAuth";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background decorations */}
      <div className="absolute top-10 left-[10%] text-3xl opacity-20 animate-float">🌸</div>
      <div className="absolute bottom-10 right-[10%] text-4xl opacity-15 animate-float-slow">🌷</div>
      <div className="absolute top-20 right-[20%] text-2xl opacity-20 animate-float">✿</div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🌸</span>
          <h1 className="font-display text-3xl font-bold text-[#3D2B1F]">
            {mode === "login" ? "Welcome Back" : "Join Loom & Bloom"}
          </h1>
          <p className="text-gray-500 mt-2">
            {mode === "login"
              ? "Sign in to continue shopping"
              : "Create an account to start ordering"}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <EmailAuth mode={mode} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/75 text-gray-400">or</span>
            </div>
          </div>

          <SocialAuth />
        </div>

        <p className="text-center mt-6 text-gray-500">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("signup")} className="text-[#C77DA5] font-medium hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-[#C77DA5] font-medium hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
