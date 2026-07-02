"use client";

import { useState, useEffect } from "react";

interface HeroCarouselProps {
  onNavigate: (page: string) => void;
}

const slides = [
  {
    image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=1920&q=90",
    title: "Satin Ribbon Rose Bouquets",
    subtitle: "Elegant handcrafted roses that last forever",
    price: "Starting at ₹199",
    cta: "Shop Now",
    link: "products",
  },
  {
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1920&q=90",
    title: "Pipe Cleaner Bouquets",
    subtitle: "Colorful, cute & customizable in any shade",
    price: "Starting at ₹99",
    cta: "Explore Colors",
    link: "products",
  },
  {
    image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=1920&q=90",
    title: "Portrait & Photo Bouquets",
    subtitle: "Personalized bouquets with your precious memories",
    price: "Starting at ₹299",
    cta: "Create Yours",
    link: "product-portrait-bouquet",
  },
  {
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=90",
    title: "Raksha Bandhan Combos",
    subtitle: "Vintage letter + Bouquet + Rakhi + Gifts",
    price: "Combo at ₹499",
    cta: "Order Now",
    link: "raksha-bandhan",
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
    <section className="relative h-[85vh] sm:h-[90vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-100/80 via-white/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-sky-50/90 via-transparent to-sky-100/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div className="max-w-xl">
                <div
                  className={`transition-all duration-1000 delay-300 ${
                    index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
                  <span className="inline-block glass-card px-4 py-2 rounded-full text-sm text-[#9B5DE5] font-semibold mb-6">
                    🌸 Loom & Bloom Studio
                  </span>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C1810] leading-tight mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-700 mb-3">
                    {slide.subtitle}
                  </p>
                  <p className="text-2xl font-bold text-[#C77DA5] font-display mb-8">
                    {slide.price}
                  </p>
                  <button
                    onClick={() => onNavigate(slide.link)}
                    className="px-10 py-4 bg-gradient-to-r from-[#E8A0BF] to-[#9B5DE5] text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-pink-300/40 transition-all hover:-translate-y-1 text-lg"
                  >
                    {slide.cta} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass-card rounded-full flex items-center justify-center text-[#C77DA5] hover:bg-white/90 transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass-card rounded-full flex items-center justify-center text-[#C77DA5] hover:bg-white/90 transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? "w-10 h-3 bg-gradient-to-r from-[#E8A0BF] to-[#9B5DE5]"
                : "w-3 h-3 bg-white/60 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
