import { useTranslations } from "next-intl";
import Image from "next/image";
import FadeSection from "@/components/ui/fade-section";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-24">
      <div className="max-w-[720px] mb-16 sm:mb-24">
        <p className="label-xs text-bronze mb-3">Atelier · Since 2019</p>
        <h1 className="display-xl text-foreground">
          {t("title").split(" ").slice(0, -1).join(" ")}{" "}
          <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}>
            {t("title").split(" ").slice(-1)[0]}
          </span>
        </h1>
      </div>

      <FadeSection className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20 items-start mb-24 sm:mb-32">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-warm">
          <Image
            src="/images/products/kaftan-pearl-gold.png"
            alt="Our craftsmanship"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
          />
        </div>
        <div className="space-y-6 lg:pt-12">
          <p className="label-xs text-bronze">{t("story_title")}</p>
          <h2 className="display-lg text-foreground">
            <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 96" }}>Cloth,</span>
            {" "}slowed down.
          </h2>
          <p className="body-lg text-muted-foreground">{t("story_text")}</p>
        </div>
      </FadeSection>

      {/* Mission & Quality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/60">
        <FadeSection className="bg-cream-warm p-8 sm:p-10 lg:p-14 space-y-4">
          <p className="label-xs text-bronze">01</p>
          <h2 className="display-md text-foreground">{t("mission_title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("mission_text")}</p>
        </FadeSection>
        <FadeSection className="bg-cream-warm p-8 sm:p-10 lg:p-14 space-y-4">
          <p className="label-xs text-bronze">02</p>
          <h2 className="display-md text-foreground">{t("quality_title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("quality_text")}</p>
        </FadeSection>
      </div>
    </div>
  );
}
