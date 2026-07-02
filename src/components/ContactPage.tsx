"use client";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-[#2C1810]">
          Get in Touch
        </h1>
        <p className="text-gray-600 mt-2">We&apos;d love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* WhatsApp */}
        <a
          href="https://wa.me/919346630240"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all text-center group"
        >
          <span className="text-5xl block mb-4">💬</span>
          <h3 className="font-display text-xl font-semibold text-[#2C1810] group-hover:text-[#8B5E3C] transition-colors">
            WhatsApp
          </h3>
          <p className="text-gray-600 mt-2">+91 9346630240</p>
          <p className="text-sm text-[#8B5E3C] mt-3 font-medium">Chat with us →</p>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/loomandbloom.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all text-center group"
        >
          <span className="text-5xl block mb-4">📸</span>
          <h3 className="font-display text-xl font-semibold text-[#2C1810] group-hover:text-[#8B5E3C] transition-colors">
            Instagram
          </h3>
          <p className="text-gray-600 mt-2">@loomandbloom.studio</p>
          <p className="text-sm text-[#8B5E3C] mt-3 font-medium">Follow us →</p>
        </a>
      </div>

      {/* FAQ */}
      <div className="mt-16 bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-[#2C1810] mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-[#2C1810]">How long do the bouquets last?</h3>
            <p className="text-gray-600 text-sm mt-1">Forever! Our handcrafted bouquets are made from durable materials and will stay beautiful for years.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#2C1810]">Can I customize my order?</h3>
            <p className="text-gray-600 text-sm mt-1">Absolutely! You can choose your colors, size, and add special requests. We make everything to order.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#2C1810]">How long does delivery take?</h3>
            <p className="text-gray-600 text-sm mt-1">Since each piece is handcrafted, please allow 3-5 days for preparation. Delivery time depends on your location.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#2C1810]">Do you ship pan-India?</h3>
            <p className="text-gray-600 text-sm mt-1">Yes! We deliver across India. Shipping charges may apply based on location.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
