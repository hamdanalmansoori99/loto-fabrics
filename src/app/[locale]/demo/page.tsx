"use client";

import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomizerStore, FABRIC_CONFIGS } from "@/stores/customizer-store";
import { cn } from "@/lib/utils";
import PrintPicker from "@/components/customizer/print-picker";
import { designStudioWhatsappLink } from "@/lib/whatsapp";

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

/**
 * Design Studio — radically simplified.
 * Pick fabric type + a print from the 800+ catalog, then send the request to
 * the atelier via WhatsApp. No colour picker, no embroidery picker, no scale
 * sliders — the company sells the fabric as-is.
 */
export default function DemoPage() {
  const t = useTranslations("customizer");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const {
    fabricType,
    fabricPrintSku,
    setFabricType,
    loadFromQueryString,
    // Read-only values still needed for the WhatsApp message helper
    baseColor,
    patternId,
    patternScale,
    patternRotation,
  } = useCustomizerStore();

  // Allow share URLs to pre-fill state on load.
  useEffect(() => {
    if (searchParams.toString()) {
      loadFromQueryString(searchParams);
    }
  }, [searchParams, loadFromQueryString]);

  const handleWhatsApp = () => {
    const url = designStudioWhatsappLink({
      fabricType,
      baseColor,
      patternId,
      patternScale,
      patternRotation,
      fabricPrintSku,
      locale,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-10 lg:py-14">
      {/* Header */}
      <div className="mb-10 lg:mb-14">
        <p className="label-xs text-bronze mb-3">{t("title")}</p>
        <h1 className="display-lg text-foreground max-w-[640px]">
          {t("subtitle")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-[560px]">
          {t("studio_intro")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-10">
        {/* Sidebar — fabric + print + send to WhatsApp */}
        <aside className="order-2 lg:order-1 lg:max-h-[calc(100vh-10rem)] lg:sticky lg:top-24 lg:overflow-y-auto lg:pe-3 no-scrollbar">
          {/* Fabric type */}
          <section className="py-4 border-b border-border/50">
            <h3 className="label-xs text-bronze mb-3">{t("section_fabric")}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
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

          {/* Print catalog */}
          <section className="py-4 border-b border-border/50">
            <h3 className="label-xs text-bronze mb-3">{t("section_print")}</h3>
            <PrintPicker />
          </section>

          {/* Contact CTA */}
          <section className="py-5">
            <Button
              onClick={handleWhatsApp}
              className="w-full bg-espresso hover:bg-espresso-soft text-cream label-sm py-6 h-auto"
            >
              <Send className="h-4 w-4 me-2" />
              {t("contact_whatsapp_request")}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground text-center leading-relaxed">
              {t("studio_cta_subtitle")}
            </p>
          </section>
        </aside>

        {/* Canvas */}
        <div className="order-1 lg:order-2 aspect-[2/3] lg:aspect-auto lg:min-h-[780px]">
          <FabricCanvas />
        </div>
      </div>
    </div>
  );
}
