"use client";

import { useState, useEffect } from "react";

interface HeroCarouselProps {
  onNavigate: (page: string) => void;
}

const slides = [
  {
    image: "/images/Horse+Letter.jpeg",
    title: "Customised Premium Decorated Horse & Letter Combo",
    subtitle: "Handcrafted decorated horse + vintage letter + Rakhi",
    price: "Combo at ₹599",
    cta: "Order Now",
    link: "product-raksha-bandhan-combo",
  },
  {
    image: "/images/Horse.jpeg",
    title: "Premium Decorated Horse",
    subtitle: "A beautifully handcrafted premium decorated horse",
    price: "Starting at ₹499",
    cta: "Shop Now",
    link: "product-raksha-bandhan-horse",
  },
  {
    image: "/images/satin boquet.png",
    title: "Satin Ribbon Rose Bouquets",
    subtitle: "Elegant handcrafted roses that last forever",
    price: "Starting at ₹199",
    cta: "Shop Now",
    link: "product-satin-ribbon-bouquet",
  },
  {
    image: "/images/SunFlowerBoquet.jpeg",
    title: "Sunflower Bouquet",
    subtitle: "Bright and cheerful handcrafted sunflowers",
    price: "Starting at ₹249",
    cta: "Explore",
    link: "product-sunflower-bouquet",
  },
  {
    image: "/images/NormalPipecleanerboquet.jpeg",
    title: "Pipe Cleaner Bouquets",
    subtitle: "Colorful, cute & customizable in any shade",
    price: "Starting at ₹99",
    cta: "Explore Colors",
    link: "product-pipe-cleaner-bouquet",
  },
  {
    image: "/images/Potrait Boquet.jpeg",
    title: "Portrait Photo Bouquets",
    subtitle: "Your precious memories beautifully arranged as a bouquet",
    price: "Starting at ₹299",
    cta: "Create Yours",
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
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[60vh] sm:min-h-[70vh] py-10 sm:py-16">
              {/* Left: Image (no card, just the picture) */}
              <div className="flex items-center justify-center order-1">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-[40vh] sm:h-[55vh] object-contain"
                />
              </div>

              {/* Right: Caption */}
              <div
                className={`order-2 transition-all duration-700 delay-200 ${
                  index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <span className="inline-block glass-card px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm text-[#5EAED4] font-semibold mb-4 sm:mb-6">
                  🌸 The House Of Gnapakam
                </span>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1810] leading-tight mb-3 sm:mb-4">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 mb-3">
                  {slide.subtitle}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[#5EAED4] font-display mb-6 sm:mb-8">
                  {slide.price}
                </p>
                <button
                  onClick={() => onNavigate(slide.link)}
                  className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-sky-200/40 transition-all hover:-translate-y-1 text-sm sm:text-lg"
                >
                  {slide.cta} →
                </button>
              </div>
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
