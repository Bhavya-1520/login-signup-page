"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as = "div",
}: RevealProps) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (!node) return;

    // Fallback: if IntersectionObserver isn't available, just show it.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shown.current) {
            shown.current = true;
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);

    // Safety: if it's already in view at mount, reveal on next frame.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0 && !shown.current) {
      requestAnimationFrame(() => {
        shown.current = true;
        setVisible(true);
      });
    }

    return () => observer.disconnect();
  }, [node]);

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
      ref={setNode}
      className={`${variantClass} ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
