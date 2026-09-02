"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/admin";
import { getAllOrders, updateOrderStatus, Order } from "@/lib/orders";
import ProductManager from "./ProductManager";

interface ManagerDashboardProps {
  onNavigate: (page: string) => void;
}

type DashboardTab = "orders" | "products";

export default function ManagerDashboard({ onNavigate }: ManagerDashboardProps) {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<DashboardTab>("orders");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && isAdmin(user.email)) {
      getAllOrders()
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch orders:", err);
          setLoading(false);
        });
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      // Send email notification to customer
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
        <h2 className="font-display text-3xl font-bold text-[#2C1810] mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-8">
          You don&apos;t have permission to access the manager dashboard.
        </p>
        <button
          onClick={() => onNavigate("home")}
          className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-xl transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const statusCounts = {
    all: orders.length,
    placed: orders.filter((o) => o.status === "placed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-yellow-100 text-yellow-700";
      case "shipped": return "bg-purple-100 text-purple-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2C1810]">
            Manager Dashboard 🛠️
          </h1>
          <p className="text-gray-500 mt-1">Manage orders and products</p>
        </div>
        <div className="glass-card rounded-2xl px-5 py-3 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Revenue</p>
          <p className="text-2xl font-bold text-[#5EAED4] font-display">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "orders"
              ? "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📋 Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "products"
              ? "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🛍️ Products
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && <ProductManager />}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { key: "all", label: "All", icon: "📋" },
          { key: "placed", label: "Placed", icon: "🆕" },
          { key: "processing", label: "Processing", icon: "⚙️" },
          { key: "shipped", label: "Shipped", icon: "🚚" },
          { key: "delivered", label: "Delivered", icon: "✅" },
          { key: "cancelled", label: "Cancelled", icon: "❌" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`glass-card rounded-2xl p-3 text-center transition-all ${
              filter === item.key
                ? "ring-2 ring-[#89C4E1] bg-sky-50/50"
                : "hover:bg-pink-50/30"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            <p className="text-lg font-bold text-[#2C1810]">
              {statusCounts[item.key as keyof typeof statusCounts]}
            </p>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">📭</span>
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="glass-card rounded-3xl p-5 sm:p-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-400 font-mono">
                      #{order.id?.slice(-8).toUpperCase()}
                    </p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {order.paymentMethod === "online" ? "💳 Online" : "💵 COD"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <span className="text-xl font-bold text-[#5EAED4] font-display">
                  ₹{order.totalAmount}
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs">Customer</span>
                    <p className="font-medium text-[#2C1810]">{order.deliveryDetails.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Phone</span>
                    <p className="font-medium text-[#2C1810]">{order.deliveryDetails.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Location</span>
                    <p className="font-medium text-[#2C1810]">
                      {order.deliveryDetails.city}, {order.deliveryDetails.pincode}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400 text-xs">Address</span>
                  <p className="text-sm text-gray-700">{order.deliveryDetails.address}</p>
                </div>
                {order.deliveryDetails.note && (
                  <div className="mt-2">
                    <span className="text-gray-400 text-xs">Note</span>
                    <p className="text-sm text-gray-700 italic">{order.deliveryDetails.note}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 rounded-lg bg-pink-50 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-[#2C1810] truncate block">{item.name}</span>
                      <span className="text-xs text-gray-400">
                        {item.size && `${item.size}`}{item.colors && ` • ${item.colors}`} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-[#2C1810]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Status Update */}
              <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-sm text-gray-500 font-medium">Update Status:</span>
                <div className="flex flex-wrap gap-2">
                  {(["placed", "processing", "shipped", "delivered", "cancelled"] as const).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => order.id && handleStatusChange(order.id, status)}
                        disabled={order.status === status || updatingId === order.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          order.status === status
                            ? `${getStatusColor(status)} ring-2 ring-offset-1 ring-current`
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingId === order.id ? "..." : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}
