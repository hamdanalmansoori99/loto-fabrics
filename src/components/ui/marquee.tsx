import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Number of times to repeat children for seamless loop (default 4) */
  repeat?: number;
}

/**
 * Infinite horizontal marquee. Children are repeated to fill; CSS animation
 * scrolls by -50% (one copy width) for seamless loop. Respects
 * prefers-reduced-motion via globals.css.
 */
export function Marquee({ children, className, repeat = 4 }: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden w-full", className)}>
      <div className="marquee-track">
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="shrink-0 flex items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
