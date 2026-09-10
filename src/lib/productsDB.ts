import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ProductSize {
  label: string;
  flowers: number;
  price: number;
}

export interface ProductDB {
  id?: string;
  name: string;
  category: string;
  group?: string;
  description: string;
  basePrice: number;
  image: string;
  sizes?: ProductSize[];
  customizable: boolean;
  pricePerExtra?: number;
}

export const CATEGORIES = [
  "All",
  "Satin Ribbon",
  "Pipe Cleaner",
  "Resin Bangles",
  "Gifts",
  "Special",
  "Raksha Bandhan",
];

// Map a product category to its display group (Bouquets / Rakhi / Resin / Birthday)
export function categoryToGroup(category: string): string {
  const map: Record<string, string> = {
    "Satin Ribbon": "Bouquets",
    "Pipe Cleaner": "Bouquets",
    "Special": "Bouquets",
    "Raksha Bandhan": "Rakhi",
    "Resin Bangles": "Resin",
    "Gifts": "Birthday",
  };
  return map[category] || "Bouquets";
}

export async function getProducts(): Promise<ProductDB[]> {
  if (!db) throw new Error("Firebase not initialized");

  const productsRef = collection(db, "products");
  const q = query(productsRef, orderBy("name", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProductDB[];
}

export async function addProduct(product: Omit<ProductDB, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not initialized");

  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
}

export async function updateProduct(
  productId: string,
  data: Partial<Omit<ProductDB, "id">>
): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");

  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, data);
}

export async function deleteProduct(productId: string): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");

  const productRef = doc(db, "products", productId);
  await deleteDoc(productRef);
}
