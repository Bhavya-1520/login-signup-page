import { NextRequest, NextResponse } from "next/server";
import otpStore from "@/lib/otpStore";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // Get stored OTP
    const stored = otpStore.get(email);

    if (!stored) {
      return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 400 });
    }

    // Check expiry
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // Verify OTP
    if (stored.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP. Please check and try again." }, { status: 400 });
    }

    // OTP is correct — delete it
    otpStore.delete(email);

    return NextResponse.json({ success: true, verified: true });
  } catch (error: any) {
    console.error("OTP verify error:", error.message);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
