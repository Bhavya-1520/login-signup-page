import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Address {
  id?: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export async function getUserAddresses(userId: string): Promise<Address[]> {
  if (!db) throw new Error("Firebase not initialized");

  const addressRef = collection(db, "addresses");
  const q = query(addressRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Address[];
}

// Normalize a string for comparison: lowercase, collapse whitespace, trim.
function norm(s: string): string {
  return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

export async function addAddress(address: Omit<Address, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not initialized");

  // Prevent duplicates: if the same person (name) already has the same address
  // saved, don't create another entry. Same pincode with a different address or
  // a different name IS allowed.
  const existing = await getUserAddresses(address.userId);
  const match = existing.find(
    (a) => norm(a.name) === norm(address.name) && norm(a.address) === norm(address.address)
  );
  if (match?.id) {
    return match.id;
  }

  const docRef = await addDoc(collection(db, "addresses"), address);
  return docRef.id;
}

export async function updateAddress(
  addressId: string,
  data: Partial<Omit<Address, "id">>
): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");

  const addressRef = doc(db, "addresses", addressId);
  await updateDoc(addressRef, data);
}

export async function deleteAddress(addressId: string): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");

  const addressRef = doc(db, "addresses", addressId);
  await deleteDoc(addressRef);
}
