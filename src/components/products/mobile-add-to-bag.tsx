"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MobileAddToBagProps {
  /** Quantity (meters for fabric, pieces for garments) */
  meters: number;
  /** Unit price (per meter or per piece) */
  pricePerMeter: number;
  onAdd: () => void;
  /** Ref to the inline CTA element — sticky bar shows when this goes out of view */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Override the unit label (defaults to t("common.per_meter")) — used for per-piece products */
  unitLabel?: string;
}

/**
 * Mobile-only sticky add-to-bag bar. Appears (slide-up) once the inline
 * add-to-cart button scrolls out of view. Hidden on lg+.
 *
 * For per-piece products, pass `meters` as the piece count and `unitLabel`
 * as the per-piece string (e.g. "per piece").
 */
export function MobileAddToBag({
  meters,
  pricePerMeter,
  onAdd,
  triggerRef,
  unitLabel,
}: MobileAddToBagProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = triggerRef.current;
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -1px 0px" }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [triggerRef]);

  const subtotal = meters * pricePerMeter;
  const isPerPiece = !!unitLabel;
  const unitLine = isPerPiece
    ? `${meters} × ${formatPrice(pricePerMeter, locale)} / ${unitLabel}`
    : `${meters}m · ${formatPrice(pricePerMeter, locale)} / ${t("common.per_meter")}`;

  return (
    <div
      ref={barRef}
      className={cn(
        "lg:hidden fixed inset-x-0 bottom-0 z-40 frosted-dark text-cream safe-bottom",
        "transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="label-xs text-cream/70 truncate">{unitLine}</p>
          <p className="price-num text-base text-cream font-medium">{formatPrice(subtotal, locale)}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-cream text-espresso px-5 py-3 label-sm hover:bg-pink-salt transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          {t("common.add_to_cart")}
        </button>
      </div>
    </div>
  );
}
