"use client";

import { useEffect, useState } from "react";
import { products as fallbackProducts } from "@/lib/products";
import { getProducts } from "@/lib/productsDB";
import { getInventoryMap, setStock, setSizeStock, InventoryMap } from "@/lib/inventory";

interface Row {
  id: string;
  name: string;
  image: string;
  sizes: string[]; // size labels, empty if the product has no sizes
}

export default function InventoryManager() {
  const [rows, setRows] = useState<Row[]>([]);
  // For size-less products: values[id] = "3". For sized products: values[`${id}::${size}`] = "2".
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      let dbProducts: any[] = [];
      try { dbProducts = await getProducts(); } catch { dbProducts = []; }
      const dbIds = new Set(dbProducts.map((p) => p.id));
      const merged: Row[] = [
        ...dbProducts.map((p: any) => ({ id: p.id, name: p.name, image: p.image, sizes: (p.sizes || []).map((s: any) => s.label) })),
        ...fallbackProducts
          .filter((p) => !dbIds.has(p.id))
          .map((p) => ({ id: p.id, name: p.name, image: p.image, sizes: (p.sizes || []).map((s) => s.label) })),
      ];

      let invMap: InventoryMap = {};
      try { invMap = await getInventoryMap(); } catch { invMap = {}; }

      const state: Record<string, string> = {};
      merged.forEach((r) => {
        const entry = invMap[r.id];
        if (r.sizes.length > 0) {
          r.sizes.forEach((sz) => {
            const v = entry?.sizes?.[sz];
            state[`${r.id}::${sz}`] = v !== undefined ? String(v) : "";
          });
        } else {
          state[r.id] = entry?.stock !== undefined ? String(entry.stock) : "";
        }
      });

      setRows(merged);
      setValues(state);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    }
    setLoading(false);
  };

  // Only digits allowed
  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value.replace(/[^0-9]/g, "") }));
  };

  const saveProduct = async (id: string) => {
    setStock(id, parseInt(values[id] || "0", 10) || 0);
  };

  const handleSave = async (row: Row) => {
    setSavingKey(row.id);
    try {
      if (row.sizes.length > 0) {
        // Save each size
        await Promise.all(
          row.sizes.map((sz) => {
            const qty = parseInt(values[`${row.id}::${sz}`] || "0", 10) || 0;
            return setSizeStock(row.id, sz, qty);
          })
        );
      } else {
        const qty = parseInt(values[row.id] || "0", 10) || 0;
        await setStock(row.id, qty);
      }
      setSavedKey(row.id);
      setTimeout(() => setSavedKey((cur) => (cur === row.id ? null : cur)), 1500);
    } catch (err) {
      alert("Failed to save inventory. Please check Firestore rules and try again.");
      console.error(err);
    }
    setSavingKey(null);
  };

  const statusText = (raw: string) => {
    if (raw === "") return { text: "Not set", cls: "text-gray-400" };
    const n = parseInt(raw, 10) || 0;
    if (n === 0) return { text: "Out of stock", cls: "text-red-500" };
    if (n <= 5) return { text: `${n} in stock`, cls: "text-amber-600" };
    return { text: `${n} in stock`, cls: "text-green-600" };
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-500 mt-3">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-[#2C1810]">Inventory ({rows.length})</h2>
        <p className="text-gray-500 text-sm mt-1">
          Set available units per product. Products with sizes (e.g. 6 inch / 12 inch) are tracked per size.
          Only whole numbers are allowed. 0 = Out of Stock.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-pink-50 overflow-hidden flex-shrink-0">
                <img
                  src={row.image}
                  alt={row.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#2C1810] truncate">{row.name}</h4>
                {row.sizes.length === 0 && (
                  <span className={`text-xs font-medium ${statusText(values[row.id] ?? "").cls}`}>
                    {statusText(values[row.id] ?? "").text}
                  </span>
                )}
              </div>

              {/* Size-less: single input inline */}
              {row.sizes.length === 0 && (
                <input
                  type="text"
                  inputMode="numeric"
                  value={values[row.id] ?? ""}
                  onChange={(e) => handleChange(row.id, e.target.value)}
                  placeholder="0"
                  className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-[#89C4E1] outline-none text-gray-900 bg-white/80"
                />
              )}

              <button
                onClick={() => handleSave(row)}
                disabled={savingKey === row.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                  savedKey === row.id
                    ? "bg-green-100 text-green-700"
                    : "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white hover:shadow-lg"
                } disabled:opacity-50`}
              >
                {savingKey === row.id ? "..." : savedKey === row.id ? "✓ Saved" : "Save"}
              </button>
            </div>

            {/* Sized: one input per size */}
            {row.sizes.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {row.sizes.map((sz) => {
                  const key = `${row.id}::${sz}`;
                  const st = statusText(values[key] ?? "");
                  return (
                    <div key={key} className="rounded-xl border border-gray-100 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#2C1810]">{sz}</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={values[key] ?? ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder="0"
                          className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-[#89C4E1] outline-none text-gray-900 bg-white/80"
                        />
                      </div>
                      <span className={`text-xs font-medium ${st.cls}`}>{st.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
