import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

/**
 * Single-image editorial journal teaser, magazine-style.
 */
export default async function JournalTeaser() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  return (
    <section className="w-full py-24 sm:py-32 bg-cream-warm">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5]">
            <Image
              src="/images/products/garments/mikhwars/mikhwar-04.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              quality={90}
              className="object-cover"
            />
          </div>

          <div className="max-w-[480px]">
            <p className="label-xs text-bronze mb-3">{t("journal_eyebrow")} · N°12</p>
            <h3 className="display-lg text-foreground">
              <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 96" }}>
                {t("journal_title_italic")}
              </span>{" "}
              {t("journal_title_rest")}
            </h3>

            <p className="mt-6 body-lg text-muted-foreground">
              {t("journal_excerpt")}
            </p>

            <Link
              href={`/${locale}/about`}
              className="mt-8 inline-block label-sm text-espresso border-b border-pink-salt-deep pb-0.5 hover:border-espresso transition-colors"
            >
              {t("journal_read")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
