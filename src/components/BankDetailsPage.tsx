"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getBankAccounts, addBankAccount, deleteBankAccount, BankAccount,
  getUpiDetails, addUpiDetail, updateUpiDetail, deleteUpiDetail, UpiDetail,
  isValidUpiFormat,
} from "@/lib/bankDetails";

interface BankDetailsPageProps {
  onNavigate: (page: string) => void;
}

export default function BankDetailsPage({ onNavigate }: BankDetailsPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [upis, setUpis] = useState<UpiDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // Bank form
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankForm, setBankForm] = useState({ accountHolder: "", accountNumber: "", ifsc: "", bankName: "" });
  const [savingBank, setSavingBank] = useState(false);

  // UPI form
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [upiInput, setUpiInput] = useState("");
  const [verifyingUpi, setVerifyingUpi] = useState(false);
  const [upiError, setUpiError] = useState("");

  useEffect(() => {
    if (user) {
      Promise.all([getBankAccounts(user.uid), getUpiDetails(user.uid)])
        .then(([b, u]) => { setBanks(b); setUpis(u); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!bankForm.accountHolder || !bankForm.accountNumber || !bankForm.ifsc || !bankForm.bankName) {
      alert("Please fill all bank details");
      return;
    }
    setSavingBank(true);
    try {
      const id = await addBankAccount({ ...bankForm, userId: user.uid });
      setBanks((prev) => [...prev, { ...bankForm, id, userId: user.uid }]);
      setBankForm({ accountHolder: "", accountNumber: "", ifsc: "", bankName: "" });
      setShowBankForm(false);
    } catch {
      alert("Failed to save bank account");
    }
    setSavingBank(false);
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm("Remove this bank account?")) return;
    try {
      await deleteBankAccount(id);
      setBanks((prev) => prev.filter((b) => b.id !== id));
    } catch {}
  };

  const handleAddUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpiError("");

    if (!isValidUpiFormat(upiInput)) {
      setUpiError("Invalid UPI format. Should be like name@okhdfcbank");
      return;
    }

    setVerifyingUpi(true);
    try {
      const res = await fetch("/api/upi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId: upiInput }),
      });
      const data = await res.json();

      const id = await addUpiDetail({ userId: user.uid, upiId: upiInput, verified: !!data.verified });
      setUpis((prev) => [...prev, { id, userId: user.uid, upiId: upiInput, verified: !!data.verified }]);

      if (!data.verified) {
        setUpiError(data.error || "Could not verify this UPI ID.");
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
      <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2C1810] mb-1">Bank & UPI Details</h1>
      <p className="text-gray-400 text-xs sm:text-sm mb-6">Used for order refunds. Keep them accurate.</p>

      {/* Bank Accounts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#2C1810]">Bank Accounts</h2>
          <button
            onClick={() => setShowBankForm(!showBankForm)}
            className="text-sm text-[#5EAED4] font-medium hover:underline"
          >
            + Add Bank Account
          </button>
        </div>

        {showBankForm && (
          <form onSubmit={handleAddBank} className="glass-card rounded-2xl p-4 mb-4 space-y-3">
            <input type="text" placeholder="Account Holder Name" value={bankForm.accountHolder}
              onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] outline-none text-gray-900 bg-white text-sm" />
            <input type="text" placeholder="Account Number" value={bankForm.accountNumber}
              onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] outline-none text-gray-900 bg-white text-sm" />
            <input type="text" placeholder="IFSC Code" value={bankForm.ifsc}
              onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] outline-none text-gray-900 bg-white text-sm" />
            <input type="text" placeholder="Bank Name" value={bankForm.bankName}
              onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] outline-none text-gray-900 bg-white text-sm" />
            <div className="flex gap-2">
              <button type="submit" disabled={savingBank} className="px-5 py-2 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full text-sm disabled:opacity-50">
                {savingBank ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setShowBankForm(false)} className="px-5 py-2 bg-gray-100 text-gray-600 font-medium rounded-full text-sm">Cancel</button>
            </div>
          </form>
        )}

        {banks.length === 0 && !showBankForm ? (
          <p className="text-gray-400 text-sm py-4 text-center">No bank accounts added yet</p>
        ) : (
          <div className="space-y-3">
            {banks.map((bank) => (
              <div key={bank.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#2C1810] text-sm">{bank.bankName}</p>
                  <p className="text-xs text-gray-500">{bank.accountHolder}</p>
                  <p className="text-xs text-gray-400">A/C: ••••{bank.accountNumber.slice(-4)} | {bank.ifsc}</p>
                </div>
                <button onClick={() => bank.id && handleDeleteBank(bank.id)} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPI Details */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#2C1810]">UPI IDs</h2>
          <button
            onClick={() => { setShowUpiForm(!showUpiForm); setUpiError(""); }}
            className="text-sm text-[#5EAED4] font-medium hover:underline"
          >
            + Add UPI ID
          </button>
        </div>

        {showUpiForm && (
          <form onSubmit={handleAddUpi} className="glass-card rounded-2xl p-4 mb-4 space-y-3">
            {upiError && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">{upiError}</div>}
            <input type="text" placeholder="yourname@okhdfcbank" value={upiInput}
              onChange={(e) => setUpiInput(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] outline-none text-gray-900 bg-white text-sm" />
            <div className="flex gap-2">
              <button type="submit" disabled={verifyingUpi} className="px-5 py-2 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full text-sm disabled:opacity-50">
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
                <div>
                  <p className="font-medium text-[#2C1810] text-sm">{upi.upiId}</p>
                  {upi.verified ? (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">✓ Verified</span>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">✗ Unverified — please check your UPI ID</span>
                  )}
                </div>
                <div className="flex gap-3">
                  {!upi.verified && (
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
