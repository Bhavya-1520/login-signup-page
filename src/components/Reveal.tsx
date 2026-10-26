"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** direction of entrance */
  variant?: "up" | "left" | "right" | "scale";
  /** delay in ms (for staggering a row of items) */
  delay?: number;
  className?: string;
  /** render as a different tag if needed */
  as?: keyof JSX.IntrinsicElements;
}

export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already in view on mount (e.g. above the fold), reveal immediately.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variantClass =
    variant === "left"
      ? "reveal reveal-left"
      : variant === "right"
      ? "reveal reveal-right"
      : variant === "scale"
      ? "reveal reveal-scale"
      : "reveal";

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={`${variantClass} ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
