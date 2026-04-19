"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface GarmentType {
  id: string;
  labelKey: string;
  meters: number;
  rationale: string;
}

const GARMENTS: GarmentType[] = [
  { id: "kaftan", labelKey: "meter_calc_kaftan", meters: 5, rationale: "2× body length + 1m hem allowance" },
  { id: "abaya", labelKey: "meter_calc_abaya", meters: 4, rationale: "1.5× body length + sleeve + hem" },
  { id: "top", labelKey: "meter_calc_top", meters: 2, rationale: "body + sleeves + seam allowance" },
  { id: "runner", labelKey: "meter_calc_runner", meters: 3, rationale: "table length × 2 + 40cm overhang" },
  { id: "cushion", labelKey: "meter_calc_cushion", meters: 2, rationale: "4× 50cm panels + binding" },
];

interface MeterCalculatorProps {
  onSelect: (meters: number) => void;
}

export function MeterCalculator({ onSelect }: MeterCalculatorProps) {
  const t = useTranslations("products");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="border-t border-border/50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 group"
      >
        <div className="text-start">
          <p className="label-xs text-bronze mb-0.5">{t("meter_calc_title")}</p>
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {t("meter_calc_sub")}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-bronze transition-transform shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="pb-5 space-y-2">
          {GARMENTS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setSelected(g.id);
                onSelect(g.meters);
              }}
              className={cn(
                "w-full text-start px-4 py-3 border transition-colors group",
                selected === g.id
                  ? "border-espresso bg-cream-warm"
                  : "border-border hover:border-pink-salt-deep"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t(g.labelKey)}</p>
                  <p className="label-xs text-muted-foreground mt-0.5">{g.rationale}</p>
                </div>
                <span className="price-num text-sm text-espresso">{g.meters}m</span>
              </div>
              {selected === g.id && (
                <p className="mt-2 label-xs text-bronze">
                  {t("meter_calc_applied", { m: g.meters })}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
