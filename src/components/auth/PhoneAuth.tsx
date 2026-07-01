"use client";

import { useState, useEffect, useRef } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function PhoneAuth() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [countdown, setCountdown] = useState(0);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved
        },
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic phone number validation
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone.startsWith("+")) {
      setError("Please include country code (e.g., +1 for US, +91 for India)");
      return;
    }

    if (cleanPhone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, cleanPhone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setCountdown(60); // 60 second countdown for resend
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        "auth/invalid-phone-number": "Invalid phone number format",
        "auth/too-many-requests": "Too many attempts. Please try again later",
        "auth/quota-exceeded": "SMS quota exceeded. Please try again later",
      };
      setError(errorMessages[err.code] || err.message || "Failed to send OTP");
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined as any;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      setError("Please request a new OTP");
      return;
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      // Auth state will be updated automatically via onAuthStateChanged
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        "auth/invalid-verification-code": "Invalid OTP. Please try again",
        "auth/code-expired": "OTP has expired. Please request a new one",
      };
      setError(errorMessages[err.code] || err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtpSent(false);
    setOtp("");
    setConfirmationResult(null);
    // Reset reCAPTCHA
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined as any;
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!otpSent ? (
        // Phone number input form
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 9876543210"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include country code (e.g., +91 for India, +1 for US)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        // OTP verification form
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            OTP sent to <span className="font-medium">{phoneNumber}</span>
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              required
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 text-center text-2xl tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in <span className="font-medium">{countdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      )}

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
    </div>
  );
}
