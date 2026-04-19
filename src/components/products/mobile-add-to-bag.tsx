"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MobileAddToBagProps {
  meters: number;
  pricePerMeter: number;
  onAdd: () => void;
  /** Ref to the inline CTA element — sticky bar shows when this goes out of view */
  triggerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Mobile-only sticky add-to-bag bar. Appears (slide-up) once the inline
 * add-to-cart button scrolls out of view. Hidden on lg+.
 */
export function MobileAddToBag({
  meters,
  pricePerMeter,
  onAdd,
  triggerRef,
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
          <p className="label-xs text-cream/70">{meters}m · {formatPrice(pricePerMeter, locale)} / {t("common.per_meter")}</p>
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
