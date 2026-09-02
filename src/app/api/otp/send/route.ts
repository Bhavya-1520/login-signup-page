import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import otpStore from "@/lib/otpStore";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in memory with 5-minute expiry
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"The House Of Gnapakam" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Login OTP - The House Of Gnapakam",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 30px; text-align: center;">
          <h2 style="color: #2C3E50;">The House Of Gnapakam</h2>
          <p style="color: #555;">Your verification code is:</p>
          <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h1 style="color: #5EAED4; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #888; font-size: 12px;">This code expires in 5 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch (error: any) {
    console.error("OTP send error:", error.message);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }
}
