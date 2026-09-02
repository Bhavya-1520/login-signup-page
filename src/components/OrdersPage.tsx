"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders, Order } from "@/lib/orders";

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

export default function OrdersPage({ onNavigate }: OrdersPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getUserOrders(user.uid)
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

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading your orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🔐</span>
        <h2 className="font-display text-3xl font-bold text-[#2C1810] mb-4">
          Login Required
        </h2>
        <p className="text-gray-600 mb-8">
          Please login to view your order history.
        </p>
        <button
          onClick={() => onNavigate("login")}
          className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-pink-200/50 transition-all text-lg"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">📦</span>
        <h2 className="font-display text-3xl font-bold text-[#2C1810] mb-4">
          No Orders Yet
        </h2>
        <p className="text-gray-600 mb-8">
          You haven&apos;t placed any orders yet. Start shopping to see your orders here!
        </p>
        <button
          onClick={() => onNavigate("products")}
          className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-pink-200/50 transition-all text-lg"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const statusSteps = ["placed", "processing", "shipped", "delivered"];

  const getStatusStep = (status: string) => {
    if (status === "cancelled") return -1;
    return statusSteps.indexOf(status);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "placed": return "Order Placed";
      case "processing": return "Processing";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed": return "text-blue-600 bg-blue-50";
      case "processing": return "text-orange-600 bg-orange-50";
      case "shipped": return "text-purple-600 bg-purple-50";
      case "delivered": return "text-green-600 bg-green-50";
      case "cancelled": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (timestamp: any) => {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1810]">
            My Orders
          </h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} order{orders.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order.id;
          const currentStep = getStatusStep(order.status);

          return (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Order Card - Clickable Header */}
              <div
                onClick={() => setExpandedOrder(isExpanded ? null : order.id || null)}
                className="cursor-pointer p-4 sm:p-5"
              >
                {/* Top: Status badge + Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Items Preview */}
                <div className="flex gap-3">
                  {/* Product Images */}
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="w-14 h-14 rounded-xl border-2 border-white bg-pink-50 overflow-hidden flex-shrink-0 shadow-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/images/House_of_gnapakam_logo.jpeg"; }}
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-14 h-14 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-xs font-bold text-gray-500">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0 ml-2">
                    <p className="text-sm font-medium text-[#2C1810] truncate">
                      {order.items.map((i) => i.name).join(", ")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} item{order.items.length > 1 ? "s" : ""} • {order.paymentMethod === "online" ? "Paid Online" : "Cash on Delivery"}
                    </p>
                  </div>

                  {/* Total + Arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-[#2C1810]">₹{order.totalAmount}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-4 sm:px-5 pb-5">
                  {/* Order Tracking Timeline */}
                  {order.status !== "cancelled" ? (
                    <div className="py-5">
                      <div className="flex items-center justify-between relative">
                        {/* Progress Line Background */}
                        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                        {/* Progress Line Active */}
                        <div
                          className="absolute top-4 left-0 h-1 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] rounded-full transition-all duration-500"
                          style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                        ></div>

                        {statusSteps.map((step, idx) => (
                          <div key={step} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                idx <= currentStep
                                  ? "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white border-[#89C4E1]"
                                  : "bg-white text-gray-400 border-gray-200"
                              }`}
                            >
                              {idx <= currentStep ? "✓" : idx + 1}
                            </div>
                            <span className={`text-[10px] sm:text-xs mt-2 font-medium text-center ${
                              idx <= currentStep ? "text-[#5EAED4]" : "text-gray-400"
                            }`}>
                              {step === "placed" && "Ordered"}
                              {step === "processing" && "Processing"}
                              {step === "shipped" && "Shipped"}
                              {step === "delivered" && "Delivered"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <span className="text-red-500 font-medium text-sm">❌ This order has been cancelled</span>
                    </div>
                  )}

                  {/* Order Items Detail */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="w-12 h-12 rounded-xl bg-pink-50 overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/House_of_gnapakam_logo.jpeg"; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#2C1810]">{item.name}</p>
                          <p className="text-xs text-gray-400">
                            {item.size && `Size: ${item.size}`}
                            {item.colors && ` • Color: ${item.colors}`}
                            {` • Qty: ${item.quantity}`}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#2C1810]">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Subtotal</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#2C1810] pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-[#5EAED4]">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</h4>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-sm font-medium text-[#2C1810]">{order.deliveryDetails.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.deliveryDetails.address}</p>
                      <p className="text-xs text-gray-500">{order.deliveryDetails.city} - {order.deliveryDetails.pincode}</p>
                      <p className="text-xs text-gray-500 mt-1">Phone: {order.deliveryDetails.phone}</p>
                    </div>
                  </div>

                  {/* Order Meta */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
                    <span>Order ID: #{order.id?.slice(-8).toUpperCase()}</span>
                    <span>Placed: {formatDateTime(order.createdAt)}</span>
                    {order.paymentId && <span>Payment ID: {order.paymentId.slice(-10)}</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
