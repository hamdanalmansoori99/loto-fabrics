import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import {
  WHATSAPP_NUMBER_DISPLAY,
  WHATSAPP_LINK,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from "@/lib/contact";

export default async function Footer() {
  const t = await getTranslations("footer");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();

  return (
    <footer className="w-full bg-espresso text-cream">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-10 sm:gap-14">
          {/* Brand + location + contact */}
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

            {/* Location + WhatsApp + Instagram — visible at the bottom of every page */}
            <div className="mt-6 space-y-2">
              <p className="label-xs text-cream/50">{t("made_in")}</p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block label-xs text-cream/80 hover:text-cream transition-colors"
              >
                {tCommon("whatsapp")}: <bdi>{WHATSAPP_NUMBER_DISPLAY}</bdi>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block label-xs text-cream/80 hover:text-cream transition-colors"
              >
                <bdi>{INSTAGRAM_HANDLE}</bdi>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="label-xs text-pink-salt mb-5">{t("quick_links")}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/products?collection=thyban`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {locale === "ar" ? "ثيبان" : "Thybans"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?collection=jalabya`} className="text-sm text-cream/80 hover:text-cream transition-colors">
                  {locale === "ar" ? "جلابيات" : "Jalabiyas"}
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
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cream/80 hover:text-cream transition-colors"
                >
                  {tCommon("whatsapp")}
                </a>
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
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="label-xs text-cream/70 hover:text-cream transition-colors">
              <bdi>{INSTAGRAM_HANDLE}</bdi>
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
