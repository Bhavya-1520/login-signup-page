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

export async function addAddress(address: Omit<Address, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not initialized");

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
