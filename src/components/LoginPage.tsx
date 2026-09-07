"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  signInWithCustomToken,
} from "firebase/auth";

type AuthMode = "login" | "signup" | "forgot";
type SignupStep = "email" | "otp" | "password";
type ForgotStep = "email" | "otp" | "password" | "success";

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [signupStep, setSignupStep] = useState<SignupStep>("email");
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Google state
  const [googleError, setGoogleError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [forgotConfirm, setForgotConfirm] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields");
      return;
    }

    setLoginLoading(true);
    try {
      const { auth } = await import("@/lib/firebase");
      if (!auth) return;
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: any) {
      const msgs: Record<string, string> = {
        "auth/user-not-found": "No account found with this email",
        "auth/wrong-password": "Incorrect password",
        "auth/invalid-email": "Invalid email address",
        "auth/invalid-credential": "Invalid email or password",
        "auth/too-many-requests": "Too many attempts. Try again later",
      };
      setLoginError(msgs[err.code] || "Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // --- GOOGLE SIGN IN ---
  const handleGoogle = async () => {
    setGoogleError("");
    setGoogleLoading(true);
    try {
      const { auth, googleProvider } = await import("@/lib/firebase");
      if (auth && googleProvider) {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err: any) {
      setGoogleError(err.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // --- FORGOT PASSWORD: Send OTP ---
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotError("Please enter a valid email address");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForgotStep("otp");
    } catch (err: any) {
      setForgotError(err.message || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  // --- FORGOT PASSWORD: Verify OTP ---
  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotOtp || forgotOtp.length !== 6) {
      setForgotError("Please enter the 6-digit OTP");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForgotStep("password");
    } catch (err: any) {
      setForgotError(err.message || "Invalid OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  // --- FORGOT PASSWORD: Reset Password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (forgotPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }
    if (forgotPassword !== forgotConfirm) {
      setForgotError("Passwords do not match");
      return;
    }
    setForgotLoading(true);
    try {
      // Sign in with email first, then update password
      const { auth } = await import("@/lib/firebase");
      if (!auth) return;

      // Use admin API to reset password
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, newPassword: forgotPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Send email notification
      try {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "password-reset",
            to: forgotEmail,
            data: { email: forgotEmail },
          }),
        });
      } catch {}

      setForgotStep("success");
    } catch (err: any) {
      setForgotError(err.message || "Failed to reset password");
    } finally {
      setForgotLoading(false);
    }
  };

  // --- SIGNUP: Send OTP ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!signupEmail || !signupEmail.includes("@")) {
      setSignupError("Please enter a valid email address");
      return;
    }

    setSignupLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(true);
      setSignupStep("otp");
    } catch (err: any) {
      setSignupError(err.message || "Failed to send OTP");
    } finally {
      setSignupLoading(false);
    }
  };

  // --- SIGNUP: Verify OTP ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!otp || otp.length !== 6) {
      setSignupError("Please enter the 6-digit OTP");
      return;
    }

    setSignupLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // OTP verified, move to password step
      setSignupStep("password");
    } catch (err: any) {
      setSignupError(err.message || "Invalid OTP");
    } finally {
      setSignupLoading(false);
    }
  };

  // --- SIGNUP: Set Password & Create Account ---
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    setSignupLoading(true);
    try {
      const { auth } = await import("@/lib/firebase");
      if (!auth) return;
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);

      // Send welcome email
      try {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "welcome",
            to: signupEmail,
            data: { email: signupEmail, password: signupPassword },
          }),
        });
      } catch {}
    } catch (err: any) {
      const msgs: Record<string, string> = {
        "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
        "auth/weak-password": "Password is too weak",
      };
      setSignupError(msgs[err.code] || "Failed to create account");
    } finally {
      setSignupLoading(false);
    }
  };

  // If user is logged in, show success and redirect
  if (user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="font-display text-2xl font-bold text-[#2C1810] mb-2">Welcome!</h2>
          <p className="text-gray-500 mb-6">You are logged in as {user.email}</p>
          <button
            onClick={() => onNavigate?.("home")}
            className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Start Shopping →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-br from-[#E3F4FC] via-[#FDF2F8] to-[#F0F9FF]">
      {/* Decorative floating elements */}
      <div className="absolute top-10 left-[8%] text-3xl opacity-30 animate-float">🌸</div>
      <div className="absolute top-24 right-[12%] text-2xl opacity-25 animate-float-slow">🌷</div>
      <div className="absolute bottom-16 left-[15%] text-2xl opacity-25 animate-float">✿</div>
      <div className="absolute bottom-24 right-[8%] text-3xl opacity-30 animate-float-slow">💐</div>
      <div className="absolute top-1/2 left-[5%] text-xl opacity-20 animate-float">🌼</div>

      <div className="max-w-sm w-full relative z-10">
        {/* Logo + Name */}
        <div className="flex flex-col items-center mb-2">
          <img
            src="/images/House_of_gnapakam_logo.jpeg"
            alt="The House Of Gnapakam"
            className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-[#F8C8DC]/50 mb-2"
          />
          <span className="text-[11px] font-elegant tracking-[0.3em] text-[#89C4E1] uppercase">The House Of</span>
          <span className="brand-name text-3xl">Gnapakam</span>
        </div>

        {/* Welcome line */}
        <p className="text-center text-[#5EAED4] font-medium text-sm mb-6">
          ✨ Welcome to The House Of Gnapakam ✨
        </p>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="font-display text-xl font-bold text-[#2C1810]">
            {mode === "login" ? "Welcome Back" : mode === "forgot" ? "Reset Password" : "Create Account"}
          </h1>
          <p className="text-gray-500 mt-1 text-xs">
            {mode === "login" ? "Sign in to continue shopping" : mode === "forgot" ? "" : "Sign up to start ordering"}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-lg">
          {/* ========== LOGIN MODE ========== */}
          {mode === "login" && (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email" value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@gmail.com" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password" value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
                  />
                </div>

                <button
                  type="submit" disabled={loginLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loginLoading ? "Signing in..." : "Sign In"}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode("forgot"); setForgotStep("email"); setForgotError(""); }}
                  className="w-full text-sm text-[#5EAED4] font-medium hover:underline mt-2"
                >
                  Forgot Password?
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/75 text-gray-400">or</span>
                </div>
              </div>

              {/* Google Sign In */}
              {googleError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-3">
                  {googleError}
                </div>
              )}
              <button
                onClick={handleGoogle} disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-gray-700 font-medium">
                  {googleLoading ? "Signing in..." : "Sign in with Google"}
                </span>
              </button>
            </>
          )}

          {/* ========== SIGNUP MODE ========== */}
          {mode === "signup" && (
            <>
              {/* Step 1: Email */}
              {signupStep === "email" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {signupError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {signupError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                    <input
                      type="email" value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@gmail.com" required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
                    />
                    <p className="text-xs text-gray-400 mt-1">We&apos;ll send a 6-digit OTP to verify</p>
                  </div>

                  <button
                    type="submit" disabled={signupLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {signupLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {signupStep === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {signupError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {signupError}
                    </div>
                  )}

                  <div className="text-center mb-2">
                    <span className="text-4xl block mb-2">🔐</span>
                    <p className="text-sm text-gray-600">OTP sent to <strong>{signupEmail}</strong></p>
                    <p className="text-xs text-gray-400 mt-1">Check your inbox (and spam folder)</p>
                  </div>

                  <div>
                    <input
                      type="text" inputMode="numeric" maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000" required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 text-center text-2xl tracking-[0.5em] font-mono"
                    />
                  </div>

                  <button
                    type="submit" disabled={signupLoading || otp.length !== 6}
                    className="w-full py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {signupLoading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <div className="flex justify-between text-sm">
                    <button type="button" onClick={() => { setSignupStep("email"); setOtp(""); setSignupError(""); }} className="text-[#5EAED4] hover:underline">
                      ← Change email
                    </button>
                    <button type="button" onClick={handleSendOtp} className="text-gray-500 hover:underline">
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Set Password */}
              {signupStep === "password" && (
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  {signupError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {signupError}
                    </div>
                  )}

                  <div className="text-center mb-2">
                    <span className="text-4xl block mb-2">✅</span>
                    <p className="text-sm text-gray-600">Email verified! Now set your password.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                    <input
                      type="password" value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Minimum 6 characters" required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
                    />
                  </div>

                  <button
                    type="submit" disabled={signupLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {signupLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>
              )}

              {/* Google option for signup too */}
              {signupStep === "email" && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/75 text-gray-400">or</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGoogle} disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      {googleLoading ? "Signing up..." : "Sign up with Google"}
                    </span>
                  </button>
                </>
              )}
            </>
          )}

          {/* ========== FORGOT PASSWORD MODE ========== */}
          {mode === "forgot" && (
            <>
              {/* Step 1: Enter Email */}
              {forgotStep === "email" && (
                <form onSubmit={handleForgotSendOtp} className="space-y-4">
                  {forgotError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{forgotError}</div>
                  )}
                  <div className="text-center mb-2">
                    <span className="text-4xl block mb-2">🔑</span>
                    <p className="text-sm text-gray-600">Enter your email to reset password</p>
                  </div>
                  <input
                    type="email" value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@gmail.com" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
                  />
                  <button type="submit" disabled={forgotLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                    {forgotLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                  <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-gray-500 hover:underline">
                    ← Back to Login
                  </button>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {forgotStep === "otp" && (
                <form onSubmit={handleForgotVerifyOtp} className="space-y-4">
                  {forgotError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{forgotError}</div>
                  )}
                  <div className="text-center mb-2">
                    <span className="text-4xl block mb-2">🔐</span>
                    <p className="text-sm text-gray-600">OTP sent to <strong>{forgotEmail}</strong></p>
                  </div>
                  <input
                    type="text" inputMode="numeric" maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 text-center text-2xl tracking-[0.5em] font-mono"
                  />
                  <button type="submit" disabled={forgotLoading || forgotOtp.length !== 6}
                    className="w-full py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                    {forgotLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button type="button" onClick={handleForgotSendOtp} className="w-full text-sm text-gray-500 hover:underline">
                    Resend OTP
                  </button>
                </form>
              )}

              {/* Step 3: Set New Password */}
              {forgotStep === "password" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {forgotError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{forgotError}</div>
                  )}
                  <div className="text-center mb-2">
                    <span className="text-4xl block mb-2">✅</span>
                    <p className="text-sm text-gray-600">OTP verified! Set your new password.</p>
                  </div>
                  <input
                    type="password" value={forgotPassword}
                    onChange={(e) => setForgotPassword(e.target.value)}
                    placeholder="New password (min 6 chars)" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
                  />
                  <input
                    type="password" value={forgotConfirm}
                    onChange={(e) => setForgotConfirm(e.target.value)}
                    placeholder="Confirm new password" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
                  />
                  <button type="submit" disabled={forgotLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}

              {/* Step 4: Success */}
              {forgotStep === "success" && (
                <div className="text-center py-4">
                  <span className="text-5xl block mb-4">🎉</span>
                  <h3 className="font-display text-xl font-bold text-[#2C1810] mb-2">Password Reset Successful!</h3>
                  <p className="text-gray-500 text-sm mb-6">Your password has been changed. You can now login with your new password.</p>
                  <button
                    onClick={() => { setMode("login"); setLoginEmail(forgotEmail); }}
                    className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-lg transition-all"
                  >
                    Go to Login
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Toggle Login/Signup */}
        <p className="text-center mt-6 text-gray-500 text-sm">
          {mode === "login" && (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => { setMode("signup"); setSignupStep("email"); setSignupError(""); }} className="text-[#5EAED4] font-medium hover:underline">
                Sign up
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button onClick={() => { setMode("login"); setLoginError(""); }} className="text-[#5EAED4] font-medium hover:underline">
                Sign in
              </button>
            </>
          )}
          {mode === "forgot" && forgotStep !== "success" && (
            <>
              Remember your password?{" "}
              <button onClick={() => { setMode("login"); setForgotError(""); }} className="text-[#5EAED4] font-medium hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
