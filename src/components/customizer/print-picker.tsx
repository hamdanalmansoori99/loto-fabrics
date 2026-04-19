"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import {
  PRINT_FAMILIES,
  type PrintCategory,
  type PrintColourway,
} from "@/lib/print-catalog";
import { useCustomizerStore } from "@/stores/customizer-store";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER: PrintCategory[] = [
  "floral",
  "wave",
  "geometric",
  "paisley",
  "animal",
  "abstract",
];

// Flatten every colourway from every family into a single list tagged with
// the family's resolved category. Each entry becomes one button in the grid.
interface FlatSwatch extends PrintColourway {
  familyCategory: PrintCategory;
}

const ALL_SWATCHES: FlatSwatch[] = PRINT_FAMILIES.flatMap((fam) =>
  fam.colourways.map((cw) => ({ ...cw, familyCategory: fam.category }))
);

const COUNT_BY_CATEGORY: Record<PrintCategory, number> = CATEGORY_ORDER.reduce(
  (acc, cat) => {
    acc[cat] = ALL_SWATCHES.filter((s) => s.familyCategory === cat).length;
    return acc;
  },
  {} as Record<PrintCategory, number>
);

export default function PrintPicker() {
  const t = useTranslations("customizer");

  const {
    fabricPrintSku,
    fabricPrintScale,
    setFabricPrint,
    setFabricPrintScale,
    clearFabricPrint,
  } = useCustomizerStore();

  const activeCategories = useMemo<PrintCategory[]>(
    () => CATEGORY_ORDER.filter((c) => COUNT_BY_CATEGORY[c] > 0),
    []
  );

  const [activeCat, setActiveCat] = useState<PrintCategory>(
    activeCategories[0] ?? "floral"
  );

  const swatchesInCat = useMemo(
    () => ALL_SWATCHES.filter((s) => s.familyCategory === activeCat),
    [activeCat]
  );

  return (
    <div className="space-y-3">
      {/* Active print banner */}
      {fabricPrintSku && (
        <div className="flex items-center gap-3 border border-border bg-cream-warm px-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="label-xs text-bronze truncate">
              {t("print_active")}
            </p>
            <p className="price-num text-xs text-foreground truncate">
              {fabricPrintSku}
            </p>
          </div>
          <button
            type="button"
            onClick={clearFabricPrint}
            className="label-xs text-foreground hover:text-bronze transition-colors inline-flex items-center gap-1"
            aria-label={t("print_clear")}
          >
            <X className="h-3.5 w-3.5" />
            {t("print_clear")}
          </button>
        </div>
      )}

      {/* Category tabs — counts now show full SKU totals */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {activeCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCat(cat)}
            className={cn(
              "shrink-0 px-4 py-2 label-xs border transition-all min-h-[36px]",
              activeCat === cat
                ? "border-espresso bg-espresso text-cream"
                : "border-border text-foreground hover:border-espresso"
            )}
          >
            {t(`print_cat_${cat}`)}
            <span className="ms-1.5 text-[10px] opacity-60">
              {COUNT_BY_CATEGORY[cat]}
            </span>
          </button>
        ))}
      </div>

      {/* Flat thumbnail grid — every swatch is its own button */}
      <div className="grid grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pe-1 no-scrollbar">
        {swatchesInCat.map((swatch) => {
          const isSelected = swatch.sku === fabricPrintSku;
          return (
            <button
              key={swatch.sku}
              type="button"
              onClick={() => setFabricPrint(swatch.sku)}
              className={cn(
                "relative aspect-[3/4] overflow-hidden border transition-colors",
                isSelected
                  ? "border-espresso ring-2 ring-espresso"
                  : "border-border hover:border-pink-salt-deep"
              )}
              aria-label={swatch.sku}
              title={swatch.sku}
            >
              <Image
                src={swatch.thumbUrl}
                alt={swatch.sku}
                fill
                sizes="(max-width: 1024px) 32vw, 120px"
                className="object-cover"
                loading="lazy"
              />
              {isSelected && (
                <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-espresso ring-2 ring-cream" />
              )}
            </button>
          );
        })}
        {swatchesInCat.length === 0 && (
          <p className="col-span-3 text-xs text-muted-foreground py-6 text-center">
            {t("print_empty_category")}
          </p>
        )}
      </div>

      {/* Scale slider */}
      {fabricPrintSku && (
        <div className="pt-2">
          <label className="flex items-baseline justify-between label-xs text-muted-foreground mb-2">
            <span>{t("print_scale")}</span>
            <span className="price-num text-foreground">
              {fabricPrintScale.toFixed(2)}×
            </span>
          </label>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={fabricPrintScale}
            onChange={(e) => setFabricPrintScale(parseFloat(e.target.value))}
            className="w-full accent-espresso"
          />
        </div>
      )}
    </div>
  );
}
