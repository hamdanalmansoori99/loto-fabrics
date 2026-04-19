import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "@/components/products/product-card";
import { sampleProducts } from "@/lib/sample-data";

/**
 * Staggered asymmetric featured-products grid.
 * Desktop: 12-col grid with row 1 = [6 | 3 | 3] and row 2 = [4 | 4 | 4].
 * Mobile: clean 2-col grid.
 */
export default async function FeaturedGrid() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const featured = sampleProducts.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <section className="w-full py-20 sm:py-28 md:py-32 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
        <div className="mb-12 sm:mb-16 flex items-end justify-between gap-6">
          <div>
            <p className="label-xs text-bronze mb-3">{t("featured_eyebrow")}</p>
            <h2 className="display-lg text-foreground max-w-[640px]">
              {t("featured_title_pre")}{" "}
              <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 96" }}>
                {t("featured_title_italic")}
              </span>
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 label-sm text-espresso hover:text-espresso-soft transition-colors group shrink-0"
          >
            <span className="hidden sm:inline">{t("featured_view_all")}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Desktop staggered: 12-col grid */}
        <div className="hidden md:grid grid-cols-12 gap-6 lg:gap-8">
          {featured[0] && (
            <div className="col-span-6">
              <ProductCard product={featured[0]} feature priority />
            </div>
          )}
          {featured[1] && (
            <div className="col-span-3">
              <ProductCard product={featured[1]} />
            </div>
          )}
          {featured[2] && (
            <div className="col-span-3">
              <ProductCard product={featured[2]} />
            </div>
          )}
          {featured[3] && (
            <div className="col-span-4">
              <ProductCard product={featured[3]} />
            </div>
          )}
          {featured[4] && (
            <div className="col-span-4">
              <ProductCard product={featured[4]} />
            </div>
          )}
          {featured[5] && (
            <div className="col-span-4">
              <ProductCard product={featured[5]} />
            </div>
          )}
        </div>

        {/* Mobile: simple 2-col */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
