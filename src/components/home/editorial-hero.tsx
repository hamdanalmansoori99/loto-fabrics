"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { StaggerWords } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Editorial hero — composition adapts by breakpoint:
 * - Mobile: full-bleed image with text overlay at bottom-left
 * - Desktop (lg+): 2-column split — text left on cream bg, kaftan image right
 */
export default function EditorialHero() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-[88vh] bg-background">
      {/* ═══ Desktop split layout ═══ */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_1.15fr] lg:min-h-[88vh]">
        {/* Left — text block */}
        <div className="flex items-center px-12 xl:px-20 py-16 bg-background">
          <div className="max-w-[540px]">
            <p className="label-xs text-bronze mb-6">
              {t("hero_eyebrow")}
            </p>

            <h1 className="display-xl text-foreground leading-[0.98]">
              <StaggerWords text={t("hero_title_line1")} delay={120} wordDelay={90} />
              <br />
              <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}>
                <StaggerWords text={t("hero_title_line2")} delay={480} wordDelay={90} />
              </span>
            </h1>

            <p className="mt-6 body-lg text-muted-foreground max-w-[440px]">
              {t("hero_subtitle")}
            </p>

            <div className="mt-10 flex flex-wrap gap-5 items-center">
              <Button
                render={<Link href={`/${locale}/products`} />}
                size="lg"
                className="bg-espresso text-cream hover:bg-espresso-soft px-8 py-6 h-auto label-sm"
              >
                {t("hero_cta")}
              </Button>
              <Link
                href={`/${locale}/demo`}
                className="label-sm text-foreground/80 hover:text-foreground border-b border-border hover:border-foreground pb-0.5 transition-colors"
              >
                {t("hero_cta_secondary")}
              </Link>
            </div>

            {/* Footer micro-label */}
            <div className="mt-16 pt-6 border-t border-border/40 flex items-center gap-4 label-xs text-muted-foreground">
              <span>Season 04 · Spring 2026</span>
              <span className="inline-block w-1 h-1 rounded-full bg-bronze" />
              <span>Al Quoz · Dubai</span>
            </div>
          </div>
        </div>

        {/* Right — full kaftan image */}
        <div className="relative overflow-hidden bg-cream-warm">
          <Image
            src="/images/products/kaftan-burgundy-rose.png"
            alt="Loto Fabrics — heirloom embroidered kaftan"
            fill
            priority
            quality={95}
            sizes="60vw"
            className="object-cover object-[center_25%]"
          />
          {/* Subtle cream vignette at edges */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(246,239,233,0.15) 0%, rgba(246,239,233,0) 8%, rgba(246,239,233,0) 92%, rgba(246,239,233,0.15) 100%)",
            }}
          />
        </div>
      </div>

      {/* ═══ Mobile + tablet full-bleed ═══ */}
      <div className="lg:hidden relative w-full min-h-[92vh] overflow-hidden">
        <Image
          src="/images/products/kaftan-burgundy-rose.png"
          alt="Loto Fabrics — heirloom embroidered kaftan"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-[65%_top] sm:object-[70%_top]"
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(51,30,7,0.58) 0%, rgba(51,30,7,0.18) 45%, rgba(51,30,7,0) 70%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 px-6 sm:px-10 md:px-16 pb-12 sm:pb-16 md:pb-20">
          <div className="max-w-[680px]">
            <p className="label-xs text-pink-salt mb-4">
              {t("hero_eyebrow")}
            </p>

            <h1 className="display-xl text-cream leading-[0.98]">
              <StaggerWords text={t("hero_title_line1")} delay={120} wordDelay={90} />
              <br />
              <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}>
                <StaggerWords text={t("hero_title_line2")} delay={480} wordDelay={90} />
              </span>
            </h1>

            <p className="mt-5 body-lg text-cream/80 max-w-[460px]">
              {t("hero_subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <Button
                render={<Link href={`/${locale}/products`} />}
                size="lg"
                className="bg-cream text-espresso hover:bg-cream/90 px-8 py-6 h-auto label-sm"
              >
                {t("hero_cta")}
              </Button>
              <Link
                href={`/${locale}/demo`}
                className="label-sm text-cream/90 hover:text-cream border-b border-cream/30 hover:border-cream pb-0.5 transition-colors"
              >
                {t("hero_cta_secondary")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
