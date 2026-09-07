"use client";

import { useState, useEffect } from "react";

interface HeroCarouselProps {
  onNavigate: (page: string) => void;
}

const slides = [
  {
    image: "/images/Horse+Letter.jpeg",
    price: "Horse & Letter Combo starting at ₹599",
    link: "product-raksha-bandhan-combo",
  },
  {
    image: "/images/Horse.jpeg",
    price: "Decorated Horse starting at ₹499",
    link: "product-raksha-bandhan-horse",
  },
  {
    image: "/images/satin boquet.png",
    price: "Bouquets starting at ₹199",
    link: "product-satin-ribbon-bouquet",
  },
  {
    image: "/images/SunFlowerBoquet.jpeg",
    price: "Sunflower Bouquets starting at ₹249",
    link: "product-sunflower-bouquet",
  },
  {
    image: "/images/NormalPipecleanerboquet.jpeg",
    price: "Pipe Cleaner Bouquets starting at ₹99",
    link: "product-pipe-cleaner-bouquet",
  },
  {
    image: "/images/Potrait Boquet.jpeg",
    price: "Photo Bouquets starting at ₹299",
    link: "product-portrait-bouquet",
  },
];

export default function HeroCarousel({ onNavigate }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
  const next = () => setCurrent((current + 1) % slides.length);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F0F9FF] via-white to-[#FDF2F8]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`transition-all duration-700 ease-in-out ${
            index === current ? "block" : "hidden"
          }`}
        >
          <div
            onClick={() => onNavigate(slide.link)}
            className="relative w-full cursor-pointer"
          >
            {/* Image with dots inside at bottom */}
            <div className="relative w-full h-[38vh] sm:h-[55vh] lg:h-[65vh] bg-gradient-to-br from-[#F0F9FF] to-[#FDF2F8]">
              <img
                src={slide.image}
                alt={slide.price}
                className="w-full h-full object-contain"
              />
              {/* Dots inside image */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                    className={`transition-all duration-300 rounded-full ${
                      i === current ? "w-6 h-2 bg-white shadow" : "w-2 h-2 bg-white/60"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Caption bar BELOW dots — clean, own space */}
            <div className="text-center py-4 sm:py-6 px-4">
              <p className="text-[#2C3E50] font-display text-base sm:text-2xl font-bold mb-3">
                {slide.price}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate(slide.link); }}
                className="px-6 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-lg transition-all text-xs sm:text-sm"
              >
                Shop Now →
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - vertically centered on the image area only */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-6 top-[18vh] sm:top-[27vh] z-20 w-8 h-8 sm:w-11 sm:h-11 bg-white/80 rounded-full flex items-center justify-center text-[#5EAED4] hover:bg-white shadow-md transition-all"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-6 top-[18vh] sm:top-[27vh] z-20 w-8 h-8 sm:w-11 sm:h-11 bg-white/80 rounded-full flex items-center justify-center text-[#5EAED4] hover:bg-white shadow-md transition-all"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

    </section>
  );
}
