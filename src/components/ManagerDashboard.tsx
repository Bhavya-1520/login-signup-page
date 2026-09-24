"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/admin";
import { getAllOrders, updateOrderStatus, Order } from "@/lib/orders";
import ProductManager from "./ProductManager";
import InventoryManager from "./InventoryManager";

interface ManagerDashboardProps {
  onNavigate: (page: string) => void;
}

type DashboardTab = "orders" | "products" | "inventory";
// Orders sub-navigation: overview grid -> filtered list -> single order detail
type OrderView = "overview" | "list" | "detail";

const STATUS_FLOW = ["placed", "processing", "shipped", "delivered"] as const;

const STATUS_META: Record<string, { label: string; icon: string; grad: string; text: string; soft: string }> = {
  all: { label: "All Orders", icon: "📋", grad: "from-[#89C4E1] to-[#B8DEF0]", text: "text-[#2C6E8F]", soft: "bg-sky-50" },
  placed: { label: "New / Placed", icon: "🆕", grad: "from-[#7FB8E0] to-[#A9D4F0]", text: "text-blue-700", soft: "bg-blue-50" },
  processing: { label: "Processing", icon: "⚙️", grad: "from-[#F6C177] to-[#FADCA0]", text: "text-amber-700", soft: "bg-amber-50" },
  shipped: { label: "Shipped", icon: "🚚", grad: "from-[#B89DE0] to-[#D6C4F0]", text: "text-purple-700", soft: "bg-purple-50" },
  delivered: { label: "Delivered", icon: "✅", grad: "from-[#8FD4A8] to-[#BEEBCE]", text: "text-green-700", soft: "bg-green-50" },
  cancelled: { label: "Cancelled", icon: "❌", grad: "from-[#E9A0A0] to-[#F3C6C6]", text: "text-red-700", soft: "bg-red-50" },
};

export default function ManagerDashboard({ onNavigate }: ManagerDashboardProps) {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>("orders");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Orders navigation
  const [orderView, setOrderView] = useState<OrderView>("overview");
  const [filter, setFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user && isAdmin(user.email)) {
      getAllOrders()
        .then((data) => { setOrders(data); setLoading(false); })
        .catch((err) => { console.error("Failed to fetch orders:", err); setLoading(false); });
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

      const order = orders.find((o) => o.id === orderId);
      if (order && order.userEmail) {
        const emailTypeMap: Record<string, string> = {
          processing: "order-confirmed",
          shipped: "order-shipped",
          delivered: "order-delivered",
        };
        const emailType = emailTypeMap[newStatus];
        if (emailType) {
          try {
            await fetch("/api/email/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: emailType,
                to: order.userEmail,
                data: {
                  orderId,
                  customerName: order.deliveryDetails.name,
                  items: order.items,
                  totalAmount: order.totalAmount,
                  paymentMethod: order.paymentMethod,
                  address: order.deliveryDetails.address,
                  city: order.deliveryDetails.city,
                  pincode: order.deliveryDetails.pincode,
                },
              }),
            });
          } catch {}
        }
      }
    } catch (err) {
      alert("Failed to update order status. Please try again.");
      console.error(err);
    }
    setUpdatingId(null);
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading dashboard...</p>
      </div>
    );
  }

  if (!user || !isAdmin(user.email)) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🚫</span>
        <h2 className="font-display text-3xl font-bold text-[#2C1810] mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8">You don&apos;t have permission to access the manager dashboard.</p>
        <button onClick={() => onNavigate("home")} className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-xl transition-all">
          Back to Home
        </button>
      </div>
    );
  }

  const statusCounts = {
    all: orders.length,
    placed: orders.filter((o) => o.status === "placed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.totalAmount, 0);

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;

  const badge = (status: string) => STATUS_META[status] || STATUS_META.all;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const openStatus = (key: string) => { setFilter(key); setOrderView("list"); };
  const openOrder = (id?: string) => { if (!id) return; setSelectedOrderId(id); setOrderView("detail"); };

  // ---------------- ORDERS: OVERVIEW ----------------
  const renderOverview = () => (
    <div>
      {statusCounts.placed > 0 && (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100">
          <span className="text-2xl">🔔</span>
          <div className="flex-1">
            <p className="font-semibold text-[#2C1810] text-sm">
              You have {statusCounts.placed} new order{statusCounts.placed > 1 ? "s" : ""} to review!
            </p>
            <p className="text-xs text-gray-500">Tap “New / Placed” below to start processing them.</p>
          </div>
          <button onClick={() => openStatus("placed")} className="px-4 py-2 rounded-full bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white text-sm font-medium">
            View →
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {(["all", "placed", "processing", "shipped", "delivered", "cancelled"] as const).map((key) => {
          const m = STATUS_META[key];
          const count = statusCounts[key];
          return (
            <button
              key={key}
              onClick={() => openStatus(key)}
              className="relative overflow-hidden rounded-3xl p-5 text-left glass-card hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${m.grad} opacity-20`}></div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.grad} flex items-center justify-center text-xl shadow-md mb-3`}>
                {m.icon}
              </div>
              <p className="text-3xl font-bold text-[#2C1810] font-display">{count}</p>
              <p className="text-sm text-gray-500 mt-0.5">{m.label}</p>
              {key === "placed" && count > 0 && (
                <span className="absolute top-4 right-4 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  // ---------------- ORDERS: LIST ----------------
  const renderList = () => {
    const m = badge(filter);
    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setOrderView("overview")} className="flex items-center gap-1 text-sm font-medium text-[#5EAED4] hover:text-[#3A9BC8]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <h2 className="font-display text-xl font-bold text-[#2C1810] flex items-center gap-2">
            <span>{m.icon}</span> {m.label} <span className="text-gray-400 font-sans text-base">({filteredOrders.length})</span>
          </h2>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">📭</span>
            <p className="text-gray-600 font-medium">
              {filter === "all" && "No orders yet"}
              {filter === "placed" && "No newly placed orders"}
              {filter === "processing" && "Nothing is being processed right now"}
              {filter === "shipped" && "No orders shipped yet"}
              {filter === "delivered" && "No orders delivered yet"}
              {filter === "cancelled" && "No cancelled orders"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const m2 = badge(order.status);
              return (
                <button
                  key={order.id}
                  onClick={() => openOrder(order.id)}
                  className="w-full text-left glass-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-50 overflow-hidden flex-shrink-0">
                    <img src={order.items[0]?.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#2C1810] text-sm truncate">{order.deliveryDetails.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${m2.soft} ${m2.text}`}>{m2.label}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {order.items.map((i) => i.name).join(", ")}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">#{order.id?.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-[#5EAED4] font-display">₹{order.totalAmount}</p>
                    <span className="text-gray-300 text-lg">›</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ---------------- ORDERS: DETAIL ----------------
  const renderDetail = () => {
    if (!selectedOrder) return null;
    const order = selectedOrder;
    const m = badge(order.status);
    const isCancelled = order.status === "cancelled";
    const currentStep = STATUS_FLOW.indexOf(order.status as any);

    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setOrderView("list")} className="flex items-center gap-1 text-sm font-medium text-[#5EAED4] hover:text-[#3A9BC8]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to list
          </button>
        </div>

        {/* Summary card */}
        <div className="glass-card rounded-3xl p-6 mb-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-400 font-mono">#{order.id?.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.soft} ${m.text}`}>{m.icon} {m.label}</span>
              <p className="text-2xl font-bold text-[#5EAED4] font-display mt-1">₹{order.totalAmount}</p>
            </div>
          </div>

          {/* Status timeline */}
          {isCancelled ? (
            <div className="py-4 text-center bg-red-50 rounded-2xl">
              <span className="text-red-500 font-medium text-sm">❌ This order was cancelled</span>
            </div>
          ) : (
            <div className="py-4">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                <div
                  className="absolute top-4 left-0 h-1 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] rounded-full transition-all duration-500"
                  style={{ width: `${(Math.max(0, currentStep) / (STATUS_FLOW.length - 1)) * 100}%` }}
                ></div>
                {STATUS_FLOW.map((step, idx) => (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${idx <= currentStep ? "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white border-[#89C4E1]" : "bg-white text-gray-400 border-gray-200"}`}>
                      {idx <= currentStep ? "✓" : idx + 1}
                    </div>
                    <span className={`text-[10px] mt-1.5 capitalize ${idx <= currentStep ? "text-[#2C1810] font-medium" : "text-gray-400"}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer + delivery */}
        <div className="glass-card rounded-3xl p-6 mb-5">
          <h3 className="font-semibold text-[#2C1810] mb-3">Customer & Delivery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-400 text-xs">Name</span><p className="font-medium text-[#2C1810]">{order.deliveryDetails.name}</p></div>
            <div><span className="text-gray-400 text-xs">Phone</span><p className="font-medium text-[#2C1810]">{order.deliveryDetails.phone}</p></div>
            <div className="sm:col-span-2"><span className="text-gray-400 text-xs">Address</span><p className="text-gray-700">{order.deliveryDetails.address}, {order.deliveryDetails.city} - {order.deliveryDetails.pincode}</p></div>
            {order.deliveryDetails.note && (
              <div className="sm:col-span-2"><span className="text-gray-400 text-xs">Note</span><p className="text-gray-700 italic">{order.deliveryDetails.note}</p></div>
            )}
            <div><span className="text-gray-400 text-xs">Payment</span><p className="font-medium text-[#2C1810]">{order.paymentMethod === "online" ? "💳 Online (Paid)" : "💵 Cash on Delivery"}</p></div>
          </div>
        </div>

        {/* Items */}
        <div className="glass-card rounded-3xl p-6 mb-5">
          <h3 className="font-semibold text-[#2C1810] mb-3">Items ({order.items.length})</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-pink-50 overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2C1810] text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.size}{item.colors && ` • ${item.colors}`} × {item.quantity}</p>
                  {item.customPhotos && item.customPhotos.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {item.customPhotos.slice(0, 5).map((p, i) => (
                        <img key={i} src={p} alt="custom" className="w-8 h-8 rounded object-cover border border-gray-100" />
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-[#2C1810] text-sm">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Update status */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="font-semibold text-[#2C1810] mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {(["placed", "processing", "shipped", "delivered", "cancelled"] as const).map((status) => {
              const sm = badge(status);
              const active = order.status === status;
              return (
                <button
                  key={status}
                  onClick={() => order.id && handleStatusChange(order.id, status)}
                  disabled={active || updatingId === order.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${active ? `${sm.soft} ${sm.text} ring-2 ring-offset-1 ring-current` : "bg-gray-100 text-gray-500 hover:bg-gray-200"} disabled:cursor-not-allowed`}
                >
                  {updatingId === order.id ? "..." : `${sm.icon} ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3">The customer gets an email when you move to Processing, Shipped, or Delivered.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2C1810]">Manager Dashboard 🛠️</h1>
          <p className="text-gray-500 mt-1">Manage orders, products &amp; inventory</p>
        </div>
        <div className="glass-card rounded-2xl px-5 py-3 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Revenue</p>
          <p className="text-2xl font-bold text-[#5EAED4] font-display">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {([
          { key: "orders", label: `📋 Orders (${orders.length})` },
          { key: "products", label: "🛍️ Products" },
          { key: "inventory", label: "📦 Inventory" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key as DashboardTab); if (t.key === "orders") setOrderView("overview"); }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === t.key ? "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "products" && <ProductManager />}
      {activeTab === "inventory" && <InventoryManager />}
      {activeTab === "orders" && (
        <>
          {orderView === "overview" && renderOverview()}
          {orderView === "list" && renderList()}
          {orderView === "detail" && renderDetail()}
        </>
      )}
    </div>
  );
}
