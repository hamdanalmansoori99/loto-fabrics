"use client";

import { useFadeIn } from "@/hooks/use-fade-in";

export default function FadeSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useFadeIn();

  return (
    <div ref={ref} className={`animate-fade-up ${className}`}>
      {children}
    </div>
  );
}
