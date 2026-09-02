"use client";

import HeroCarousel from "./HeroCarousel";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel onNavigate={onNavigate} />

      {/* Raksha Bandhan Banner */}
      <section className="relative py-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/Rakshabandhan1.jpeg" alt="" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-white/70"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <p className="text-[#2C1810] font-display text-xl sm:text-2xl font-semibold">
              Raksha Bandhan Special — Premium Horse + Letter starting at just ₹499!
            </p>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Order before Aug 25th for guaranteed delivery
          </p>
          <button
            onClick={() => onNavigate("raksha-bandhan")}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full text-sm hover:shadow-lg transition-all"
          >
            Shop Combos →
          </button>
        </div>
      </section>

      {/* Collections - with floral background */}
      <section className="section-floral-pink py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[#5EAED4] font-semibold tracking-wider uppercase text-sm mb-3">Our Collections</p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#2C1810]">
              Crafted with Passion
            </h2>
            <p className="text-gray-600 mt-3 max-w-lg mx-auto text-sm sm:text-base">
              Each piece is lovingly handmade, designed to bring joy that lasts a lifetime
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Satin Ribbon */}
            <div
              onClick={() => onNavigate("product-satin-ribbon-bouquet")}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-sky-200/40 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="h-56 relative overflow-hidden bg-white">
                <img
                  src="/images/satin boquet.png"
                  alt="Satin Ribbon Bouquets"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-[#2C1810] group-hover:text-[#5EAED4] transition-colors">
                  Satin Ribbon Bouquets
                </h3>
                <p className="text-gray-500 text-sm mt-1">Elegant roses crafted from satin ribbons</p>
                <p className="text-[#5EAED4] font-bold mt-2">Starting at ₹199</p>
              </div>
            </div>

            {/* Sunflower */}
            <div
              onClick={() => onNavigate("product-sunflower-bouquet")}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-sky-200/40 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="h-56 relative overflow-hidden bg-white">
                <img
                  src="/images/SunFlowerBoquet.jpeg"
                  alt="Sunflower Bouquet"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-[#2C1810] group-hover:text-[#5EAED4] transition-colors">
                  Pipe Cleaner Bouquets
                </h3>
                <p className="text-gray-500 text-sm mt-1">Vibrant, colorful flowers in any shade</p>
                <p className="text-[#5EAED4] font-bold mt-2">Starting at ₹99</p>
              </div>
            </div>

            {/* Raksha Bandhan Horse Combo */}
            <div
              onClick={() => onNavigate("product-raksha-bandhan-combo")}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-sky-200/40 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="h-56 relative overflow-hidden bg-white">
                <img
                  src="/images/Horse+Letter.jpeg"
                  alt="Raksha Bandhan Horse Combo"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-[#2C1810] group-hover:text-[#5EAED4] transition-colors">
                  Premium Horse & Letter Combo
                </h3>
                <p className="text-gray-500 text-sm mt-1">Raksha Bandhan special handcrafted combo</p>
                <p className="text-[#5EAED4] font-bold mt-2">₹599</p>
              </div>
            </div>

          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate("products")}
              className="px-10 py-4 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-sky-200/40 transition-all hover:-translate-y-1 text-lg"
            >
              View All Collections →
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us - garden background */}
      <section className="section-floral-garden py-10 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#2C1810]">
              Why The House Of Gnapakam?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center glass-card rounded-2xl p-5 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl sm:text-5xl mb-3">♾️</div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#2C1810] mb-2">Everlasting Beauty</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Our handcrafted gifts stay beautiful forever. No maintenance needed — just eternal charm and color.</p>
            </div>
            <div className="text-center glass-card rounded-2xl p-5 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl sm:text-5xl mb-3">🎨</div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#2C1810] mb-2">Fully Customizable</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Not just bouquets — we craft all kinds of handmade giftables. Any color, any design, any occasion.</p>
            </div>
            <div className="text-center glass-card rounded-2xl p-5 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl sm:text-5xl mb-3">💝</div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#2C1810] mb-2">Made with Love</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Every piece is handcrafted with passion and care — bouquets, hampers, cards, magnets, and more!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-10 sm:py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[#5EAED4] font-medium tracking-wider text-sm mb-2">Handcrafted Gifts, Delivered With Love</p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#2C1810]">
              What Our Happy Customers Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Review 1 */}
            <div className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <div className="text-yellow-400 text-base mb-2">★★★★★</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                &quot;The Raksha Bandhan horse combo was a hit! My brother loved it. Quality is amazing 😍&quot;
              </p>
              <p className="font-semibold text-[#2C1810] text-sm">— Priya S. <span className="text-[#5EAED4]">✓</span></p>
            </div>

            {/* Review 2 */}
            <div className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <div className="text-yellow-400 text-base mb-2">★★★★★</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                &quot;Beautiful sunflower bouquet, same as the picture on the website. Thank you for making my wife&apos;s day special!&quot;
              </p>
              <p className="font-semibold text-[#2C1810] text-sm">— Rahul M. <span className="text-[#5EAED4]">✓</span></p>
            </div>

            {/* Review 3 */}
            <div className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <div className="text-yellow-400 text-base mb-2">★★★★★</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                &quot;Lovely pipe cleaner bouquet! The colors were exactly what I asked for. Will order again for sure.&quot;
              </p>
              <p className="font-semibold text-[#2C1810] text-sm">— Ananya K. <span className="text-[#5EAED4]">✓</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram CTA - wildflower background */}
      <section className="section-floral-wild py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-3xl p-6 sm:p-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1810] mb-4">
              Follow Our Journey 📸
            </h2>
            <p className="text-gray-600 mb-8 text-lg">See our latest creations and behind-the-scenes magic</p>
            <a
              href="https://www.instagram.com/the_house_of_gnapakam?igsh=aXYwaDdnMXphNzF2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 max-w-full px-5 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold rounded-full hover:shadow-2xl transition-all text-sm sm:text-lg hover:-translate-y-1 break-all"
            >
              <span className="flex-shrink-0">📸</span>
              <span className="truncate">@the_house_of_gnapakam</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-floral text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🌸</span>
                <span className="font-display text-2xl font-bold text-[#89C4E1]">The House Of Gnapakam</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                All handmade giftables — bouquets, hampers, cards, magnets, decorated horses & more. Crafted with love, made to last forever.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-[#89C4E1] text-lg">Quick Links</h4>
              <div className="space-y-3 text-gray-300">
                <button onClick={() => onNavigate("products")} className="block hover:text-white transition-colors">Shop All</button>
                <button onClick={() => onNavigate("raksha-bandhan")} className="block hover:text-white transition-colors">Raksha Bandhan</button>
                <button onClick={() => onNavigate("about")} className="block hover:text-white transition-colors">About Us</button>
                <button onClick={() => onNavigate("contact")} className="block hover:text-white transition-colors">Contact</button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-[#89C4E1] text-lg">Connect With Us</h4>
              <div className="space-y-3 text-gray-300">
                <a href="https://wa.me/919346630240?text=Hi%20The%20House%20Of%20Gnapakam!" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                  💬 WhatsApp: +91 9346630240
                </a>
                <a href="https://www.instagram.com/the_house_of_gnapakam?igsh=aWlmcGZmcXU0anhs" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                  📸 Instagram: @the_house_of_gnapakam
                </a>
                <a href="https://www.facebook.com/share/19WQswuron/" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                  👍 Facebook
                </a>
                <a href="https://youtube.com/@the_house_of_gnapakam?si=O8aSUHn1MDyya8ul" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                  ▶️ YouTube
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            © 2026 The House Of Gnapakam. Made with 🌸 and love.
          </div>
        </div>
      </footer>
    </div>
  );
}
