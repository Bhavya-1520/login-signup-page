"use client";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-[#2C1810]">
          About The House Of Gnapakam
        </h1>
        <p className="text-[#D4A574] mt-2 font-medium">Handcrafted with love, designed to last</p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="text-center">
          <span className="text-6xl">🌸</span>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-[#8B5E3C]">The House Of Gnapakam</span> — where
            creativity meets craftsmanship. We specialize in creating beautiful handmade giftables that
            capture precious memories and last a lifetime.
          </p>

          <p>
            Every piece in our collection is meticulously handcrafted with love — from permanent bouquets
            and personalized magazines to resin art and photo frames. Unlike ordinary gifts, our creations
            are made to be treasured forever, making them the perfect keepsake.
          </p>

          <p>
            Whether it&apos;s a birthday, anniversary, Raksha Bandhan, or just because — every creation
            is customized to your preferences. Your choice of colors, size, design, and style, crafted
            just for you.
          </p>

          <div className="bg-[#F0F9FF] rounded-2xl p-6 mt-8">
            <h3 className="font-display text-lg font-semibold text-[#2C1810] mb-3">What we offer:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">🌹 Satin Ribbon Rose Bouquets</li>
              <li className="flex items-center gap-2">💐 Pipe Cleaner Flower Bouquets</li>
              <li className="flex items-center gap-2">🌻 Sunflower Bouquets</li>
              <li className="flex items-center gap-2">📖 Personalized Magazines</li>
              <li className="flex items-center gap-2">🖼️ Photo Frames & Portrait Bouquets</li>
              <li className="flex items-center gap-2">💍 Resin Art & Resin Bangles</li>
              <li className="flex items-center gap-2">🎂 Birthday Cards & Hampers</li>
              <li className="flex items-center gap-2">🧲 Custom Fridge Magnets</li>
              <li className="flex items-center gap-2">🐴 Festival Special Combos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
