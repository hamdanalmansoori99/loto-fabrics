"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, localize } from "@/lib/format";
import { useSavedStore } from "@/stores/saved-store";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  /** When true, card becomes larger/feature-sized (used in staggered grid) */
  feature?: boolean;
  priority?: boolean;
  className?: string;
}

export default function ProductCard({ product, feature = false, priority = false, className }: ProductCardProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const isSaved = useSavedStore((s) => s.savedIds.includes(product.id));
  const toggleSaved = useSavedStore((s) => s.toggleSaved);

  const mainImage = product.images.find((i) => i.isMain) || product.images[0];
  const secondary = product.images.find((i) => !i.isMain);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(product.id);
  };

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className={cn("group block", className)}
    >
      <div className={cn(
        "relative overflow-hidden bg-cream-warm",
        feature ? "aspect-[4/5]" : "aspect-[3/4]"
      )}>
        {mainImage && (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || localize(product, "name", locale)}
            fill
            className={cn(
              "object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              secondary ? "group-hover:opacity-0" : "group-hover:scale-[1.03]"
            )}
            sizes={feature ? "(max-width:768px) 100vw, 66vw" : "(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"}
            quality={85}
            priority={priority}
          />
        )}
        {secondary && (
          <Image
            src={secondary.url}
            alt=""
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            sizes={feature ? "(max-width:768px) 100vw, 66vw" : "(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"}
            quality={85}
          />
        )}

        {/* Tags top-left */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="label-xs bg-cream text-espresso px-2 py-1">New</span>
          )}
          {product.isLimited && (
            <span className="label-xs bg-bronze text-cream px-2 py-1">Limited</span>
          )}
          {product.compareAtPrice && !product.isLimited && (
            <span className="label-xs bg-bronze text-cream px-2 py-1">Sale</span>
          )}
        </div>

        {/* Save heart top-right */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={isSaved ? "Remove from saved" : "Save"}
          className={cn(
            "absolute top-3 end-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
            isSaved
              ? "bg-espresso text-cream"
              : "bg-cream/70 text-espresso opacity-0 group-hover:opacity-100 hover:bg-cream backdrop-blur-sm"
          )}
        >
          <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
        </button>
      </div>

      {/* Pink accent bar on hover */}
      <div className="h-px bg-pink-salt-deep transition-all duration-500 w-0 group-hover:w-full" />

      <div className="mt-3 sm:mt-4">
        <h3 className="display-sm text-foreground text-[15px] sm:text-base line-clamp-1 transition-colors group-hover:text-espresso-soft">
          {localize(product, "name", locale)}
        </h3>

        <div className="mt-1 flex items-baseline gap-2">
          {product.priceMode === "per_meter" && product.pricePerMeter !== undefined && (
            <>
              <span className="price-num text-sm text-espresso">
                {formatPrice(product.pricePerMeter, locale)}
              </span>
              {product.compareAtPrice && (
                <span className="price-num text-xs text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice, locale)}
                </span>
              )}
              <span className="label-xs text-muted-foreground">
                / {t("per_meter")}
              </span>
            </>
          )}

          {product.priceMode === "per_piece" && product.pricePerPiece !== undefined && (
            <>
              <span className="price-num text-sm text-espresso">
                {formatPrice(product.pricePerPiece, locale)}
              </span>
              {product.compareAtPrice && (
                <span className="price-num text-xs text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice, locale)}
                </span>
              )}
            </>
          )}

          {product.priceMode === "on_request" && (
            <span
              className="display-sm italic text-bronze text-sm"
              style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 24" }}
            >
              {t("inquire_on_whatsapp")}
            </span>
          )}
        </div>

        <p className="mt-0.5 label-xs text-taupe">
          {product.fabricType}
        </p>
      </div>
    </Link>
  );
}
