import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  size?: string;
  colors?: string;
  customNote?: string;
  image: string;
}

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "online" | "cod";
  paymentId?: string;
  razorpayOrderId?: string;
  status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveryDetails: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
    note: string;
  };
  createdAt: Timestamp | Date;
}

export async function saveOrder(order: Omit<Order, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not initialized");

  const docRef = await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  if (!db) throw new Error("Firebase not initialized");

  const ordersRef = collection(db, "orders");
  // Using only where() to avoid needing a composite index
  const q = query(
    ordersRef,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  const orders = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];

  // Sort client-side by createdAt descending
  return orders.sort((a, b) => {
    const dateA = (a.createdAt as any)?.toDate?.() || new Date(a.createdAt as any);
    const dateB = (b.createdAt as any)?.toDate?.() || new Date(b.createdAt as any);
    return dateB.getTime() - dateA.getTime();
  });
}

export async function getAllOrders(): Promise<Order[]> {
  if (!db) throw new Error("Firebase not initialized");

  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");

  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status });
}
