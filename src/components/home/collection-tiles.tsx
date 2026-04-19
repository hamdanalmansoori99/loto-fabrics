import Link from "next/link";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { COLLECTIONS } from "@/lib/collections";
import { sampleProducts } from "@/lib/sample-data";

/**
 * Typographic collection tiles — each cell shows the collection name in large
 * italic Fraunces with a hairline underline; a representative product image
 * fades in on hover (desktop only).
 */
export default async function CollectionTiles() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  // Grab one hero image per collection
  const firstFor = (id: string) =>
    sampleProducts.find((p) => p.collection === id)?.images[0]?.url ||
    "/images/products/kaftan-peach-blossom.png";

  return (
    <section className="w-full py-24 sm:py-32 bg-cream-warm">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
        <div className="mb-10 sm:mb-16 max-w-[640px]">
          <p className="label-xs text-bronze mb-3">{t("collections_eyebrow")}</p>
          <h2 className="display-lg text-foreground">{t("collections_title")}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/60">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={`/${locale}/products?collection=${col.id}`}
              className="group relative bg-cream-warm aspect-[16/9] sm:aspect-[5/3] overflow-hidden"
            >
              {/* Hover image reveal */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-[900ms] pointer-events-none">
                <Image
                  src={firstFor(col.id)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  quality={80}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-cream/50" />
              </div>

              <div className="relative h-full flex flex-col justify-center items-start px-8 sm:px-12 md:px-16">
                <p className="label-xs text-bronze mb-4">
                  {t("collection_prefix")} · {String(col.id).toUpperCase()}
                </p>
                <h3 className="display-lg italic text-foreground" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 96" }}>
                  {locale === "ar" ? col.nameAr : col.nameEn}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground max-w-[340px]">
                  {locale === "ar" ? col.descriptionAr : col.descriptionEn}
                </p>
                <span className="mt-6 label-xs text-espresso border-b border-pink-salt-deep pb-0.5 group-hover:border-espresso transition-colors">
                  {t("collections_explore")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
