"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Heart, ShoppingBag, Palette, MessageSquareQuote, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleProducts, getProductBySlug } from "@/lib/sample-data";
import { formatPrice, localize } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useSavedStore } from "@/stores/saved-store";
import { MeterCalculator } from "@/components/products/meter-calculator";
import { MobileAddToBag } from "@/components/products/mobile-add-to-bag";
import ProductCard from "@/components/products/product-card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getCollection, getColorFamily } from "@/lib/collections";

export default function ProductDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations();
  const addItem = useCartStore((s) => s.addItem);
  const isSaved = useSavedStore((s) => s.savedIds);
  const toggleSaved = useSavedStore((s) => s.toggleSaved);

  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  const [meters, setMeters] = useState(product?.minOrderMeters ?? 2);
  const inlineCtaRef = useRef<HTMLDivElement>(null);

  if (!product) return notFound();

  const saved = isSaved.includes(product.id);
  const collection = getCollection(product.collection);
  const color = getColorFamily(product.colorFamily);

  const styledWith = (product.styledWith || [])
    .map((id) => sampleProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  const subtotal = product.pricePerMeter * meters;
  const bulkEligible = meters >= 30;

  function handleAdd() {
    const img = product!.images.find((i) => i.isMain) || product!.images[0];
    addItem({
      productId: product!.id,
      nameEn: product!.nameEn,
      nameAr: product!.nameAr,
      slug: product!.slug,
      image: img?.url || "",
      pricePerMeter: product!.pricePerMeter,
      meters,
    });
    toast.success(locale === "ar" ? "تمت الإضافة إلى الحقيبة" : "Added to bag");
  }

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 lg:py-10 pb-24 lg:pb-10">
        {/* Breadcrumb */}
        <nav className="label-xs text-muted-foreground mb-6 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
            {t("common.home")}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/products`} className="hover:text-foreground transition-colors">
            {t("common.products")}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{localize(product, "name", locale)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 lg:gap-12 xl:gap-16">
          {/* ─── Gallery ─── */}
          <div>
            {/* Desktop: vertical scroll-stack */}
            <div className="hidden lg:flex flex-col gap-4">
              {product.images.map((img, i) => (
                <div key={img.id} className="relative aspect-[3/4] bg-cream-warm overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.alt || localize(product, "name", locale)}
                    fill
                    sizes="(min-width:1024px) 60vw, 100vw"
                    quality={95}
                    priority={i === 0}
                    className="object-cover"
                  />
                </div>
              ))}
              {/* If only one image, render a cropped detail view for composition */}
              {product.images.length === 1 && (
                <div className="relative aspect-[3/4] bg-cream-warm overflow-hidden">
                  <Image
                    src={product.images[0].url}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 60vw, 100vw"
                    quality={95}
                    className="object-cover scale-[1.4] object-[center_30%]"
                  />
                </div>
              )}
            </div>

            {/* Mobile: swipeable */}
            <div className="lg:hidden snap-row no-scrollbar overflow-x-auto">
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <div
                    key={img.id}
                    className="snap-start-always shrink-0 w-full relative aspect-[3/4] bg-cream-warm overflow-hidden"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || localize(product, "name", locale)}
                      fill
                      sizes="100vw"
                      quality={90}
                      priority={i === 0}
                      className="object-cover"
                      style={{ touchAction: "pan-y pinch-zoom" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Buy box (sticky on desktop) ─── */}
          <div className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            {/* Eyebrow line */}
            <div className="flex items-center gap-2 mb-4 label-xs text-bronze">
              <span className="capitalize">{product.fabricType}</span>
              {collection && (
                <>
                  <span aria-hidden>·</span>
                  <span>{locale === "ar" ? collection.nameAr : collection.nameEn}</span>
                </>
              )}
              {color && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.hex }} />
                    {locale === "ar" ? color.nameAr : color.nameEn}
                  </span>
                </>
              )}
            </div>

            <h1 className="display-lg text-foreground mb-5">
              {localize(product, "name", locale)}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="price-num text-2xl text-espresso">
                {formatPrice(product.pricePerMeter, locale)}
              </span>
              {product.compareAtPrice && (
                <span className="price-num text-base text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice, locale)}
                </span>
              )}
              <span className="label-xs text-muted-foreground">
                / {t("common.per_meter")}
              </span>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed mb-6">
              {localize(product, "description", locale)}
            </p>

            {/* Fabric specs table */}
            <div className="border-t border-border/50 py-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-2">
              {product.composition && (
                <div>
                  <p className="label-xs text-muted-foreground mb-0.5">{t("products.composition")}</p>
                  <p className="text-foreground">{product.composition}</p>
                </div>
              )}
              {product.fabricWeight && (
                <div>
                  <p className="label-xs text-muted-foreground mb-0.5">{t("products.weight")}</p>
                  <p className="text-foreground">{product.fabricWeight}</p>
                </div>
              )}
              {product.fabricWidth && (
                <div>
                  <p className="label-xs text-muted-foreground mb-0.5">{t("products.width")}</p>
                  <p className="text-foreground">{product.fabricWidth}</p>
                </div>
              )}
              {product.careInstructions && (
                <div>
                  <p className="label-xs text-muted-foreground mb-0.5">{t("products.care")}</p>
                  <p className="text-foreground">{product.careInstructions}</p>
                </div>
              )}
              {product.origin && (
                <div>
                  <p className="label-xs text-muted-foreground mb-0.5">{t("products.origin")}</p>
                  <p className="text-foreground">{product.origin}</p>
                </div>
              )}
              {product.certifications && product.certifications.length > 0 && (
                <div>
                  <p className="label-xs text-muted-foreground mb-0.5">{t("products.certifications")}</p>
                  <p className="text-foreground">{product.certifications.join(" · ")}</p>
                </div>
              )}
            </div>

            {/* Meter calculator */}
            <MeterCalculator onSelect={(m) => setMeters(Math.max(product.minOrderMeters, m))} />

            {/* Quantity */}
            <div className="border-t border-border/50 py-5">
              <div className="flex items-center justify-between mb-3">
                <p className="label-xs text-bronze">{t("common.quantity")}</p>
                <p className="label-xs text-muted-foreground">
                  {t("common.min_order")}: {product.minOrderMeters}m
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border">
                  <button
                    type="button"
                    onClick={() => setMeters((m) => Math.max(product.minOrderMeters, m - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-cream-warm transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-14 text-center price-num text-base">{meters}m</div>
                  <button
                    type="button"
                    onClick={() => setMeters((m) => m + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-cream-warm transition-colors"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="label-xs text-muted-foreground">{t("common.subtotal")}</p>
                  <p className="price-num text-lg text-espresso">{formatPrice(subtotal, locale)}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div ref={inlineCtaRef} className="flex gap-3 mb-3">
              <Button
                size="lg"
                className="flex-1 bg-espresso hover:bg-espresso-soft text-cream label-sm py-6 h-auto"
                onClick={handleAdd}
              >
                <ShoppingBag className="h-4 w-4 me-2" />
                {t("common.add_to_cart")}
              </Button>
              <Button
                type="button"
                onClick={() => toggleSaved(product.id)}
                size="lg"
                variant="outline"
                className={cn(
                  "px-5 label-sm border-border py-6 h-auto",
                  saved && "bg-cream-warm border-espresso"
                )}
                aria-label={saved ? t("products.saved") : t("products.save")}
              >
                <Heart className={cn("h-4 w-4", saved && "fill-current")} />
              </Button>
            </div>

            {product.isCustomizable && (
              <Button
                render={<Link href={`/${locale}/demo`} />}
                size="lg"
                variant="outline"
                className="w-full border-border hover:border-espresso label-sm mb-3 py-6 h-auto"
              >
                <Palette className="h-4 w-4 me-2" />
                {t("products.customize_this")}
              </Button>
            )}

            {/* Bulk quote CTA — only at 30m+ */}
            {bulkEligible && (
              <div className="mt-4 p-4 bg-cream-warm border-l-2 border-bronze">
                <p className="label-xs text-bronze mb-1">{t("products.bulk_quote")}</p>
                <p className="text-sm text-foreground mb-3">{t("products.bulk_note")}</p>
                <Link
                  href={`/${locale}/contact?type=wholesale&product=${product.slug}&meters=${meters}`}
                  className="inline-flex items-center gap-2 label-sm text-espresso border-b border-espresso pb-0.5"
                >
                  <MessageSquareQuote className="h-4 w-4" />
                  {t("products.bulk_quote")}
                </Link>
              </div>
            )}

            {/* Tabby promo */}
            <p className="mt-4 label-xs text-muted-foreground text-center">
              {t("cart.tabby_promo")}
            </p>
          </div>
        </div>

        {/* Styled With */}
        {styledWith.length > 0 && (
          <section className="mt-20 lg:mt-32 pt-16 sm:pt-20 border-t border-border/50">
            <div className="mb-10">
              <p className="label-xs text-bronze mb-2">{t("products.styled_with")}</p>
              <h2 className="display-md italic text-foreground" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 48" }}>
                {t("products.styled_with")}
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {styledWith.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky add-to-bag */}
      <MobileAddToBag
        meters={meters}
        pricePerMeter={product.pricePerMeter}
        onAdd={handleAdd}
        triggerRef={inlineCtaRef}
      />
    </>
  );
}
