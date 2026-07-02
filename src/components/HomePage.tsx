"use client";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero Section - Big floral background */}
      <section className="hero-floral relative min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full text-sm text-[#C77DA5] font-medium mb-8">
              <span>🌸</span> Handcrafted with Love & Care
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold text-[#2C1810] leading-[1.1]">
              Bouquets That
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A0BF] via-[#C77DA5] to-[#9B5DE5]">
                Bloom Forever
              </span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Exquisite handcrafted satin ribbon & pipe cleaner bouquets that capture eternal beauty.
              The perfect gift that never wilts, never fades.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
              <button
                onClick={() => onNavigate("products")}
                className="px-10 py-4 bg-gradient-to-r from-[#E8A0BF] to-[#9B5DE5] text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-pink-300/40 transition-all hover:-translate-y-1 text-lg"
              >
                ✨ Explore Collection
              </button>
              <button
                onClick={() => onNavigate("raksha-bandhan")}
                className="px-10 py-4 glass-card text-[#C77DA5] font-semibold rounded-full hover:shadow-xl transition-all hover:-translate-y-1 text-lg border-2 border-pink-200"
              >
                🎀 Raksha Bandhan Special
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Raksha Bandhan Banner */}
      <section className="bg-gradient-to-r from-[#9B5DE5] via-[#E8A0BF] to-[#F9A825] py-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1 left-[10%] text-2xl">✨</div>
          <div className="absolute top-2 right-[15%] text-xl">🎀</div>
          <div className="absolute top-1 left-[50%] text-2xl">✨</div>
          <div className="absolute top-2 left-[75%] text-xl">🌸</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <p className="text-white font-display text-xl sm:text-2xl font-semibold">
            🎀 Raksha Bandhan Special Combos — Starting at just ₹499!
          </p>
          <p className="text-white/80 text-sm mt-1">
            Vintage Letter + Bouquet + Rakhi + Gifts | Order before Aug 25th for guaranteed delivery
          </p>
          <button
            onClick={() => onNavigate("raksha-bandhan")}
            className="mt-4 px-6 py-2.5 bg-white text-[#9B5DE5] font-semibold rounded-full text-sm hover:shadow-lg transition-all"
          >
            Shop Combos →
          </button>
        </div>
      </section>

      {/* Collections - with floral background */}
      <section className="section-floral-pink py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#9B5DE5] font-semibold tracking-wider uppercase text-sm mb-3">Our Collections</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2C1810]">
              Crafted with Passion
            </h2>
            <p className="text-gray-600 mt-4 max-w-lg mx-auto text-lg">
              Each piece is lovingly handmade, designed to bring joy that lasts a lifetime
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Satin Ribbon */}
            <div
              onClick={() => onNavigate("products")}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-pink-200/40 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&q=80"
                  alt="Satin Ribbon Bouquets"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-7">
                <h3 className="font-display text-xl font-bold text-[#2C1810] group-hover:text-[#C77DA5] transition-colors">
                  Satin Ribbon Bouquets
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Elegant roses crafted from luxurious satin ribbons
                </p>
                <p className="text-[#9B5DE5] font-bold mt-3 text-lg">Starting at ₹199</p>
              </div>
            </div>

            {/* Pipe Cleaner */}
            <div
              onClick={() => onNavigate("products")}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=600&q=80"
                  alt="Pipe Cleaner Bouquets"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-7">
                <h3 className="font-display text-xl font-bold text-[#2C1810] group-hover:text-[#C77DA5] transition-colors">
                  Pipe Cleaner Bouquets
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Vibrant, colorful flowers in any shade you desire
                </p>
                <p className="text-[#9B5DE5] font-bold mt-3 text-lg">Starting at ₹99</p>
              </div>
            </div>

            {/* Gifts & Combos */}
            <div
              onClick={() => onNavigate("raksha-bandhan")}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-amber-200/40 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=600&q=80"
                  alt="Gifts and Combos"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-7">
                <h3 className="font-display text-xl font-bold text-[#2C1810] group-hover:text-[#C77DA5] transition-colors">
                  Gifts & Festival Combos
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Magnets, pots, portraits & Raksha Bandhan specials
                </p>
                <p className="text-[#9B5DE5] font-bold mt-3 text-lg">Starting at ₹149</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - garden background */}
      <section className="section-floral-garden py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2C1810]">
              Why Loom & Bloom?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center glass-card rounded-3xl p-10 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-6xl mb-5">♾️</div>
              <h3 className="font-display text-xl font-bold text-[#2C1810] mb-3">Everlasting Beauty</h3>
              <p className="text-gray-500 leading-relaxed">Our bouquets stay beautiful forever. No watering, no wilting — just eternal charm and color.</p>
            </div>
            <div className="text-center glass-card rounded-3xl p-10 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-6xl mb-5">🎨</div>
              <h3 className="font-display text-xl font-bold text-[#2C1810] mb-3">Your Colors, Your Way</h3>
              <p className="text-gray-500 leading-relaxed">Complete customization — any color, any size, any style. We make your dream bouquet a reality.</p>
            </div>
            <div className="text-center glass-card rounded-3xl p-10 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-6xl mb-5">💝</div>
              <h3 className="font-display text-xl font-bold text-[#2C1810] mb-3">Made with Love</h3>
              <p className="text-gray-500 leading-relaxed">Every flower is handcrafted with passion and care. Each piece tells a story of dedication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram CTA - wildflower background */}
      <section className="section-floral-wild py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-3xl p-12 sm:p-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2C1810] mb-4">
              Follow Our Journey 📸
            </h2>
            <p className="text-gray-600 mb-8 text-lg">See our latest creations and behind-the-scenes magic</p>
            <a
              href="https://instagram.com/loomandbloom.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold rounded-full hover:shadow-2xl transition-all text-lg hover:-translate-y-1"
            >
              📸 @loomandbloom.studio
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-floral text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🌸</span>
                <span className="font-display text-2xl font-bold text-[#E8A0BF]">Loom & Bloom</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Handcrafted permanent bouquets that capture beauty and preserve memories forever.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-[#E8A0BF] text-lg">Quick Links</h4>
              <div className="space-y-3 text-gray-300">
                <button onClick={() => onNavigate("products")} className="block hover:text-white transition-colors">Shop All</button>
                <button onClick={() => onNavigate("raksha-bandhan")} className="block hover:text-white transition-colors">Raksha Bandhan</button>
                <button onClick={() => onNavigate("about")} className="block hover:text-white transition-colors">About Us</button>
                <button onClick={() => onNavigate("contact")} className="block hover:text-white transition-colors">Contact</button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-[#E8A0BF] text-lg">Connect With Us</h4>
              <div className="space-y-3 text-gray-300">
                <a href="https://instagram.com/loomandbloom.studio" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                  📸 @loomandbloom.studio
                </a>
                <a href="https://wa.me/919346630240" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                  💬 WhatsApp: +91 9346630240
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            © 2026 Loom & Bloom Studio. Made with 🌸 and love.
          </div>
        </div>
      </footer>
    </div>
  );
}
