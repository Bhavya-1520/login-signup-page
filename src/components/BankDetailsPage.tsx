"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getUpiDetails, addUpiDetail, updateUpiDetail, deleteUpiDetail, UpiDetail,
  isValidUpiFormat,
} from "@/lib/bankDetails";

interface BankDetailsPageProps {
  onNavigate: (page: string) => void;
}

export default function BankDetailsPage({ onNavigate }: BankDetailsPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [upis, setUpis] = useState<UpiDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // UPI form
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [upiInput, setUpiInput] = useState("");
  const [verifyingUpi, setVerifyingUpi] = useState(false);
  const [upiError, setUpiError] = useState("");

  // Live format validity for the green tick as the user types
  const formatValid = isValidUpiFormat(upiInput.trim());

  useEffect(() => {
    if (user) {
      getUpiDetails(user.uid)
        .then((u) => { setUpis(u); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleAddUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpiError("");

    const upiId = upiInput.trim();
    if (!isValidUpiFormat(upiId)) {
      setUpiError("Invalid UPI format. It should look like name@okhdfcbank");
      return;
    }

    setVerifyingUpi(true);
    try {
      const res = await fetch("/api/upi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId }),
      });
      const data = await res.json();

      // Save to Firebase regardless, storing the verified flag
      const id = await addUpiDetail({ userId: user.uid, upiId, verified: !!data.verified });
      setUpis((prev) => [...prev, { id, userId: user.uid, upiId, verified: !!data.verified }]);

      if (!data.verified) {
        setUpiError(data.error || "Could not verify this UPI ID. Please double-check it.");
      }
      setUpiInput("");
      setShowUpiForm(false);
    } catch {
      setUpiError("Verification failed. Please try again.");
    }
    setVerifyingUpi(false);
  };

  const handleReverifyUpi = async (upi: UpiDetail) => {
    if (!upi.id) return;
    try {
      const res = await fetch("/api/upi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId: upi.upiId }),
      });
      const data = await res.json();
      await updateUpiDetail(upi.id, { verified: !!data.verified });
      setUpis((prev) => prev.map((u) => u.id === upi.id ? { ...u, verified: !!data.verified } : u));
    } catch {}
  };

  const handleDeleteUpi = async (id: string) => {
    if (!confirm("Remove this UPI ID?")) return;
    try {
      await deleteUpiDetail(id);
      setUpis((prev) => prev.filter((u) => u.id !== id));
    } catch {}
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🔐</span>
        <h2 className="font-display text-2xl font-bold text-[#2C1810] mb-4">Login Required</h2>
        <button onClick={() => onNavigate("login")} className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full">
          Login / Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2C1810] mb-1">UPI Details</h1>
      <p className="text-gray-400 text-xs sm:text-sm mb-6">Used for order refunds. Add the UPI ID where you&apos;d like to receive refunds.</p>

      {/* UPI Details */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#2C1810]">Your UPI IDs</h2>
          <button
            onClick={() => { setShowUpiForm(!showUpiForm); setUpiError(""); setUpiInput(""); }}
            className="text-sm text-[#5EAED4] font-medium hover:underline"
          >
            + Add UPI ID
          </button>
        </div>

        {showUpiForm && (
          <form onSubmit={handleAddUpi} className="glass-card rounded-2xl p-4 mb-4 space-y-3">
            {upiError && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">{upiError}</div>}

            <div className="relative">
              <input
                type="text"
                placeholder="yourname@okhdfcbank"
                value={upiInput}
                onChange={(e) => setUpiInput(e.target.value)}
                className={`w-full px-4 py-2.5 pr-10 border rounded-xl focus:ring-2 outline-none text-gray-900 bg-white text-sm ${
                  upiInput && formatValid
                    ? "border-green-400 focus:ring-green-300"
                    : upiInput && !formatValid
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-[#89C4E1]"
                }`}
              />
              {/* Green tick when the format is valid */}
              {upiInput && formatValid && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" title="Valid UPI ID">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              )}
            </div>
            {upiInput && !formatValid && (
              <p className="text-xs text-red-500">Enter a valid UPI ID like name@okhdfcbank</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={verifyingUpi || !formatValid}
                className="px-5 py-2 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyingUpi ? "Verifying..." : "Add & Verify"}
              </button>
              <button type="button" onClick={() => setShowUpiForm(false)} className="px-5 py-2 bg-gray-100 text-gray-600 font-medium rounded-full text-sm">Cancel</button>
            </div>
          </form>
        )}

        {upis.length === 0 && !showUpiForm ? (
          <p className="text-gray-400 text-sm py-4 text-center">No UPI IDs added yet</p>
        ) : (
          <div className="space-y-3">
            {upis.map((upi) => (
              <div key={upi.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="font-medium text-[#2C1810] text-sm truncate">{upi.upiId}</p>
                  {upi.verified && (
                    <span className="text-green-500 flex-shrink-0" title="Verified">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {upi.verified ? (
                    <span className="text-xs text-green-600 font-medium">Verified</span>
                  ) : (
                    <button onClick={() => handleReverifyUpi(upi)} className="text-xs text-[#5EAED4] hover:underline">Re-verify</button>
                  )}
                  <button onClick={() => upi.id && handleDeleteUpi(upi.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
