"use client";

import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Download, Send, Save, Link2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  useCustomizerStore,
  FABRIC_CONFIGS,
  PRESET_COLORS,
  PATTERNS,
} from "@/stores/customizer-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import PrintPicker from "@/components/customizer/print-picker";

const FabricCanvas = dynamic(
  () => import("@/components/customizer/fabric-canvas"),
  { ssr: false, loading: () => <CanvasPlaceholder /> }
);

function CanvasPlaceholder() {
  return (
    <div className="w-full h-full min-h-[400px] bg-cream-warm flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground label-xs">
        Loading canvas…
      </div>
    </div>
  );
}

const PATTERN_CATEGORIES = [
  { key: "solid", patterns: PATTERNS.filter((p) => p.category === "solid") },
  { key: "neckline", patterns: PATTERNS.filter((p) => p.category === "neckline") },
  { key: "geometric", patterns: PATTERNS.filter((p) => p.category === "geometric") },
  { key: "floral", patterns: PATTERNS.filter((p) => p.category === "floral") },
  { key: "traditional", patterns: PATTERNS.filter((p) => p.category === "traditional") },
];

export default function DemoPage() {
  const t = useTranslations("customizer");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const {
    fabricType,
    baseColor,
    patternId,
    patternScale,
    patternRotation,
    zoom,
    savedDesigns,
    setFabricType,
    setBaseColor,
    setPatternId,
    setPatternScale,
    setPatternRotation,
    setZoom,
    reset,
    saveCurrent,
    loadDesign,
    deleteDesign,
    loadFromQueryString,
    toShareParams,
  } = useCustomizerStore();

  // Load from query string on mount (for share URLs)
  useEffect(() => {
    if (searchParams.toString()) {
      loadFromQueryString(searchParams);
    }
  }, [searchParams, loadFromQueryString]);

  const [showSaved, setShowSaved] = useState(false);

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `loto-design-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleSave = () => {
    const d = saveCurrent();
    toast.success(`Saved as "${d.name}"`);
  };

  const handleShare = async () => {
    const params = toShareParams();
    const url = `${window.location.origin}/${locale}/demo?${params}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("share_copied"));
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-10 lg:py-14">
      {/* Header */}
      <div className="mb-10 lg:mb-14">
        <p className="label-xs text-bronze mb-3">{t("title")}</p>
        <h1 className="display-lg text-foreground max-w-[640px]">
          {t("subtitle")}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-10">
        {/* Sidebar */}
        <aside className="order-2 lg:order-1 lg:max-h-[calc(100vh-10rem)] lg:sticky lg:top-24 lg:overflow-y-auto lg:pe-3 no-scrollbar">
          {/* Fabric */}
          <section className="py-4 border-b border-border/50">
            <h3 className="label-xs text-bronze mb-3">{t("section_fabric")}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2">
              {Object.entries(FABRIC_CONFIGS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setFabricType(key)}
                  className={cn(
                    "px-2 py-3 text-xs border transition-all min-h-[44px]",
                    fabricType === key
                      ? "border-espresso bg-espresso text-cream"
                      : "border-border hover:border-espresso"
                  )}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </section>

          {/* Print catalog — Cosie Liberty fabric prints */}
          <section className="py-4 border-b border-border/50">
            <h3 className="label-xs text-bronze mb-3">{t("section_print")}</h3>
            <PrintPicker />
          </section>

          {/* Colour */}
          <section className="py-4 border-b border-border/50">
            <h3 className="label-xs text-bronze mb-3">{t("section_color")}</h3>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setBaseColor(color)}
                  className={cn(
                    "w-full aspect-square transition-transform hover:scale-110",
                    baseColor === color
                      ? "ring-2 ring-espresso ring-offset-2 ring-offset-background scale-105"
                      : ""
                  )}
                  style={{ backgroundColor: color, border: "1px solid rgba(0,0,0,0.15)" }}
                  title={color}
                  aria-label={color}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <label className="label-xs text-muted-foreground">Custom</label>
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="price-num text-xs text-muted-foreground uppercase">
                {baseColor}
              </span>
            </div>
          </section>

          {/* Embroidery */}
          <section className="py-4 border-b border-border/50">
            <h3 className="label-xs text-bronze mb-3">{t("section_embroidery")}</h3>
            {PATTERN_CATEGORIES.map(({ key, patterns }) => (
              <div key={key} className="mb-3 last:mb-0">
                {key !== "solid" && (
                  <p className="label-xs text-muted-foreground mb-2 mt-3 first:mt-0">
                    {key === "neckline" ? t("neckline") :
                     key === "geometric" ? t("geometric") :
                     key === "floral" ? t("floral") : t("traditional")}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {patterns.map((pattern) => (
                    <button
                      key={pattern.id}
                      onClick={() => setPatternId(pattern.id === "none" ? null : pattern.id)}
                      className={cn(
                        "px-3 py-2.5 text-xs border transition-all text-start min-h-[44px]",
                        (patternId === pattern.id || (patternId === null && pattern.id === "none"))
                          ? "border-espresso bg-cream-warm"
                          : "border-border hover:border-pink-salt-deep"
                      )}
                    >
                      {locale === "ar" ? pattern.nameAr : pattern.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Adjustments */}
          {patternId && patternId !== "none" && (
            <section className="py-4 border-b border-border/50 space-y-4">
              <h3 className="label-xs text-bronze">{t("adjustments")}</h3>
              <div>
                <label className="flex items-baseline justify-between label-xs text-muted-foreground mb-2">
                  <span>{t("pattern_scale")}</span>
                  <span className="price-num text-foreground">{patternScale.toFixed(1)}×</span>
                </label>
                <Slider
                  value={[patternScale]}
                  onValueChange={(v) => setPatternScale(Array.isArray(v) ? v[0] : v)}
                  min={0.5}
                  max={3}
                  step={0.1}
                />
              </div>
              <div>
                <label className="flex items-baseline justify-between label-xs text-muted-foreground mb-2">
                  <span>{t("pattern_rotation")}</span>
                  <span className="price-num text-foreground">{patternRotation}°</span>
                </label>
                <Slider
                  value={[patternRotation]}
                  onValueChange={(v) => setPatternRotation(Array.isArray(v) ? v[0] : v)}
                  min={0}
                  max={360}
                  step={5}
                />
              </div>
              <div>
                <label className="flex items-baseline justify-between label-xs text-muted-foreground mb-2">
                  <span>Zoom</span>
                  <span className="price-num text-foreground">{(zoom * 100).toFixed(0)}%</span>
                </label>
                <Slider
                  value={[zoom]}
                  onValueChange={(v) => setZoom(Array.isArray(v) ? v[0] : v)}
                  min={0.5}
                  max={3}
                  step={0.1}
                />
              </div>
            </section>
          )}

          {/* Quick actions */}
          <section className="py-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="label-xs"
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            >
              <ZoomIn className="h-3.5 w-3.5 me-1" />
              {t("zoom_in")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="label-xs"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            >
              <ZoomOut className="h-3.5 w-3.5 me-1" />
              {t("zoom_out")}
            </Button>
            <Button variant="outline" size="sm" className="label-xs" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5 me-1" />
              {t("reset")}
            </Button>
          </section>

          {/* Save + Share + Download + Quote */}
          <section className="py-4 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="label-xs" onClick={handleSave}>
                <Save className="h-3.5 w-3.5 me-1.5" />
                {t("save_design")}
              </Button>
              <Button variant="outline" size="sm" className="label-xs" onClick={handleShare}>
                <Link2 className="h-3.5 w-3.5 me-1.5" />
                {t("share_link")}
              </Button>
            </div>
            <Button variant="outline" onClick={handleDownload} className="border-border label-sm">
              <Download className="h-4 w-4 me-2" />
              {t("download")}
            </Button>
            <Button className="bg-espresso hover:bg-espresso-soft text-cream label-sm py-6 h-auto">
              <Send className="h-4 w-4 me-2" />
              {t("request_quote")}
            </Button>
          </section>

          {/* Saved designs drawer */}
          <section className="py-4 border-t border-border/50">
            <button
              type="button"
              onClick={() => setShowSaved((s) => !s)}
              className="w-full flex items-center justify-between label-xs text-bronze mb-3"
            >
              <span>{t("saved_designs")} ({savedDesigns.length})</span>
              <span className="text-espresso">{showSaved ? "−" : "+"}</span>
            </button>
            {showSaved && (
              <div className="space-y-1.5">
                {savedDesigns.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">{t("no_saved")}</p>
                ) : (
                  savedDesigns.map((d) => (
                    <div key={d.id} className="flex items-center gap-2 border border-border p-2">
                      <button
                        onClick={() => loadDesign(d.id)}
                        className="flex-1 text-start text-xs text-foreground hover:text-espresso-soft"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block w-4 h-4 border border-black/10"
                            style={{ backgroundColor: d.baseColor }}
                          />
                          {d.name}
                        </span>
                      </button>
                      <button
                        onClick={() => deleteDesign(d.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </aside>

        {/* Canvas — 2:3 portrait for dramatic dress proportions */}
        <div className="order-1 lg:order-2 aspect-[2/3] lg:aspect-auto lg:min-h-[780px]">
          <FabricCanvas />
        </div>
      </div>
    </div>
  );
}
