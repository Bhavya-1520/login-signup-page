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

// Inventory is stored in a dedicated `inventory` collection where each
// document id equals the product id. This lets us track stock for BOTH the
// built-in (code-defined) products and dashboard-added products uniformly.
//
//   inventory/{productId} = { stock: number }

export type InventoryMap = Record<string, number>;

// Read every product's stock level as a { productId: stock } map.
export async function getInventoryMap(): Promise<InventoryMap> {
  if (!db) throw new Error("Firebase not initialized");

  const snapshot = await getDocs(collection(db, "inventory"));
  const map: InventoryMap = {};
  snapshot.docs.forEach((d) => {
    const data = d.data() as { stock?: number };
    map[d.id] = typeof data.stock === "number" ? data.stock : 0;
  });
  return map;
}

// Read a single product's stock. Returns undefined if not tracked yet.
export async function getStock(productId: string): Promise<number | undefined> {
  if (!db) throw new Error("Firebase not initialized");

  const ref = doc(db, "inventory", productId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return undefined;
  const data = snap.data() as { stock?: number };
  return typeof data.stock === "number" ? data.stock : 0;
}

// Manager sets the stock for a product. Only whole numbers >= 0 are stored.
export async function setStock(productId: string, stock: number): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");

  const safe = Math.max(0, Math.floor(Number(stock) || 0));
  const ref = doc(db, "inventory", productId);
  await setDoc(ref, { stock: safe }, { merge: true });
}

// Reduce stock when an order is placed. Accepts a list of { productId, quantity }.
// Uses atomic increment, then clamps any resulting negative value back to 0.
export async function decrementStock(
  items: { productId: string; quantity: number }[]
): Promise<void> {
  if (!db) return;

  // Sum quantities per product (an order may contain the same product twice
  // in different sizes/colours).
  const totals: Record<string, number> = {};
  for (const it of items) {
    if (!it.productId) continue;
    totals[it.productId] = (totals[it.productId] || 0) + (it.quantity || 0);
  }

  await Promise.all(
    Object.entries(totals).map(async ([productId, qty]) => {
      if (qty <= 0) return;
      const ref = doc(db!, "inventory", productId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        // Not tracked yet — nothing to decrement.
        return;
      }
      try {
        await updateDoc(ref, { stock: increment(-qty) });
        // Clamp negatives to 0 in case of oversell race.
        const after = await getDoc(ref);
        const val = (after.data() as { stock?: number })?.stock;
        if (typeof val === "number" && val < 0) {
          await updateDoc(ref, { stock: 0 });
        }
      } catch {
        // Ignore individual failures so one product doesn't block the order.
      }
    })
  );
}
