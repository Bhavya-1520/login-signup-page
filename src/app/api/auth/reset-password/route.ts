import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin with project ID
// For password reset to work, we need the admin SDK
if (getApps().length === 0) {
  // Try to use service account if available, otherwise use project ID
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({
      credential: cert(serviceAccount),
      projectId,
    });
  } else {
    initializeApp({
      projectId,
    });
  }
}

const adminAuth = getAuth();

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Get user by email and update password
    const userRecord = await adminAuth.getUserByEmail(email);
    await adminAuth.updateUser(userRecord.uid, { password: newPassword });

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    console.error("Password reset error:", error.code, error.message);
    
    if (error.code === "auth/user-not-found") {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }
    if (error.code === "app/no-app" || error.message?.includes("credential")) {
      return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to reset password. Please try again." }, { status: 500 });
  }
}
