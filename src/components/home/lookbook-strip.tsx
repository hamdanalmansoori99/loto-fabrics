import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

interface LookbookCard {
  img: string;
  titleKey: string;
  href: string;
}

const CARDS: LookbookCard[] = [
  { img: "/images/products/garments/mikhwars/mikhwar-04.png", titleKey: "lookbook_card_1", href: "/products?collection=thyban" },
  { img: "/images/products/garments/mikhwars/mikhwar-13.png", titleKey: "lookbook_card_2", href: "/products?collection=thyban" },
  { img: "/images/products/garments/jalabyas/jalabya-01.png", titleKey: "lookbook_card_3", href: "/products?collection=jalabya" },
  { img: "/images/products/garments/jalabyas/jalabya-06.png", titleKey: "lookbook_card_4", href: "/products?collection=jalabya" },
];

export default async function LookbookStrip() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  return (
    <section className="w-full py-20 sm:py-28 bg-background">
      <div className="max-w-[1440px] mx-auto">
        <div className="px-6 sm:px-10 md:px-16 lg:px-20 mb-10 sm:mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="label-xs text-bronze mb-3">{t("lookbook_eyebrow")}</p>
            <h2 className="display-lg text-foreground max-w-[560px]">
              {t("lookbook_title_pre")}{" "}
              <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 96" }}>
                {t("lookbook_title_italic")}
              </span>
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="hidden sm:inline-flex items-center gap-2 label-sm text-espresso hover:text-espresso-soft transition-colors group"
          >
            {t("lookbook_view_all")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="snap-row no-scrollbar overflow-x-auto">
          <div className="flex gap-4 sm:gap-6 px-6 sm:px-10 md:px-16 lg:px-20">
            {CARDS.map((card) => (
              <Link
                key={card.titleKey}
                href={`/${locale}${card.href}`}
                className="snap-start-always shrink-0 w-[75vw] sm:w-[48vw] md:w-[32vw] lg:w-[26vw] group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-cream-warm">
                  <Image
                    src={card.img}
                    alt=""
                    fill
                    quality={85}
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 32vw, 26vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <h3 className="display-sm italic text-foreground" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 32" }}>
                    {t(card.titleKey)}
                  </h3>
                  <ArrowUpRight className="h-5 w-5 mt-1 text-bronze opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
