"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AccountPageProps {
  onNavigate: (page: string) => void;
}

export default function AccountPage({ onNavigate }: AccountPageProps) {
  const { user, loading, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    phone: "",
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({ ...prev, name: user.displayName || "" }));
      // Load extra profile from Firestore
      if (db) {
        getDoc(doc(db, "profiles", user.uid)).then((snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setProfile({
              name: data.name || user.displayName || "",
              gender: data.gender || "",
              phone: data.phone || "",
              dob: data.dob || "",
            });
          }
        }).catch(() => {});
      }
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // Validate phone: must be exactly 10 digits
    if (profile.phone && !/^\d{10}$/.test(profile.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setSaving(true);
    try {
      // Update Firebase Auth display name (this always works)
      const { auth } = await import("@/lib/firebase");
      if (auth?.currentUser) {
        await updateProfile(auth.currentUser, { displayName: profile.name });
      }

      // Save extra info to Firestore
      const { db } = await import("@/lib/firebase");
      if (db) {
        await setDoc(doc(db, "profiles", user.uid), {
          name: profile.name,
          gender: profile.gender,
          phone: profile.phone,
          dob: profile.dob,
          email: user.email,
          updatedAt: new Date(),
        }, { merge: true });
      }

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("Profile save error:", err.code, err.message);
      // Even if Firestore fails, the name was saved to Auth — show partial success
      if (err.code === "permission-denied") {
        alert("Could not save extra details (database permission). Your name was updated. Please check Firestore rules.");
        setEditing(false);
      } else {
        alert("Failed to save profile: " + (err.message || "Unknown error"));
      }
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🔐</span>
        <h2 className="font-display text-3xl font-bold text-[#2C1810] mb-4">Login Required</h2>
        <p className="text-gray-600 mb-8">Please login to view your account.</p>
        <button onClick={() => onNavigate("login")} className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full">
          Login / Sign Up
        </button>
      </div>
    );
  }

  const initial = (profile.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1810] mb-8">My Account</h1>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#89C4E1] to-[#F8C8DC] text-white font-bold text-2xl flex items-center justify-center shadow-lg">
              {initial}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#2C1810]">{profile.name || "User"}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-[#5EAED4] font-medium hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm mb-4">
            ✅ Profile saved successfully!
          </div>
        )}

        {/* Profile Info */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Full Name</span>
            {editing ? (
              <input
                type="text" value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
              />
            ) : (
              <span className="text-sm font-medium text-[#2C1810]">{profile.name || "Not set"}</span>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Email</span>
            <span className="text-sm font-medium text-[#2C1810]">{user.email}</span>
          </div>

          {/* Gender */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Gender</span>
            {editing ? (
              <div className="flex gap-4">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio" name="gender" value={g}
                      checked={profile.gender === g}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      className="w-4 h-4 accent-[#89C4E1]"
                    />
                    <span className="text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
            ) : (
              <span className="text-sm font-medium text-[#2C1810]">{profile.gender || "Not set"}</span>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Phone</span>
            {editing ? (
              <input
                type="tel" inputMode="numeric" maxLength={10} value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                placeholder="10-digit number"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
              />
            ) : (
              <span className="text-sm font-medium text-[#2C1810]">{profile.phone || "Not set"}</span>
            )}
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Date of Birth</span>
            {editing ? (
              <input
                type="date" value={profile.dob}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900"
              />
            ) : (
              <span className="text-sm font-medium text-[#2C1810]">
                {profile.dob ? new Date(profile.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Not set"}
              </span>
            )}
          </div>
        </div>

        {/* Save / Cancel buttons */}
        {editing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave} disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full text-sm hover:shadow-lg disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-full text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate("orders")}
          className="w-full glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all text-left"
        >
          <span className="text-2xl">📦</span>
          <div>
            <p className="font-medium text-[#2C1810]">My Orders</p>
            <p className="text-xs text-gray-400">Track, return, or buy things again</p>
          </div>
          <span className="ml-auto text-gray-300">›</span>
        </button>

        <button
          onClick={() => onNavigate("addresses")}
          className="w-full glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all text-left"
        >
          <span className="text-2xl">📍</span>
          <div>
            <p className="font-medium text-[#2C1810]">Saved Addresses</p>
            <p className="text-xs text-gray-400">Manage your delivery addresses</p>
          </div>
          <span className="ml-auto text-gray-300">›</span>
        </button>

        <button
          onClick={() => onNavigate("bank-details")}
          className="w-full glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all text-left"
        >
          <span className="text-2xl">🏦</span>
          <div>
            <p className="font-medium text-[#2C1810]">Bank & UPI Details</p>
            <p className="text-xs text-gray-400">For order refunds</p>
          </div>
          <span className="ml-auto text-gray-300">›</span>
        </button>

        <button
          onClick={() => onNavigate("settings")}
          className="w-full glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all text-left"
        >
          <span className="text-2xl">⚙️</span>
          <div>
            <p className="font-medium text-[#2C1810]">Settings</p>
            <p className="text-xs text-gray-400">Notifications, privacy & preferences</p>
          </div>
          <span className="ml-auto text-gray-300">›</span>
        </button>

        <button
          onClick={() => onNavigate("contact")}
          className="w-full glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all text-left"
        >
          <span className="text-2xl">💬</span>
          <div>
            <p className="font-medium text-[#2C1810]">Help & Support</p>
            <p className="text-xs text-gray-400">Contact us for any issues</p>
          </div>
          <span className="ml-auto text-gray-300">›</span>
        </button>

        <button
          onClick={logout}
          className="w-full glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all text-left"
        >
          <span className="text-2xl">🚪</span>
          <div>
            <p className="font-medium text-red-500">Logout</p>
            <p className="text-xs text-gray-400">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
}
