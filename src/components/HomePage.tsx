"use client";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF8F4] via-[#F5E6D3] to-[#FDF8F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[#D4A574] font-medium tracking-wider uppercase text-sm mb-4">
              Handcrafted with Love
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C1810] leading-tight">
              Bouquets That Last
              <span className="text-[#8B5E3C]"> Forever</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Beautiful handcrafted satin ribbon and pipe cleaner bouquets that never wilt.
              The perfect gift for every occasion — made just for you.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate("products")}
                className="px-8 py-4 bg-[#8B5E3C] text-white font-medium rounded-full hover:bg-[#6B4A2E] transition-all shadow-lg hover:shadow-xl"
              >
                Shop Now
              </button>
              <button
                onClick={() => onNavigate("raksha-bandhan")}
                className="px-8 py-4 border-2 border-[#8B5E3C] text-[#8B5E3C] font-medium rounded-full hover:bg-[#8B5E3C] hover:text-white transition-all"
              >
                🎀 Raksha Bandhan Combos
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#D4A574]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#8B5E3C]/5 rounded-full blur-2xl"></div>
      </section>

      {/* Raksha Bandhan Banner */}
      <section className="bg-gradient-to-r from-[#8B5E3C] to-[#D4A574] py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white font-display text-xl sm:text-2xl">
            🎀 Raksha Bandhan Special Combos — Starting at ₹499
          </p>
          <p className="text-white/80 text-sm mt-1">
            Vintage Letter + Bouquet + Rakhi + Gifts | Order before Aug 25th!
          </p>
          <button
            onClick={() => onNavigate("raksha-bandhan")}
            className="mt-3 px-6 py-2 bg-white text-[#8B5E3C] font-medium rounded-full text-sm hover:bg-gray-100 transition-colors"
          >
            View Combos →
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2C1810]">
              Our Collections
            </h2>
            <p className="text-gray-600 mt-3">Handcrafted with care, designed to last</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Satin Ribbon */}
            <div
              onClick={() => onNavigate("products")}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="aspect-square bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center">
                <span className="text-6xl">🌹</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-[#2C1810] group-hover:text-[#8B5E3C] transition-colors">
                  Satin Ribbon Bouquets
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Elegant roses made from satin ribbons. Starting at ₹199
                </p>
              </div>
            </div>

            {/* Pipe Cleaner */}
            <div
              onClick={() => onNavigate("products")}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-violet-50 flex items-center justify-center">
                <span className="text-6xl">💐</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-[#2C1810] group-hover:text-[#8B5E3C] transition-colors">
                  Pipe Cleaner Bouquets
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Colorful and cute flower bouquets. Starting at ₹99
                </p>
              </div>
            </div>

            {/* Gifts & Combos */}
            <div
              onClick={() => onNavigate("raksha-bandhan")}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
                <span className="text-6xl">🎁</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-[#2C1810] group-hover:text-[#8B5E3C] transition-colors">
                  Gifts & Combos
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Fridge magnets, pots, portrait bouquets & more
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-[#2C1810]">
              Why Loom & Bloom?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">♾️</div>
              <h3 className="font-semibold text-[#2C1810] mb-2">Lasts Forever</h3>
              <p className="text-gray-600 text-sm">Unlike real flowers, our bouquets stay beautiful for years</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-semibold text-[#2C1810] mb-2">Fully Customizable</h3>
              <p className="text-gray-600 text-sm">Choose your colors, size, and style. Made just for you</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="font-semibold text-[#2C1810] mb-2">Handcrafted with Love</h3>
              <p className="text-gray-600 text-sm">Every piece is carefully made by hand with attention to detail</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C1810] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display text-xl font-bold text-[#D4A574]">Loom & Bloom Studio</h3>
              <p className="text-gray-400 text-sm mt-2">Handcrafted bouquets that last forever</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <button onClick={() => onNavigate("products")} className="block hover:text-white">Shop</button>
                <button onClick={() => onNavigate("about")} className="block hover:text-white">About</button>
                <button onClick={() => onNavigate("contact")} className="block hover:text-white">Contact</button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="https://instagram.com/loomandbloom.studio" target="_blank" rel="noopener noreferrer" className="block hover:text-white">
                  📸 @loomandbloom.studio
                </a>
                <a href="https://wa.me/919346630240" target="_blank" rel="noopener noreferrer" className="block hover:text-white">
                  💬 WhatsApp: +91 9346630240
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2026 Loom & Bloom Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
