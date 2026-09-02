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
            className="relative w-full h-[45vh] sm:h-[60vh] lg:h-[70vh] cursor-pointer"
          >
            {/* Full image */}
            <img
              src={slide.image}
              alt={slide.price}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

            {/* Text overlay on the image */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10 text-center">
              <p className="text-white font-display text-lg sm:text-3xl font-bold drop-shadow-lg mb-3">
                {slide.price}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate(slide.link); }}
                className="px-5 sm:px-8 py-2 sm:py-3 bg-white/90 text-[#5EAED4] font-semibold rounded-full hover:bg-white transition-all text-xs sm:text-base shadow-lg"
              >
                Shop Now →
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 glass-card rounded-full flex items-center justify-center text-[#5EAED4] hover:bg-white/90 transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 glass-card rounded-full flex items-center justify-center text-[#5EAED4] hover:bg-white/90 transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? "w-8 sm:w-10 h-2.5 sm:h-3 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC]"
                : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
