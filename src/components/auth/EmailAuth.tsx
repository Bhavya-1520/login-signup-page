"use client";

import { useState } from "react";
import { signInWithCustomToken } from "firebase/auth";

interface EmailAuthProps {
  mode: "login" | "signup";
}

export default function EmailAuth({ mode }: EmailAuthProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      // Sign in with the custom token
      const { auth } = await import("@/lib/firebase");
      if (auth && data.token) {
        await signInWithCustomToken(auth, data.token);
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  if (otpSent) {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="text-center mb-2">
          <span className="text-4xl block mb-2">🔐</span>
          <p className="text-sm text-gray-600">
            OTP sent to <strong className="text-[#2C1810]">{email}</strong>
          </p>
          <p className="text-xs text-gray-400 mt-1">Check your email inbox (and spam folder)</p>
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Enter 6-digit OTP
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none transition-all text-gray-900 text-center text-2xl tracking-[0.5em] font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={verifying || otp.length !== 6}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? "Verifying..." : "Verify & Login"}
        </button>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
            className="text-sm text-[#5EAED4] font-medium hover:underline"
          >
            ← Change email
          </button>
          <button
            type="button"
            onClick={handleSendOtp}
            className="text-sm text-gray-500 font-medium hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@gmail.com"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none transition-all text-gray-900"
        />
        <p className="text-xs text-gray-400 mt-1">We&apos;ll send a 6-digit OTP to verify your email</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );
}
