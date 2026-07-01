"use client";

import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user?.displayName?.[0] || user?.email?.[0] || user?.phoneNumber?.[0] || "U"}
              </span>
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
          <p className="text-gray-600 mt-1">
            {user?.displayName || user?.email || user?.phoneNumber}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
          <p><span className="font-medium">UID:</span> {user?.uid}</p>
          {user?.email && <p><span className="font-medium">Email:</span> {user.email}</p>}
          {user?.phoneNumber && <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>}
          <p><span className="font-medium">Provider:</span> {user?.providerData[0]?.providerId}</p>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
