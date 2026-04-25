import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();

  return (
    <footer className="w-full bg-espresso text-cream">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-10 sm:gap-14">
          {/* Brand + newsletter lite */}
          <div>
            <Link
              href={`/${locale}`}
              className="display-md text-cream mb-4 block"
              style={{ fontVariationSettings: "'SOFT' 0, 'opsz' 48" }}
            >
              Loto <span className="italic text-pink-salt" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 48" }}>Fabrics</span>
            </Link>
            <p className="text-sm text-cream/70 leading-relaxed max-w-[360px]">
              {t("description")}
            </p>
            <p className="mt-6 label-xs text-cream/50">
              {t("made_in")} · {locale === "ar" ? "أبوظبي" : "Abu Dhabi"}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="label-xs text-pink-salt mb-5">{t("quick_links")}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/products`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {tCommon("products")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?collection=bridal`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {locale === "ar" ? "العرائس" : "Bridal"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?collection=occasion`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {locale === "ar" ? "العيد والمناسبات" : "Eid & Occasion"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?collection=essentials`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {locale === "ar" ? "الأساسيات" : "Essentials"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/demo`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {tCommon("demo")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Service */}
          <div>
            <h3 className="label-xs text-pink-salt mb-5">{t("customer_service")}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/about`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {tCommon("about")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {tCommon("contact")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact?type=wholesale`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {t("trade")}
                </Link>
              </li>
              <li>
                <a href="#shipping" className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {t("shipping_policy")}
                </a>
              </li>
              <li>
                <a href="#returns" className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {t("return_policy")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-8 border-t border-cream/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="label-xs text-cream/50">
            {t("copyright", { year: 2026 })}
          </p>
          <div className="flex items-center gap-6">
            <a href="https://instagram.com/loto_ae" className="label-xs text-cream/70 hover:text-cream transition-colors">
              @LOTO_AE
            </a>
            <a href="#privacy" className="label-xs text-cream/70 hover:text-cream transition-colors">
              {t("privacy_policy")}
            </a>
            <a href="#terms" className="label-xs text-cream/70 hover:text-cream transition-colors">
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
