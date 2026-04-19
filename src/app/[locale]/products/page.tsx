"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/products/product-card";
import { ProductFilters, type FilterState } from "@/components/products/product-filters";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { sampleProducts } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import type { Collection, ColorFamily } from "@/types/product";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "limited";

export default function ProductsPage() {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();

  const initialCollection = (searchParams.get("collection") as Collection | null) || null;

  const maxPriceCap = useMemo(
    () => Math.ceil(Math.max(...sampleProducts.map((p) => p.pricePerMeter)) / 100) * 100,
    []
  );

  const [filters, setFilters] = useState<FilterState>({
    collection: initialCollection,
    fabric: null,
    colorFamily: null,
    maxPrice: maxPriceCap,
  });
  const [sort, setSort] = useState<SortKey>("featured");
  const [sheetOpen, setSheetOpen] = useState(false);

  const availableFabrics = useMemo(
    () => Array.from(new Set(sampleProducts.map((p) => p.fabricType))),
    []
  );

  const filtered = useMemo(() => {
    let list = sampleProducts.filter((p) => {
      if (filters.collection && p.collection !== filters.collection) return false;
      if (filters.fabric && p.fabricType !== filters.fabric) return false;
      if (filters.colorFamily && p.colorFamily !== filters.colorFamily) return false;
      if (p.pricePerMeter > filters.maxPrice) return false;
      return true;
    });

    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.pricePerMeter - b.pricePerMeter);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.pricePerMeter - a.pricePerMeter);
        break;
      case "limited":
        list = [...list].sort((a, b) => Number(!!b.isLimited) - Number(!!a.isLimited));
        break;
      case "featured":
      default:
        list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return list;
  }, [filters, sort]);

  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.collection)
    activeChips.push({
      label: filters.collection,
      clear: () => setFilters((s) => ({ ...s, collection: null })),
    });
  if (filters.fabric)
    activeChips.push({
      label: filters.fabric,
      clear: () => setFilters((s) => ({ ...s, fabric: null })),
    });
  if (filters.colorFamily)
    activeChips.push({
      label: filters.colorFamily,
      clear: () => setFilters((s) => ({ ...s, colorFamily: null })),
    });
  if (filters.maxPrice < maxPriceCap)
    activeChips.push({
      label: `≤ AED ${filters.maxPrice}`,
      clear: () => setFilters((s) => ({ ...s, maxPrice: maxPriceCap })),
    });

  const resetAll = () =>
    setFilters({ collection: null, fabric: null, colorFamily: null, maxPrice: maxPriceCap });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 sm:mb-14">
        <p className="label-xs text-bronze mb-3">Shop</p>
        <h1 className="display-lg text-foreground">{t("subtitle")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
        {/* Desktop filter rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ProductFilters
              state={filters}
              onChange={setFilters}
              availableFabrics={availableFabrics}
              maxPriceCap={maxPriceCap}
              variant="rail"
            />
            {activeChips.length > 0 && (
              <button
                onClick={resetAll}
                className="mt-4 label-xs text-bronze hover:text-espresso underline underline-offset-4"
              >
                {tCommon("clear_all")}
              </button>
            )}
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <p className="label-xs text-muted-foreground">
              {t("count", { count: filtered.length })}
            </p>
            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <BottomSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                trigger={
                  <button className="lg:hidden inline-flex items-center gap-2 px-3 py-2 label-xs border border-border hover:border-espresso transition-colors">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {tCommon("filters")}
                    {activeChips.length > 0 && (
                      <span className="inline-block w-4 h-4 rounded-full bg-espresso text-cream text-[10px] leading-4 text-center">
                        {activeChips.length}
                      </span>
                    )}
                  </button>
                }
                title={tCommon("filters")}
                footer={
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        resetAll();
                      }}
                      className="flex-1 py-3 label-sm border border-border hover:border-espresso"
                    >
                      {tCommon("reset")}
                    </button>
                    <button
                      onClick={() => setSheetOpen(false)}
                      className="flex-[2] py-3 label-sm bg-espresso text-cream hover:bg-espresso-soft"
                    >
                      {tCommon("apply")} · {filtered.length}
                    </button>
                  </div>
                }
              >
                <ProductFilters
                  state={filters}
                  onChange={setFilters}
                  availableFabrics={availableFabrics}
                  maxPriceCap={maxPriceCap}
                  variant="sheet"
                />
              </BottomSheet>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="label-xs bg-transparent border border-border px-3 py-2 text-foreground cursor-pointer hover:border-espresso transition-colors"
              >
                <option value="featured">{t("sort_featured")}</option>
                <option value="newest">{t("sort_newest")}</option>
                <option value="price-asc">{t("sort_price_low")}</option>
                <option value="price-desc">{t("sort_price_high")}</option>
                <option value="limited">{t("sort_limited")}</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {activeChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={chip.clear}
                  className="inline-flex items-center gap-1.5 label-xs bg-cream-warm text-foreground px-3 py-1.5 hover:bg-pink-salt-light transition-colors capitalize"
                >
                  {chip.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="display-md italic text-foreground mb-3" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 48" }}>
                {t("empty_title")}
              </h3>
              <p className="text-muted-foreground mb-6">{t("empty_sub")}</p>
              <button
                onClick={resetAll}
                className="label-sm bg-espresso text-cream px-6 py-3 hover:bg-espresso-soft transition-colors"
              >
                {tCommon("reset")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {filtered.map((p, i) => {
                const spanFeature = i === 0 && filtered.length >= 4;
                return (
                  <div
                    key={p.id}
                    className={cn(spanFeature && "sm:col-span-2 lg:col-span-2")}
                  >
                    <ProductCard product={p} feature={spanFeature} priority={i < 2} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
