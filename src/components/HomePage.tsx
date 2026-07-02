"use client";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden section-rose">
        {/* Floating flowers decoration */}
        <div className="absolute top-10 left-[5%] text-4xl animate-float opacity-40">🌸</div>
        <div className="absolute top-20 right-[10%] text-3xl animate-float-slow opacity-30">🌹</div>
        <div className="absolute bottom-20 left-[15%] text-2xl animate-float opacity-25">✿</div>
        <div className="absolute bottom-10 right-[20%] text-4xl animate-float-slow opacity-30">🌷</div>
        <div className="absolute top-40 left-[40%] text-2xl animate-float opacity-20">💮</div>
        <div className="absolute top-10 right-[35%] text-3xl animate-float-slow opacity-25">🪻</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-[#C77DA5] font-medium mb-6 border border-pink-100">
              <span>🌸</span> Handcrafted with Love
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-[#3D2B1F] leading-tight">
              Bouquets That
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A0BF] to-[#C77DA5]">
                Bloom Forever
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed font-light max-w-2xl mx-auto">
              Exquisite handcrafted satin ribbon & pipe cleaner bouquets that capture eternal beauty.
              The perfect gift that never wilts.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate("products")}
                className="px-8 py-4 bg-gradient-to-r from-[#E8A0BF] to-[#C77DA5] text-white font-medium rounded-full hover:shadow-xl hover:shadow-pink-200/50 transition-all hover:-translate-y-0.5"
              >
                Explore Collection
              </button>
              <button
                onClick={() => onNavigate("raksha-bandhan")}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-[#E8A0BF] text-[#C77DA5] font-medium rounded-full hover:bg-white hover:shadow-lg transition-all"
              >
                🎀 Raksha Bandhan Special
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Raksha Bandhan Banner */}
      <section className="bg-gradient-to-r from-[#E8A0BF] via-[#D4A76A] to-[#E8A0BF] py-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1 left-[10%] text-white text-xl">✨</div>
          <div className="absolute top-2 right-[15%] text-white text-lg">🎀</div>
          <div className="absolute top-1 left-[50%] text-white text-xl">✨</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <p className="text-white font-display text-xl sm:text-2xl font-semibold">
            🎀 Raksha Bandhan Special — Combos starting at ₹499
          </p>
          <p className="text-white/80 text-sm mt-1">
            Vintage Letter + Bouquet + Rakhi + Customized Gifts | Order before Aug 25th!
          </p>
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8A0BF] font-medium tracking-wider uppercase text-sm mb-2">Our Collections</p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#3D2B1F]">
              Crafted with Passion
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Each piece is lovingly handmade, designed to bring joy that lasts a lifetime
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Satin Ribbon */}
            <div
              onClick={() => onNavigate("products")}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%222%22%20fill%3D%22%23E8A0BF%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')] opacity-50"></div>
                <span className="text-7xl group-hover:scale-125 transition-transform duration-500">🌹</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-[#3D2B1F] group-hover:text-[#C77DA5] transition-colors">
                  Satin Ribbon Bouquets
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Elegant roses crafted from luxurious satin ribbons
                </p>
                <p className="text-[#E8A0BF] font-semibold mt-3">Starting at ₹199</p>
              </div>
            </div>

            {/* Pipe Cleaner */}
            <div
              onClick={() => onNavigate("products")}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%222%22%20fill%3D%22%23A78BFA%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')] opacity-50"></div>
                <span className="text-7xl group-hover:scale-125 transition-transform duration-500">💐</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-[#3D2B1F] group-hover:text-[#C77DA5] transition-colors">
                  Pipe Cleaner Bouquets
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Vibrant, colorful flowers in any shade you desire
                </p>
                <p className="text-[#E8A0BF] font-semibold mt-3">Starting at ₹99</p>
              </div>
            </div>

            {/* Gifts & Combos */}
            <div
              onClick={() => onNavigate("raksha-bandhan")}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%222%22%20fill%3D%22%23D4A76A%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')] opacity-50"></div>
                <span className="text-7xl group-hover:scale-125 transition-transform duration-500">🎁</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-[#3D2B1F] group-hover:text-[#C77DA5] transition-colors">
                  Gifts & Combos
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Magnets, pots, portraits & festival specials
                </p>
                <p className="text-[#E8A0BF] font-semibold mt-3">Starting at ₹149</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 section-sage relative overflow-hidden">
        <div className="absolute top-5 right-[5%] text-3xl opacity-20 animate-float">🍃</div>
        <div className="absolute bottom-5 left-[5%] text-2xl opacity-20 animate-float-slow">🌿</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3D2B1F]">
              Why Choose Loom & Bloom?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center glass-card rounded-3xl p-8">
              <div className="text-5xl mb-4">♾️</div>
              <h3 className="font-display text-lg font-semibold text-[#3D2B1F] mb-2">Everlasting Beauty</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Our bouquets stay beautiful forever — no watering, no wilting, just eternal charm</p>
            </div>
            <div className="text-center glass-card rounded-3xl p-8">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="font-display text-lg font-semibold text-[#3D2B1F] mb-2">Your Colors, Your Way</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Complete customization — choose any color, any size, any style you dream of</p>
            </div>
            <div className="text-center glass-card rounded-3xl p-8">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="font-display text-lg font-semibold text-[#3D2B1F] mb-2">Made with Love</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Every single flower is handcrafted with care and attention to the smallest details</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-3xl p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-3xl opacity-20">🌸</div>
            <div className="absolute bottom-4 right-4 text-3xl opacity-20">🌷</div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3D2B1F] mb-4">
              Follow Our Journey
            </h2>
            <p className="text-gray-500 mb-6">See our latest creations and behind-the-scenes on Instagram</p>
            <a
              href="https://instagram.com/loomandbloom.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-medium rounded-full hover:shadow-xl transition-all"
            >
              📸 @loomandbloom.studio
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3D2B1F] text-white py-14 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8A0BF] via-[#D4A76A] to-[#A8C5A0]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌸</span>
                <span className="font-display text-xl font-bold text-[#E8A0BF]">Loom & Bloom Studio</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Handcrafted permanent bouquets that capture beauty and preserve memories forever.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#D4A76A]">Quick Links</h4>
              <div className="space-y-2.5 text-sm text-gray-400">
                <button onClick={() => onNavigate("products")} className="block hover:text-[#E8A0BF] transition-colors">Shop All</button>
                <button onClick={() => onNavigate("raksha-bandhan")} className="block hover:text-[#E8A0BF] transition-colors">Raksha Bandhan</button>
                <button onClick={() => onNavigate("about")} className="block hover:text-[#E8A0BF] transition-colors">About Us</button>
                <button onClick={() => onNavigate("contact")} className="block hover:text-[#E8A0BF] transition-colors">Contact</button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#D4A76A]">Connect With Us</h4>
              <div className="space-y-2.5 text-sm text-gray-400">
                <a href="https://instagram.com/loomandbloom.studio" target="_blank" rel="noopener noreferrer" className="block hover:text-[#E8A0BF] transition-colors">
                  📸 @loomandbloom.studio
                </a>
                <a href="https://wa.me/919346630240" target="_blank" rel="noopener noreferrer" className="block hover:text-[#E8A0BF] transition-colors">
                  💬 +91 9346630240
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
            © 2026 Loom & Bloom Studio. Made with 🌸 and love.
          </div>
        </div>
      </footer>
    </div>
  );
}
