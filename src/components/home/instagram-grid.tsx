import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

const TILES = [
  "/images/products/kaftan-champagne-royal.png",
  "/images/products/kaftan-peach-blossom.png",
  "/images/products/kaftan-blush-pink-crystal.png",
  "/images/products/kaftan-pearl-gold.png",
];

export default async function InstagramGrid() {
  const t = await getTranslations("home");

  return (
    <section className="w-full py-20 sm:py-28 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
        <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="label-xs text-bronze mb-3">@LOTO_AE</p>
            <h2 className="display-md text-foreground">
              {t("instagram_title")}
            </h2>
          </div>
          <a
            href="https://instagram.com/loto_ae"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 label-sm text-espresso hover:text-bronze transition-colors group"
          >
            <InstagramIcon className="h-4 w-4" />
            {t("instagram_follow")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2">
          {TILES.map((url, i) => (
            <a
              key={i}
              href="https://instagram.com/loto_ae"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden bg-cream-warm group"
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                quality={80}
                className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/30 transition-colors duration-500 flex items-center justify-center">
                <InstagramIcon className="h-6 w-6 text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
