"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders, cancelOrder, saveOrderReview, requestReturnOrReplacement, Order } from "@/lib/orders";
import { getBankAccounts, getUpiDetails, BankAccount, UpiDetail } from "@/lib/bankDetails";

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

export default function OrdersPage({ onNavigate }: OrdersPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Feedback modal state
  const [feedbackOrder, setFeedbackOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [savingFeedback, setSavingFeedback] = useState(false);

  // Return/replacement modal state
  const [returnOrder, setReturnOrder] = useState<Order | null>(null);
  const [returnType, setReturnType] = useState<"return" | "replacement">("return");
  const [returnReason, setReturnReason] = useState("");
  const [savingReturn, setSavingReturn] = useState(false);

  // Bank/UPI for refund
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [upis, setUpis] = useState<UpiDetail[]>([]);
  const [refundMethodId, setRefundMethodId] = useState<string>("");

  const loadOrders = () => {
    if (user) {
      getUserOrders(user.uid)
        .then((data) => { setOrders(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
      // Load saved bank/UPI for refunds
      getBankAccounts(user.uid).then(setBanks).catch(() => {});
      getUpiDetails(user.uid).then(setUpis).catch(() => {});
    } else if (!authLoading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const handleCancel = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrder(orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "cancelled" } : o));
    } catch {
      alert("Failed to cancel order");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).slice(0, 4).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((prev) => [...prev, reader.result as string].slice(0, 4));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackOrder?.id || rating === 0) {
      alert("Please give a star rating");
      return;
    }
    setSavingFeedback(true);
    try {
      await saveOrderReview(feedbackOrder.id, { rating, comment, photos });
      setOrders((prev) => prev.map((o) => o.id === feedbackOrder.id
        ? { ...o, review: { rating, comment, photos, createdAt: new Date() } }
        : o));
      setFeedbackOrder(null);
      setRating(0); setComment(""); setPhotos([]);
    } catch {
      alert("Failed to save feedback");
    }
    setSavingFeedback(false);
  };

  const handleSubmitReturn = async () => {
    if (!returnOrder?.id || !returnReason.trim()) {
      alert("Please provide a reason");
      return;
    }
    // For returns, a refund method (bank/UPI) is required
    if (returnType === "return" && !refundMethodId) {
      alert("Please select or add a bank account / UPI for the refund");
      return;
    }
    setSavingReturn(true);
    try {
      await requestReturnOrReplacement(returnOrder.id, returnType, returnReason);
      const newStatus = returnType === "return" ? "return-requested" : "replacement-requested";
      setOrders((prev) => prev.map((o) => o.id === returnOrder.id ? { ...o, status: newStatus as Order["status"], returnReason } : o));
      setReturnOrder(null);
      setReturnReason("");
      setRefundMethodId("");
    } catch {
      alert("Failed to submit request");
    }
    setSavingReturn(false);
  };

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
        <h2 className="font-display text-2xl font-bold text-[#2C1810] mb-4">Login Required</h2>
        <button onClick={() => onNavigate("login")} className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full">Login / Sign Up</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">📦</span>
        <h2 className="font-display text-2xl font-bold text-[#2C1810] mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-8">You haven&apos;t placed any orders yet.</p>
        <button onClick={() => onNavigate("products")} className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full">Browse Products</button>
      </div>
    );
  }

  const statusSteps = ["placed", "processing", "shipped", "delivered"];
  const getStatusStep = (status: string) => statusSteps.indexOf(status);

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      placed: "Order Placed", processing: "Processing", shipped: "Shipped",
      delivered: "Delivered", cancelled: "Cancelled",
      "return-requested": "Return Requested", "replacement-requested": "Replacement Requested",
      returned: "Returned", replaced: "Replaced",
    };
    return map[status] || status;
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      placed: "text-blue-600 bg-blue-50", processing: "text-orange-600 bg-orange-50",
      shipped: "text-purple-600 bg-purple-50", delivered: "text-green-600 bg-green-50",
      cancelled: "text-red-600 bg-red-50",
      "return-requested": "text-amber-600 bg-amber-50", "replacement-requested": "text-amber-600 bg-amber-50",
      returned: "text-gray-600 bg-gray-100", replaced: "text-gray-600 bg-gray-100",
    };
    return map[status] || "text-gray-600 bg-gray-50";
  };

  const formatDate = (t: any) => {
    if (!t) return "";
    const d = t.toDate ? t.toDate() : new Date(t);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const isTrackable = (s: string) => statusSteps.includes(s);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2C1810] mb-1">My Orders</h1>
      <p className="text-gray-500 text-xs sm:text-sm mb-6">{orders.length} order{orders.length > 1 ? "s" : ""}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order.id;
          const currentStep = getStatusStep(order.status);
          const canCancel = ["placed", "processing"].includes(order.status);
          const isDelivered = order.status === "delivered";

          return (
            <div key={order.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isExpanded ? "sm:col-span-2" : ""}`}>
              {/* Clickable Header */}
              <div onClick={() => setExpandedOrder(isExpanded ? null : order.id || null)} className="cursor-pointer p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex gap-3">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-white bg-pink-50 overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images/House_of_gnapakam_logo.jpeg"; }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0 ml-1">
                    <p className="text-xs sm:text-sm font-medium text-[#2C1810] truncate">{order.items.map((i) => i.name).join(", ")}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.items.reduce((s, i) => s + i.quantity, 0)} item(s) • {order.paymentMethod === "online" ? "Paid Online" : "COD"}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-[#2C1810] text-sm sm:text-base">₹{order.totalAmount}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-4 sm:px-5 pb-5">
                  {/* Timeline */}
                  {isTrackable(order.status) ? (
                    <div className="py-5">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                        <div className="absolute top-4 left-0 h-1 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] rounded-full transition-all duration-500" style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}></div>
                        {statusSteps.map((step, idx) => (
                          <div key={step} className="flex flex-col items-center relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${idx <= currentStep ? "bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white border-[#89C4E1]" : "bg-white text-gray-400 border-gray-200"}`}>
                              {idx <= currentStep ? "✓" : idx + 1}
                            </div>
                            <span className={`text-[10px] sm:text-xs mt-2 font-medium ${idx <= currentStep ? "text-[#5EAED4]" : "text-gray-400"}`}>
                              {step === "placed" && "Ordered"}{step === "processing" && "Processing"}{step === "shipped" && "Shipped"}{step === "delivered" && "Delivered"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <span className={`font-medium text-sm ${order.status === "cancelled" ? "text-red-500" : "text-amber-600"}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-3 pt-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="w-12 h-12 rounded-xl bg-pink-50 overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images/House_of_gnapakam_logo.jpeg"; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#2C1810]">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.size && `${item.size}`}{item.colors && ` • ${item.colors}`} • Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#2C1810]">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Delivery Address</h4>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-sm font-medium text-[#2C1810]">{order.deliveryDetails.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.deliveryDetails.address}, {order.deliveryDetails.city} - {order.deliveryDetails.pincode}</p>
                      <p className="text-xs text-gray-500 mt-1">📞 {order.deliveryDetails.phone}</p>
                    </div>
                  </div>

                  {/* Existing review display */}
                  {order.review && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Your Review</h4>
                      <div className="text-yellow-400 text-sm">{"★".repeat(order.review.rating)}{"☆".repeat(5 - order.review.rating)}</div>
                      {order.review.comment && <p className="text-sm text-gray-600 mt-1">{order.review.comment}</p>}
                      {order.review.photos && order.review.photos.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {order.review.photos.map((p, i) => (
                            <img key={i} src={p} alt="review" className="w-14 h-14 rounded-lg object-cover" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                    {/* Cancel — only before shipping */}
                    {canCancel && (
                      <button onClick={() => order.id && handleCancel(order.id)} className="px-4 py-2 rounded-full text-sm font-medium border border-red-300 text-red-500 hover:bg-red-50">
                        Cancel Order
                      </button>
                    )}
                    {order.status === "shipped" && (
                      <p className="text-xs text-gray-400 italic w-full">Note: Order already shipped — cancellation is no longer available.</p>
                    )}

                    {/* After delivery: feedback + return/replacement */}
                    {isDelivered && !order.review && (
                      <button onClick={() => { setFeedbackOrder(order); setRating(0); setComment(""); setPhotos([]); }} className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white">
                        ⭐ Give Feedback
                      </button>
                    )}
                    {isDelivered && (
                      <button onClick={() => { setReturnOrder(order); setReturnType("return"); setReturnReason(""); }} className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50">
                        Return / Replace
                      </button>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-400">Order ID: #{order.id?.slice(-8).toUpperCase()}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feedback Modal */}
      {feedbackOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setFeedbackOrder(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-[#2C1810] mb-1">How is the product?</h3>
            <p className="text-sm text-gray-500 mb-4">{feedbackOrder.items[0]?.name} was delivered. Share your experience!</p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className={`text-4xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>
                  ★
                </button>
              ))}
            </div>

            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us about the product..." rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#89C4E1] outline-none text-gray-900 resize-none mb-4" />

            {/* Photo upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos</label>
              <div className="flex gap-2 flex-wrap">
                {photos.map((p, i) => (
                  <div key={i} className="relative w-16 h-16">
                    <img src={p} alt="upload" className="w-full h-full rounded-lg object-cover" />
                    <button onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#89C4E1]">
                    <span className="text-2xl text-gray-400">📷</span>
                    <input type="file" accept="image/*" capture="environment" multiple onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Tap to take a photo or upload from gallery (up to 4)</p>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSubmitFeedback} disabled={savingFeedback} className="flex-1 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full disabled:opacity-50">
                {savingFeedback ? "Saving..." : "Submit Feedback"}
              </button>
              <button onClick={() => setFeedbackOrder(null)} className="px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-full">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Return/Replacement Modal */}
      {returnOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setReturnOrder(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-[#2C1810] mb-4">Return or Replace</h3>

            <div className="flex gap-3 mb-4">
              <button onClick={() => setReturnType("return")} className={`flex-1 py-3 rounded-2xl border-2 text-sm font-medium ${returnType === "return" ? "border-[#89C4E1] bg-sky-50 text-[#5EAED4]" : "border-gray-200 text-gray-600"}`}>
                🔄 Return<br /><span className="text-xs font-normal">Get a refund</span>
              </button>
              <button onClick={() => setReturnType("replacement")} className={`flex-1 py-3 rounded-2xl border-2 text-sm font-medium ${returnType === "replacement" ? "border-[#89C4E1] bg-sky-50 text-[#5EAED4]" : "border-gray-200 text-gray-600"}`}>
                📦 Replace<br /><span className="text-xs font-normal">Get a new one</span>
              </button>
            </div>

            <textarea value={returnReason} onChange={(e) => setReturnReason(e.target.value)} placeholder="Reason for return/replacement..." rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#89C4E1] outline-none text-gray-900 resize-none mb-4" />

            {/* Refund method — only for returns */}
            {returnType === "return" && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Where should we refund?</p>
                {(banks.length === 0 && upis.length === 0) ? (
                  <div className="text-center py-3 bg-sky-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-2">No bank/UPI added yet</p>
                    <button
                      onClick={() => { setReturnOrder(null); onNavigate("bank-details"); }}
                      className="text-sm text-[#5EAED4] font-medium hover:underline"
                    >
                      + Add Bank / UPI Details
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {upis.map((u) => (
                      <label key={u.id} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${refundMethodId === `upi-${u.id}` ? "border-[#89C4E1] bg-sky-50" : "border-gray-200"}`}>
                        <input type="radio" name="refund" checked={refundMethodId === `upi-${u.id}`} onChange={() => setRefundMethodId(`upi-${u.id}`)} className="accent-[#89C4E1]" />
                        <span className="text-sm text-[#2C1810]">📱 {u.upiId}</span>
                        {u.verified && <span className="text-[10px] text-green-600 ml-auto">✓ Verified</span>}
                      </label>
                    ))}
                    {banks.map((b) => (
                      <label key={b.id} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${refundMethodId === `bank-${b.id}` ? "border-[#89C4E1] bg-sky-50" : "border-gray-200"}`}>
                        <input type="radio" name="refund" checked={refundMethodId === `bank-${b.id}`} onChange={() => setRefundMethodId(`bank-${b.id}`)} className="accent-[#89C4E1]" />
                        <span className="text-sm text-[#2C1810]">🏦 {b.bankName} ••••{b.accountNumber.slice(-4)}</span>
                      </label>
                    ))}
                    <button
                      onClick={() => { setReturnOrder(null); onNavigate("bank-details"); }}
                      className="text-xs text-[#5EAED4] font-medium hover:underline mt-1"
                    >
                      + Add another account
                    </button>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-gray-400 mb-4">
              {returnType === "return"
                ? "After we receive the returned product, your refund will be sent to the selected bank/UPI within 5-7 business days."
                : "The product will be replaced with a new one after pickup."}
            </p>

            <div className="flex gap-3">
              <button onClick={handleSubmitReturn} disabled={savingReturn} className="flex-1 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full disabled:opacity-50">
                {savingReturn ? "Submitting..." : "Submit Request"}
              </button>
              <button onClick={() => setReturnOrder(null)} className="px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-full">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
