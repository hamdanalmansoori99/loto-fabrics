"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { CreditCard, Landmark, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/format";
import { EMIRATES, COD_SURCHARGE } from "@/lib/constants";

export default function CheckoutPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { items, getSubtotal, getVat, getTotal } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "tabby" | "cod"
  >("card");

  const codExtra = paymentMethod === "cod" ? COD_SURCHARGE : 0;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-medium tracking-tight mb-4">Your cart is empty</h1>
        <Button render={<Link href={`/${locale}/products`} />}>
          {t("common.products")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="label-xs text-bronze mb-2">Checkout</p>
        <h1 className="display-lg text-foreground">
          {t("checkout.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-12">
        {/* Form */}
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Shipping */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium tracking-wide">
              {t("checkout.shipping")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("checkout.full_name")}</Label>
                <Input required />
              </div>
              <div className="space-y-2">
                <Label>{t("checkout.phone")}</Label>
                <Input type="tel" placeholder="+971" required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>{t("checkout.email")}</Label>
                <Input type="email" required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>{t("checkout.address")}</Label>
                <Input required />
              </div>
              <div className="space-y-2">
                <Label>{t("checkout.city")}</Label>
                <Input required />
              </div>
              <div className="space-y-2">
                <Label>{t("checkout.emirate")}</Label>
                <select className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm">
                  {EMIRATES.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium tracking-wide">
              {t("checkout.payment")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "card" as const,
                  label: t("checkout.card_payment"),
                  icon: CreditCard,
                },
                {
                  id: "tabby" as const,
                  label: t("checkout.tabby_payment"),
                  icon: Landmark,
                },
                {
                  id: "cod" as const,
                  label: t("checkout.cod_payment"),
                  icon: Truck,
                },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  className={`flex items-center gap-3 p-4 rounded-sm border text-sm transition-all ${
                    paymentMethod === id
                      ? "border-pink-salt-dark bg-pink-salt/20 text-foreground"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
            {paymentMethod === "cod" && (
              <p className="text-sm text-muted-foreground">
                {t("checkout.cod_surcharge")}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-espresso hover:bg-espresso-soft text-cream label-sm py-6 h-auto"
          >
            {t("checkout.place_order")}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="bg-secondary rounded-sm p-6 space-y-4">
            <h2 className="text-lg font-medium tracking-wide">
              {t("cart.order_summary")}
            </h2>
            <Separator />
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex justify-between text-sm"
                >
                  <span className="truncate me-4">
                    {locale === "ar" ? item.nameAr : item.nameEn} x{" "}
                    {item.meters}m
                  </span>
                  <span className="shrink-0">
                    {formatPrice(item.pricePerMeter * item.meters, locale)}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("common.subtotal")}
                </span>
                <span>{formatPrice(getSubtotal(), locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("common.vat")}</span>
                <span>{formatPrice(getVat(), locale)}</span>
              </div>
              {codExtra > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">COD Fee</span>
                  <span>{formatPrice(codExtra, locale)}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>{t("common.total")}</span>
              <span className="text-pink-salt-dark font-bold">
                {formatPrice(getTotal() + codExtra, locale)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
