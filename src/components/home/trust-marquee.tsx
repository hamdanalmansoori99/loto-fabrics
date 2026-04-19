import { useTranslations } from "next-intl";
import { Marquee } from "@/components/ui/marquee";

/**
 * Thin horizontal scrolling trust strip with bronze separators between items.
 */
export default function TrustMarquee() {
  const t = useTranslations("home");

  const items = [
    t("trust_1"),
    t("trust_2"),
    t("trust_3"),
    t("trust_4"),
    t("trust_5"),
  ];

  return (
    <div className="w-full bg-cream-warm border-y border-border/40 py-3.5">
      <Marquee>
        <div className="flex items-center gap-10 pe-10">
          {items.map((text, i) => (
            <div key={i} className="flex items-center gap-10 shrink-0">
              <span className="label-xs text-espresso-soft whitespace-nowrap">{text}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-bronze shrink-0" aria-hidden />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
