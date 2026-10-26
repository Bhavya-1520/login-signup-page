"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDone: () => void;
  duration?: number; // ms the splash stays fully visible before fading out
}

export default function SplashScreen({ onDone, duration = 2200 }: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), duration);
    const doneTimer = setTimeout(() => onDone(), duration + 700); // + fade duration
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#E3F4FC] via-[#FDF2F8] to-[#F0F9FF] transition-opacity duration-700 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Soft floating decorations */}
      <div className="absolute top-[18%] left-[16%] text-2xl opacity-30 splash-float">🌸</div>
      <div className="absolute bottom-[20%] right-[18%] text-2xl opacity-30 splash-float-slow">✿</div>

      {/* Logo with a glowing ring */}
      <div className="relative mb-6">
        <span className="absolute inset-0 rounded-full splash-ring"></span>
        <img
          src="/images/House_of_gnapakam_logo.jpeg"
          alt="The House Of Gnapakam"
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-xl ring-4 ring-white splash-pop"
        />
      </div>

      {/* Brand name */}
      <div className="flex flex-col items-center leading-none splash-rise">
        <span className="text-[11px] sm:text-xs font-elegant tracking-[0.35em] text-[#3A7C9A] font-semibold uppercase">
          The House Of
        </span>
        <span className="brand-name text-3xl sm:text-4xl mt-1">Gnapakam</span>
      </div>

      {/* Loading bar */}
      <div className="mt-8 w-40 h-1.5 rounded-full bg-white/60 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] splash-bar"></div>
      </div>
      <p className="mt-3 text-xs text-[#5EAED4] tracking-wide splash-rise">Handcrafted with love…</p>
    </div>
  );
}
