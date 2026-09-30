import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

// Inventory lives in the `inventory` collection, one doc per product id:
//   inventory/{productId} = {
//     stock?: number,                 // for products WITHOUT sizes
//     sizes?: { [sizeLabel]: number } // for products WITH sizes (e.g. "6 inch": 2)
//   }
// This tracks stock for both built-in and dashboard products, per size when needed.

export interface InventoryEntry {
  stock?: number;
  sizes?: Record<string, number>;
}

export type InventoryMap = Record<string, InventoryEntry>;

// Read every product's inventory entry as a { productId: entry } map.
export async function getInventoryMap(): Promise<InventoryMap> {
  if (!db) throw new Error("Firebase not initialized");

  const snapshot = await getDocs(collection(db, "inventory"));
  const map: InventoryMap = {};
  snapshot.docs.forEach((d) => {
    const data = d.data() as InventoryEntry;
    map[d.id] = {
      stock: typeof data.stock === "number" ? data.stock : undefined,
      sizes: data.sizes || undefined,
    };
  });
  return map;
}

// Read a single product's inventory entry. undefined if not tracked yet.
export async function getInventory(productId: string): Promise<InventoryEntry | undefined> {
  if (!db) throw new Error("Firebase not initialized");
  const ref = doc(db, "inventory", productId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return undefined;
  return snap.data() as InventoryEntry;
}

// Product-level stock (products without sizes). undefined if not tracked.
export async function getStock(productId: string): Promise<number | undefined> {
  const entry = await getInventory(productId);
  if (!entry) return undefined;
  return typeof entry.stock === "number" ? entry.stock : undefined;
}

// Set product-level stock (no sizes).
export async function setStock(productId: string, stock: number): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  const safe = Math.max(0, Math.floor(Number(stock) || 0));
  await setDoc(doc(db, "inventory", productId), { stock: safe }, { merge: true });
}

// Set stock for ONE size of a product.
export async function setSizeStock(productId: string, sizeLabel: string, stock: number): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  const safe = Math.max(0, Math.floor(Number(stock) || 0));
  await setDoc(
    doc(db, "inventory", productId),
    { sizes: { [sizeLabel]: safe } },
    { merge: true }
  );
}

// Helper: resolve available stock for a product + optional size from an entry.
// Returns undefined when not tracked (treated as always available).
export function stockFromEntry(entry: InventoryEntry | undefined, sizeLabel?: string): number | undefined {
  if (!entry) return undefined;
  const key = matchSizeKey(entry.sizes, sizeLabel);
  if (key !== undefined && entry.sizes) {
    return entry.sizes[key];
  }
  if (typeof entry.stock === "number") return entry.stock;
  // Product has sizes tracked but this specific size not set -> treat as not tracked
  return undefined;
}

// Find the matching size key in the inventory, allowing a "Variant • Size" label
// to match the raw size portion (e.g. "Blood Resin • 2-4" -> "2-4").
function matchSizeKey(sizes: Record<string, number> | undefined, label?: string): string | undefined {
  if (!sizes || !label) return undefined;
  if (Object.prototype.hasOwnProperty.call(sizes, label)) return label;
  // Try each trailing segment split on the bullet separator
  const parts = label.split("•").map((s) => s.trim());
  for (const part of parts) {
    if (Object.prototype.hasOwnProperty.call(sizes, part)) return part;
  }
  return undefined;
}

// Is the whole product out of stock? True only if every tracked value is 0.
export function isEntryOutOfStock(entry: InventoryEntry | undefined): boolean {
  if (!entry) return false; // not tracked = available
  const values: number[] = [];
  if (typeof entry.stock === "number") values.push(entry.stock);
  if (entry.sizes) values.push(...Object.values(entry.sizes));
  if (values.length === 0) return false;
  return values.every((v) => v === 0);
}

// Reduce stock when an order is placed. Accepts { productId, quantity, size? }.
// Decrements the specific size if provided and tracked, else the product stock.
export async function decrementStock(
  items: { productId: string; quantity: number; size?: string }[]
): Promise<void> {
  if (!db) return;

  await Promise.all(
    items.map(async (it) => {
      if (!it.productId || it.quantity <= 0) return;
      const ref = doc(db!, "inventory", it.productId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return; // not tracked
      const entry = snap.data() as InventoryEntry;

      try {
        // Prefer per-size decrement when the size is tracked
        const sizeKey = matchSizeKey(entry.sizes, it.size);
        if (sizeKey && entry.sizes) {
          const current = entry.sizes[sizeKey] || 0;
          const next = Math.max(0, current - it.quantity);
          await updateDoc(ref, { [`sizes.${sizeKey}`]: next });
        } else if (typeof entry.stock === "number") {
          await updateDoc(ref, { stock: increment(-it.quantity) });
          const after = await getDoc(ref);
          const val = (after.data() as InventoryEntry)?.stock;
          if (typeof val === "number" && val < 0) {
            await updateDoc(ref, { stock: 0 });
          }
        }
      } catch {
        // Ignore individual failures so one item doesn't block the order.
      }
    })
  );
}
