"use client";

import { useAuth } from "@/context/AuthContext";

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { user, loading } = useAuth();

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
        <button onClick={() => onNavigate("login")} className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full">
          Login / Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1810] mb-8">Settings</h1>

      <div className="space-y-4">
        {/* Account Info */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-[#2C1810] mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Name</span>
              <span className="text-sm font-medium text-[#2C1810]">{user.displayName || "Not set"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-[#2C1810]">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Account created</span>
              <span className="text-sm font-medium text-[#2C1810]">
                {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN") : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-[#2C1810] mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-[#2C1810]">Order updates on WhatsApp</p>
                <p className="text-xs text-gray-400">Get notified about your order status</p>
              </div>
              <div className="w-10 h-6 bg-[#89C4E1] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-[#2C1810]">Promotional messages</p>
                <p className="text-xs text-gray-400">New products, offers & discounts</p>
              </div>
              <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-[#2C1810] mb-4">Support</h3>
          <div className="space-y-3">
            <a href="https://wa.me/919346630240" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2 text-sm text-gray-700 hover:text-[#5EAED4] transition-colors">
              💬 Chat with us on WhatsApp
            </a>
            <a href="tel:+919346630240" className="flex items-center gap-3 py-2 text-sm text-gray-700 hover:text-[#5EAED4] transition-colors">
              📞 Call us: +91 9346630240
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
