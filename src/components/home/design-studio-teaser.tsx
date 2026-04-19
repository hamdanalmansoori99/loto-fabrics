import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

/**
 * Editorial split section promoting the Design Studio.
 * Desktop: full-bleed image right, cream text block left.
 * Mobile: stacked with image above text.
 */
export default async function DesignStudioTeaser() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  return (
    <section className="w-full bg-background">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch">
        <div className="relative order-2 lg:order-1 flex items-center px-6 sm:px-10 md:px-16 lg:px-20 py-16 sm:py-24 lg:py-28 bg-background">
          <div className="max-w-[480px]">
            <p className="label-xs text-bronze mb-4">{t("studio_eyebrow")}</p>
            <h2 className="display-lg text-foreground">
              {t("studio_title_pre")}{" "}
              <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 96" }}>
                {t("studio_title_italic")}
              </span>
            </h2>
            <p className="mt-5 body-lg text-muted-foreground">
              {t("studio_body")}
            </p>

            <ul className="mt-8 space-y-3 text-sm text-foreground">
              {[t("studio_bullet_1"), t("studio_bullet_2"), t("studio_bullet_3")].map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-salt-deep mt-[7px] shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/demo`}
              className="mt-10 inline-flex items-center gap-2 bg-espresso text-cream px-8 py-4 label-sm hover:bg-espresso-soft transition-colors"
            >
              {t("studio_cta")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 aspect-[4/5] lg:aspect-auto">
          <Image
            src="/images/products/kaftan-white-gold-floral.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
