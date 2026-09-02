"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { saveOrder } from "@/lib/orders";
import { getUserAddresses, addAddress, Address } from "@/lib/addresses";

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

type PaymentMethod = "online" | "cod";

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    note: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressesLoaded, setAddressesLoaded] = useState(false);

  // Load saved addresses
  useEffect(() => {
    if (user) {
      getUserAddresses(user.uid).then((addrs) => {
        setSavedAddresses(addrs);
        setAddressesLoaded(true);
        if (addrs.length === 0) {
          setShowNewAddress(true);
        } else {
          // Pre-select default or first address
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id || null);
            setFormData((prev) => ({
              ...prev,
              name: defaultAddr.name,
              phone: defaultAddr.phone,
              address: defaultAddr.address,
              city: defaultAddr.city,
              pincode: defaultAddr.pincode,
            }));
          }
        }
      }).catch(() => setAddressesLoaded(true));
    }
  }, [user]);

  // Auto-fill city from pincode
  const handlePincodeChange = async (pincode: string) => {
    setFormData((prev) => ({ ...prev, pincode }));
    if (pincode.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: `${po.District}, ${po.State}`,
          }));
        }
      } catch {}
    }
  };

  const selectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id || null);
    setShowNewAddress(false);
    setFormData((prev) => ({
      ...prev,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      pincode: addr.pincode,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "pincode") {
      handlePincodeChange(e.target.value);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    setLoading(true);

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay failed to load. Please check your internet connection.");
      setLoading(false);
      return;
    }

    // Step 1: Create order on server
    let order;
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          receipt: `order_${Date.now()}`,
          notes: {
            customer_name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
          },
        }),
      });

      order = await res.json();

      if (!res.ok) {
        throw new Error(order.error || "Failed to create order");
      }
    } catch (err: any) {
      alert("Could not initiate payment. Please try again.");
      setLoading(false);
      return;
    }

    // Step 2: Open Razorpay checkout with server-created order
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "The House Of Gnapakam",
      description: `Order: ${items.map((i) => i.name).join(", ")}`,
      order_id: order.id,
      handler: async function (response: any) {
        // Step 3: Verify payment on server
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.verified) {
            // Save order to Firebase
            try {
              await saveOrder({
                userId: user!.uid,
                userEmail: user!.email || "",
                userName: user!.displayName || formData.name,
                items: items.map((i) => ({
                  name: i.name,
                  price: i.price,
                  quantity: i.quantity,
                  size: i.size,
                  colors: i.colors,
                  customNote: i.customNote,
                  image: i.image,
                })),
                totalAmount: totalPrice,
                paymentMethod: "online",
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                status: "placed",
                deliveryDetails: formData,
                createdAt: new Date(),
              });
            } catch (err) {
              console.error("Failed to save order:", err);
            }
            // Send order confirmation email
            try {
              await fetch("/api/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "order-confirmed",
                  to: user!.email,
                  data: {
                    orderId: Date.now().toString(),
                    customerName: formData.name,
                    items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
                    totalAmount: totalPrice,
                    paymentMethod: "online",
                    address: formData.address,
                    city: formData.city,
                    pincode: formData.pincode,
                  },
                }),
              });
            } catch {}
            setOrderPlaced(true);
            setLoading(false);
            clearCart();
          } else {
            setLoading(false);
            alert("Payment verification failed. If money was deducted, it will be refunded within 5-7 days.");
          }
        } catch (err) {
          setLoading(false);
          alert("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        order_note: formData.note,
        items: JSON.stringify(items.map((i) => ({
          name: i.name,
          qty: i.quantity,
          price: i.price,
          size: i.size,
          colors: i.colors,
          note: i.customNote,
        }))),
      },
      theme: {
        color: "#89C4E1",
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.on("payment.failed", function () {
      setLoading(false);
      alert("Payment failed. Please try again.");
    });
    razorpay.open();
  };

  const handleCOD = async () => {
    setLoading(true);
    // Save COD order to Firebase
    try {
      await saveOrder({
        userId: user!.uid,
        userEmail: user!.email || "",
        userName: user!.displayName || formData.name,
        items: items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          colors: i.colors,
          customNote: i.customNote,
          image: i.image,
        })),
        totalAmount: totalPrice,
        paymentMethod: "cod",
        status: "placed",
        deliveryDetails: formData,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Failed to save order:", err);
    }
    // Send order confirmation email
    try {
      await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order-confirmed",
          to: user!.email,
          data: {
            orderId: Date.now().toString(),
            customerName: formData.name,
            items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
            totalAmount: totalPrice,
            paymentMethod: "cod",
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
          },
        }),
      });
    } catch {}
    setOrderPlaced(true);
    clearCart();
    setLoading(false);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill in all required fields");
      return;
    }

    // Save address if new
    if (showNewAddress && user) {
      addAddress({
        userId: user.uid,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        isDefault: savedAddresses.length === 0,
      }).catch(() => {});
    }

    if (paymentMethod === "online") {
      handleOnlinePayment();
    } else {
      handleCOD();
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-7xl block mb-6">🎉</span>
        <h2 className="font-display text-3xl font-bold text-[#2C1810] mb-4">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-2">
          Thank you for your order! We&apos;ll start crafting your beautiful bouquet.
        </p>
        {paymentMethod === "cod" && (
          <p className="text-[#5EAED4] font-medium mb-2">
            💵 Cash on Delivery — Pay ₹{totalPrice} when you receive your order.
          </p>
        )}
        {paymentMethod === "online" && (
          <p className="text-green-600 font-medium mb-2">
            ✅ Payment received successfully!
          </p>
        )}
        <p className="text-gray-500 mb-8">
          You&apos;ll receive a confirmation on WhatsApp at {formData.phone}.
        </p>
        <button
          onClick={() => onNavigate("home")}
          className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full hover:shadow-xl transition-all"
        >
          Back to Home
        </button>
        <button
          onClick={() => onNavigate("orders")}
          className="block mx-auto mt-3 text-[#5EAED4] font-medium hover:underline"
        >
          View My Orders
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    onNavigate("cart");
    return null;
  }

  // Require login to checkout
  if (authLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading...</p>
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
          Please login to your account to proceed with checkout. This helps us track your orders and send updates.
        </p>
        <button
          onClick={() => onNavigate("login")}
          className="px-8 py-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-pink-200/50 transition-all text-lg"
        >
          Login / Sign Up
        </button>
        <p className="text-gray-400 text-sm mt-4">
          Your cart items are saved and will be here when you come back.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-[#2C1810] mb-8">Checkout 🌸</h1>

      <form onSubmit={handlePlaceOrder} autoComplete="off">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
              <h2 className="font-display text-xl font-semibold text-[#2C1810]">
                📍 Delivery Details
              </h2>

              {/* Saved Addresses */}
              {addressesLoaded && savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Choose a saved address:</p>
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr.id && !showNewAddress
                          ? "border-[#89C4E1] bg-sky-50/50"
                          : "border-gray-200 hover:border-sky-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddressId === addr.id && !showNewAddress}
                        onChange={() => selectSavedAddress(addr)}
                        className="mt-1 w-4 h-4 accent-[#89C4E1]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#2C1810]">{addr.name}</p>
                        <p className="text-xs text-gray-500">{addr.address}</p>
                        <p className="text-xs text-gray-500">{addr.city} - {addr.pincode}</p>
                        <p className="text-xs text-gray-400">📞 {addr.phone}</p>
                      </div>
                      {addr.isDefault && (
                        <span className="ml-auto text-[10px] bg-[#89C4E1] text-white px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setShowNewAddress(true); setSelectedAddressId(null); setFormData({ name: "", phone: "", email: "", address: "", city: "", pincode: "", note: "" }); }}
                    className={`w-full p-4 rounded-2xl border-2 border-dashed text-sm font-medium transition-all ${
                      showNewAddress
                        ? "border-[#89C4E1] bg-sky-50/50 text-[#5EAED4]"
                        : "border-gray-300 text-gray-500 hover:border-sky-300"
                    }`}
                  >
                    + Add New Address
                  </button>
                </div>
              )}

              {/* New address form (show if no saved addresses or user clicked + Add New) */}
              {(showNewAddress || savedAddresses.length === 0) && (
                <div className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white/80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="House no, Street, Area, Landmark"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none resize-none text-gray-900 bg-white/80"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="500001"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Note (optional)</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Any special instructions"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-gray-900 bg-white/80"
                />
              </div>
              </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="glass-card rounded-3xl p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-[#2C1810] mb-5">
                💳 Payment Method
              </h2>

              <div className="space-y-4">
                {/* Online Payment */}
                <label
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-[#89C4E1] bg-sky-50/50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="mt-1 w-5 h-5 text-[#89C4E1] accent-[#89C4E1]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-[#2C1810]">
                      Pay Online
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      UPI (PhonePe, GPay, Paytm) • Credit/Debit Cards • Net Banking • Wallets
                    </p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="glass-card px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600">📱 PhonePe</span>
                      <span className="glass-card px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600">📱 GPay</span>
                      <span className="glass-card px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600">📱 Paytm</span>
                      <span className="glass-card px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600">💳 Cards</span>
                      <span className="glass-card px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600">🏦 Net Banking</span>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#89C4E1] bg-sky-50/50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 w-5 h-5 text-[#89C4E1] accent-[#89C4E1]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-[#2C1810]">
                      💵 Cash on Delivery
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay when you receive your order. Available for all locations.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="glass-card rounded-3xl p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold text-[#2C1810] mb-5">
                🛒 Order Summary
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <div>
                      <span className="text-gray-700 font-medium">{item.name}</span>
                      <span className="text-gray-400 block text-xs">
                        {item.size} {item.colors && `• ${item.colors}`} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-[#2C1810]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
                  <span className="font-bold text-[#2C1810] text-lg">Total</span>
                  <span className="font-bold text-2xl text-[#5EAED4] font-display">₹{totalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-pink-200/50 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "online"
                  ? `Pay ₹${totalPrice}`
                  : `Place Order (COD) — ₹${totalPrice}`
                }
              </button>

              {paymentMethod === "online" && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  🔒 Secured by Razorpay
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
