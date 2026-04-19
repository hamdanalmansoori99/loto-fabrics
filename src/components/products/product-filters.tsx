"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { COLLECTIONS, COLOR_FAMILIES } from "@/lib/collections";
import type { Collection, ColorFamily } from "@/types/product";

export interface FilterState {
  collection: Collection | null;
  fabric: string | null;
  colorFamily: ColorFamily | null;
  maxPrice: number;
}

interface ProductFiltersProps {
  state: FilterState;
  onChange: (state: FilterState) => void;
  availableFabrics: string[];
  maxPriceCap: number;
  variant?: "rail" | "sheet";
}

export function ProductFilters({
  state,
  onChange,
  availableFabrics,
  maxPriceCap,
  variant = "rail",
}: ProductFiltersProps) {
  const t = useTranslations("products");
  const locale = useLocale();

  const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className={cn(variant === "rail" ? "py-4 border-b border-border/50" : "py-3")}>
      <h3 className="label-xs text-bronze mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className={cn(variant === "rail" ? "space-y-1" : "space-y-0")}>
      <Group title={t("collection")}>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              checked={state.collection === null}
              onChange={() => onChange({ ...state, collection: null })}
              className="w-3.5 h-3.5 accent-espresso"
            />
            <span className="text-sm text-foreground group-hover:text-espresso-soft">
              {t("all")}
            </span>
          </label>
          {COLLECTIONS.map((c) => (
            <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                checked={state.collection === c.id}
                onChange={() => onChange({ ...state, collection: c.id })}
                className="w-3.5 h-3.5 accent-espresso"
              />
              <span className="text-sm text-foreground group-hover:text-espresso-soft">
                {locale === "ar" ? c.nameAr : c.nameEn}
              </span>
            </label>
          ))}
        </div>
      </Group>

      <Group title={t("fabric_type")}>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...state, fabric: null })}
            className={cn(
              "px-3 py-1.5 text-xs border transition-colors",
              state.fabric === null
                ? "border-espresso bg-espresso text-cream"
                : "border-border text-foreground hover:border-espresso"
            )}
          >
            {t("all")}
          </button>
          {availableFabrics.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onChange({ ...state, fabric: f })}
              className={cn(
                "px-3 py-1.5 text-xs border transition-colors capitalize",
                state.fabric === f
                  ? "border-espresso bg-espresso text-cream"
                  : "border-border text-foreground hover:border-espresso"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Group>

      <Group title={t("color_family")}>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...state, colorFamily: null })}
            className={cn(
              "px-3 py-1.5 text-xs border transition-colors",
              state.colorFamily === null
                ? "border-espresso bg-espresso text-cream"
                : "border-border text-foreground hover:border-espresso"
            )}
          >
            {t("all")}
          </button>
          {COLOR_FAMILIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange({ ...state, colorFamily: c.id })}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors",
                state.colorFamily === c.id
                  ? "border-espresso bg-espresso text-cream"
                  : "border-border text-foreground hover:border-espresso"
              )}
            >
              <span
                className="inline-block w-3 h-3 rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
                aria-hidden
              />
              {locale === "ar" ? c.nameAr : c.nameEn}
            </button>
          ))}
        </div>
      </Group>

      <Group title={t("price_range")}>
        <input
          type="range"
          min={100}
          max={maxPriceCap}
          step={20}
          value={state.maxPrice}
          onChange={(e) => onChange({ ...state, maxPrice: Number(e.target.value) })}
          className="w-full accent-espresso"
        />
        <div className="mt-2 flex items-center justify-between label-xs text-muted-foreground">
          <span>AED 100</span>
          <span className="text-foreground">Up to AED {state.maxPrice}</span>
        </div>
      </Group>
    </div>
  );
}
