"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice, localize } from "@/lib/format";

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { items, removeItem, updateMeters, getSubtotal, getVat, getTotal } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-muted-foreground/30 mb-8" strokeWidth={1} />
        <h1 className="display-lg italic text-foreground mb-3" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 96" }}>
          {t("cart.empty")}
        </h1>
        <p className="text-muted-foreground mb-10">{t("cart.empty_cta")}</p>
        <Button
          render={<Link href={`/${locale}/products`} />}
          className="bg-espresso hover:bg-espresso-soft text-cream label-sm px-10 py-6 h-auto"
        >
          {t("common.products")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 lg:py-16">
      <div className="mb-10">
        <p className="label-xs text-bronze mb-2">{t("common.cart")}</p>
        <h1 className="display-lg text-foreground">{t("cart.title")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 sm:gap-5 py-6 border-b border-border/50">
              <Link
                href={`/${locale}/products/${item.slug}`}
                className="relative w-24 h-32 sm:w-32 sm:h-40 overflow-hidden bg-cream-warm shrink-0"
              >
                <Image
                  src={item.image}
                  alt={localize(item, "name", locale)}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <Link
                  href={`/${locale}/products/${item.slug}`}
                  className="display-sm text-foreground hover:text-espresso-soft transition-colors line-clamp-1"
                >
                  {localize(item, "name", locale)}
                </Link>
                <p className="price-num text-xs text-muted-foreground mt-1">
                  {formatPrice(item.pricePerMeter, locale)} / {t("common.per_meter")}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => updateMeters(item.productId, item.meters - 1, item.variantId)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-cream-warm transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 price-num text-sm text-center">{item.meters}m</span>
                    <button
                      onClick={() => updateMeters(item.productId, item.meters + 1, item.variantId)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-cream-warm transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-end">
                    <p className="price-num text-base text-espresso">
                      {formatPrice(item.pricePerMeter * item.meters, locale)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="mt-1 label-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      {t("common.remove")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 bg-cream-warm p-6 lg:p-8 space-y-5">
            <h2 className="label-xs text-bronze">{t("cart.order_summary")}</h2>

            <Separator className="bg-border/50" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("common.subtotal")}</span>
                <span className="price-num">{formatPrice(getSubtotal(), locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("common.vat")}</span>
                <span className="price-num">{formatPrice(getVat(), locale)}</span>
              </div>
              <p className="label-xs text-muted-foreground">{t("cart.shipping_note")}</p>
            </div>

            <Separator className="bg-border/50" />

            <div className="flex justify-between items-baseline">
              <span className="label-sm text-foreground">{t("common.total")}</span>
              <span className="price-num text-2xl text-espresso">
                {formatPrice(getTotal(), locale)}
              </span>
            </div>

            <Button
              render={<Link href={`/${locale}/checkout`} />}
              className="w-full bg-espresso hover:bg-espresso-soft text-cream label-sm py-6 h-auto"
              size="lg"
            >
              {t("common.checkout")}
            </Button>

            <p className="label-xs text-muted-foreground text-center">
              {t("cart.tabby_promo")}
            </p>

            <Link
              href={`/${locale}/products`}
              className="block text-center label-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("common.continue_shopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
