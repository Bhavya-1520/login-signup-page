"use client";

import { useEffect, useState } from "react";
import { products as fallbackProducts } from "@/lib/products";
import { getProducts } from "@/lib/productsDB";
import { getInventoryMap, setStock } from "@/lib/inventory";

interface Row {
  id: string;
  name: string;
  image: string;
}

export default function InventoryManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [stocks, setStocks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      // Merge default products with dashboard-added ones (unique by id)
      let dbProducts: any[] = [];
      try {
        dbProducts = await getProducts();
      } catch {
        dbProducts = [];
      }
      const dbIds = new Set(dbProducts.map((p) => p.id));
      const merged: Row[] = [
        ...dbProducts.map((p) => ({ id: p.id as string, name: p.name, image: p.image })),
        ...fallbackProducts
          .filter((p) => !dbIds.has(p.id))
          .map((p) => ({ id: p.id, name: p.name, image: p.image })),
      ];

      // Load current stock levels
      let invMap: Record<string, number> = {};
      try {
        invMap = await getInventoryMap();
      } catch {
        invMap = {};
      }
      const stockState: Record<string, string> = {};
      merged.forEach((r) => {
        // Leave the field empty when no stock has been set yet (no leading 0)
        stockState[r.id] = invMap[r.id] !== undefined ? String(invMap[r.id]) : "";
      });

      setRows(merged);
      setStocks(stockState);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    }
    setLoading(false);
  };

  // Only digits allowed — strip anything that isn't 0-9 (blocks negatives,
  // decimals, letters, and special characters).
  const handleChange = (id: string, value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, "");
    setStocks((prev) => ({ ...prev, [id]: digitsOnly }));
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    try {
      const qty = parseInt(stocks[id] || "0", 10);
      await setStock(id, isNaN(qty) ? 0 : qty);
      setStocks((prev) => ({ ...prev, [id]: String(isNaN(qty) ? 0 : qty) }));
      setSavedId(id);
      setTimeout(() => setSavedId((cur) => (cur === id ? null : cur)), 1500);
    } catch (err) {
      alert("Failed to save inventory. Please check Firestore rules and try again.");
      console.error(err);
    }
    setSavingId(null);
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
        <h2 className="font-display text-2xl font-bold text-[#2C1810]">
          Inventory ({rows.length})
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Set how many units are available for each product. Only whole numbers (0, 1, 2 …) are allowed.
          When stock reaches 0, the product shows as Out of Stock to customers.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const raw = stocks[row.id] ?? "";
          const hasValue = raw !== "";
          const current = parseInt(raw || "0", 10) || 0;
          return (
            <div key={row.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
              {/* Image */}
              <div className="w-16 h-16 rounded-xl bg-pink-50 overflow-hidden flex-shrink-0">
                <img
                  src={row.image}
                  alt={row.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                />
              </div>

              {/* Name + status */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#2C1810] truncate">{row.name}</h4>
                <span
                  className={`text-xs font-medium ${
                    !hasValue ? "text-gray-400" : current === 0 ? "text-red-500" : current <= 5 ? "text-amber-600" : "text-green-600"
                  }`}
                >
                  {!hasValue ? "Not set" : current === 0 ? "Out of stock" : `${current} in stock`}
                </span>
              </div>

              {/* Stock input */}
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={stocks[row.id] ?? ""}
                onChange={(e) => handleChange(row.id, e.target.value)}
                placeholder="0"
                className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white/80"
              />

              {/* Save */}
              <button
                onClick={() => handleSave(row.id)}
                disabled={savingId === row.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                  savedId === row.id
                    ? "bg-green-100 text-green-700"
                    : "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white hover:shadow-lg"
                } disabled:opacity-50`}
              >
                {savingId === row.id ? "..." : savedId === row.id ? "✓ Saved" : "Save"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
