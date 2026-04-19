"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Animation variant. "mask" uses clip-path, "fade" uses opacity+translateY */
  variant?: "mask" | "fade";
  /** Delay in ms (for stagger) */
  delay?: number;
  /** Intersection threshold (0-1) */
  threshold?: number;
}

/**
 * Scroll-triggered reveal wrapper. Uses IntersectionObserver.
 * Styles defined in globals.css (.reveal-mask, .animate-fade-up).
 */
export function Reveal({
  children,
  className,
  variant = "fade",
  delay = 0,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setVisible(true), delay);
          obs.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, threshold]);

  const baseClass = variant === "mask" ? "reveal-mask" : "animate-fade-up";

  return (
    <div ref={ref} className={cn(baseClass, visible && "visible", className)}>
      {children}
    </div>
  );
}

/**
 * Word-stagger animation for hero titles. Splits text into words and reveals
 * each with a cascading delay.
 */
export function StaggerWords({
  text,
  className,
  delay = 0,
  wordDelay = 80,
}: {
  text: string;
  className?: string;
  delay?: number;
  wordDelay?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={cn("stagger-word", visible && "visible")}
          style={{ transitionDelay: `${i * wordDelay}ms` }}
        >
          {word}
          {i < words.length - 1 && <>&nbsp;</>}
        </span>
      ))}
    </span>
  );
}
