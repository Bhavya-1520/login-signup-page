"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserAddresses, addAddress, updateAddress, deleteAddress, Address } from "@/lib/addresses";

interface AddressesPageProps {
  onNavigate: (page: string) => void;
}

export default function AddressesPage({ onNavigate }: AddressesPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (user) {
      getUserAddresses(user.uid)
        .then((data) => { setAddresses(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const resetForm = () => {
    setForm({ name: "", phone: "", address: "", city: "", pincode: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (addr: Address) => {
    setEditing(addr);
    setForm({
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      pincode: addr.pincode,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      alert("Please fill all fields");
      return;
    }

    setSaving(true);
    try {
      if (editing?.id) {
        await updateAddress(editing.id, { ...form });
        setAddresses((prev) => prev.map((a) => a.id === editing.id ? { ...a, ...form } : a));
      } else {
        const id = await addAddress({
          ...form,
          userId: user.uid,
          isDefault: addresses.length === 0,
        });
        setAddresses((prev) => [...prev, { ...form, id, userId: user.uid, isDefault: addresses.length === 0 }]);
      }
      resetForm();
    } catch (err) {
      alert("Failed to save address");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // Remove default from all
      for (const addr of addresses) {
        if (addr.id && addr.isDefault) {
          await updateAddress(addr.id, { isDefault: false });
        }
      }
      await updateAddress(id, { isDefault: true });
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    } catch (err) {
      alert("Failed to set default");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading addresses...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🔐</span>
        <h2 className="font-display text-3xl font-bold text-[#2C1810] mb-4">Login Required</h2>
        <p className="text-gray-600 mb-8">Please login to manage your addresses.</p>
        <button onClick={() => onNavigate("login")} className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full">
          Login / Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1810]">Saved Addresses</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-5 py-2.5 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full text-sm hover:shadow-lg transition-all"
        >
          + Add Address
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-[#2C1810] mb-4">{editing ? "Edit Address" : "Add New Address"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text" placeholder="Full Name *" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white"
              />
              <input
                type="tel" placeholder="Phone Number *" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white"
              />
            </div>
            <textarea
              placeholder="Full Address (House no, Street, Area, Landmark) *" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none resize-none text-gray-900 bg-white"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text" placeholder="City *" value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white"
              />
              <input
                type="text" placeholder="Pincode *" value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full text-sm disabled:opacity-50">
                {saving ? "Saving..." : editing ? "Update" : "Save Address"}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-full text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">📍</span>
          <p className="text-gray-500 mb-2">No saved addresses yet</p>
          <p className="text-gray-400 text-sm">Add an address to speed up your checkout</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="glass-card rounded-2xl p-5 relative">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-xs bg-[#89C4E1] text-white px-2.5 py-1 rounded-full font-medium">
                  Default
                </span>
              )}
              <p className="font-semibold text-[#2C1810]">{addr.name}</p>
              <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
              <p className="text-sm text-gray-600">{addr.city} - {addr.pincode}</p>
              <p className="text-sm text-gray-500 mt-1">📞 {addr.phone}</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => handleEdit(addr)} className="text-xs text-[#5EAED4] font-medium hover:underline">Edit</button>
                <button onClick={() => addr.id && handleDelete(addr.id)} className="text-xs text-red-500 font-medium hover:underline">Delete</button>
                {!addr.isDefault && (
                  <button onClick={() => addr.id && handleSetDefault(addr.id)} className="text-xs text-gray-500 font-medium hover:underline">Set as Default</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
