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

export interface BankAccount {
  id?: string;
  userId: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
}

export interface UpiDetail {
  id?: string;
  userId: string;
  upiId: string;
  verified: boolean;
}

// ---- BANK ACCOUNTS ----
export async function getBankAccounts(userId: string): Promise<BankAccount[]> {
  if (!db) throw new Error("Firebase not initialized");
  const ref = collection(db, "bankAccounts");
  const q = query(ref, where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BankAccount[];
}

export async function addBankAccount(acc: Omit<BankAccount, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not initialized");
  const ref = await addDoc(collection(db, "bankAccounts"), acc);
  return ref.id;
}

export async function updateBankAccount(id: string, data: Partial<Omit<BankAccount, "id">>): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  await updateDoc(doc(db, "bankAccounts", id), data);
}

export async function deleteBankAccount(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  await deleteDoc(doc(db, "bankAccounts", id));
}

// ---- UPI ----
export async function getUpiDetails(userId: string): Promise<UpiDetail[]> {
  if (!db) throw new Error("Firebase not initialized");
  const ref = collection(db, "upiDetails");
  const q = query(ref, where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as UpiDetail[];
}

export async function addUpiDetail(upi: Omit<UpiDetail, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not initialized");
  const ref = await addDoc(collection(db, "upiDetails"), upi);
  return ref.id;
}

export async function updateUpiDetail(id: string, data: Partial<Omit<UpiDetail, "id">>): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  await updateDoc(doc(db, "upiDetails", id), data);
}

export async function deleteUpiDetail(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");
  await deleteDoc(doc(db, "upiDetails", id));
}

// Validate UPI ID format.
// A UPI ID (VPA) is `identifier@handle`:
//  - identifier: a valid 10-digit Indian mobile number (starts 6-9) OR a username
//  - handle: 2+ letters, optionally with digits (e.g. axl, ybl, okhdfcbank, paytm)
// Examples that must pass: 9346630240@axl, yourname@okhdfcbank, john.doe@ybl
// Must fail: 9898983309940@axl (13 digits — not a real phone number)
export function isValidUpiFormat(upiId: string): boolean {
  const id = upiId.trim();
  const structure = /^([a-zA-Z0-9][a-zA-Z0-9.\-_]{1,})@([a-zA-Z][a-zA-Z0-9]{1,})$/;
  const match = id.match(structure);
  if (!match) return false;

  const prefix = match[1];
  // If the prefix is all digits, it must be a valid 10-digit Indian mobile number.
  if (/^\d+$/.test(prefix)) {
    return /^[6-9]\d{9}$/.test(prefix);
  }
  return true;
}
