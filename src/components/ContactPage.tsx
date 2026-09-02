"use client";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#2C1810]">
          Get in Touch
        </h1>
        <p className="text-gray-600 mt-2">We&apos;d love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* WhatsApp */}
        <a
          href="https://wa.me/919346630240?text=Hi%20The%20House%20Of%20Gnapakam!%20I%20have%20a%20question."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all text-center group flex flex-col items-center"
        >
          <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <h3 className="font-display text-xl font-semibold text-[#2C1810] group-hover:text-[#5EAED4] transition-colors">
            WhatsApp
          </h3>
          <p className="text-gray-600 mt-2">+91 9346630240</p>
          <p className="text-sm text-[#5EAED4] mt-3 font-medium">Chat with us →</p>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/the_house_of_gnapakam?igsh=aWlmcGZmcXU0anhs"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all text-center group flex flex-col items-center"
        >
          <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24" fill="none">
            <defs>
              <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="5%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
              </radialGradient>
            </defs>
            <rect width="24" height="24" rx="6" fill="url(#ig-gradient)" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
          </svg>
          <h3 className="font-display text-xl font-semibold text-[#2C1810] group-hover:text-[#5EAED4] transition-colors">
            Instagram
          </h3>
          <p className="text-gray-600 mt-2">@the_house_of_gnapakam</p>
          <p className="text-sm text-[#5EAED4] mt-3 font-medium">Follow us →</p>
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/share/19WQswuron/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all text-center group flex flex-col items-center"
        >
          <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <h3 className="font-display text-xl font-semibold text-[#2C1810] group-hover:text-[#5EAED4] transition-colors">
            Facebook
          </h3>
          <p className="text-gray-600 mt-2">The House Of Gnapakam</p>
          <p className="text-sm text-[#5EAED4] mt-3 font-medium">Follow us →</p>
        </a>

        {/* YouTube */}
        <a
          href="https://youtube.com/@the_house_of_gnapakam?si=O8aSUHn1MDyya8ul"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all text-center group flex flex-col items-center"
        >
          <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <h3 className="font-display text-xl font-semibold text-[#2C1810] group-hover:text-[#5EAED4] transition-colors">
            YouTube
          </h3>
          <p className="text-gray-600 mt-2">@the_house_of_gnapakam</p>
          <p className="text-sm text-[#5EAED4] mt-3 font-medium">Subscribe →</p>
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
