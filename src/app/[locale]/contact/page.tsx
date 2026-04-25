"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  WHATSAPP_NUMBER_DISPLAY,
  WHATSAPP_LINK,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from "@/lib/contact";

// Placeholder email — update when the company has a real address.
const PLACEHOLDER_EMAIL = "hello@lotofabrics.ae";

export default function ContactPage() {
  const t = useTranslations("contact");
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isWholesale = type === "wholesale";

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-24">
      <div className="max-w-[720px] mb-14 sm:mb-20">
        <p className="label-xs text-bronze mb-3">
          {isWholesale ? t("trade_title") : "Contact"}
        </p>
        <h1 className="display-xl text-foreground mb-4">
          {isWholesale ? t("trade_title") : t("title")}
        </h1>
        <p className="body-lg text-muted-foreground">
          {isWholesale ? t("trade_text") : t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="name" className="label-xs text-bronze">{t("name")}</Label>
            <Input id="name" required className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:border-espresso focus-visible:ring-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="label-xs text-bronze">{t("email")}</Label>
            <Input id="email" type="email" required className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:border-espresso focus-visible:ring-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="label-xs text-bronze">{t("message")}</Label>
            <textarea
              id="message"
              rows={5}
              required
              defaultValue={isWholesale ? "I'm interested in trade / wholesale pricing. My business is:" : ""}
              className="flex w-full border-0 border-b border-border bg-transparent px-0 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-espresso resize-none"
            />
          </div>
          <Button
            type="submit"
            className="bg-espresso hover:bg-espresso-soft text-cream label-sm px-10 py-6 h-auto"
            size="lg"
          >
            {t("send")}
          </Button>
        </form>

        <div className="space-y-8 lg:pt-4">
          <div>
            <p className="label-xs text-bronze mb-2">{t("location_label")}</p>
            <p className="text-foreground">{t("location")}</p>
          </div>

          <div>
            <p className="label-xs text-bronze mb-2">{t("phone_label")}</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-espresso-soft transition-colors"
            >
              {WHATSAPP_NUMBER_DISPLAY}
            </a>
          </div>

          <div>
            <p className="label-xs text-bronze mb-2">{t("email_label")}</p>
            <a
              href={`mailto:${PLACEHOLDER_EMAIL}`}
              className="text-foreground hover:text-espresso-soft transition-colors"
            >
              {PLACEHOLDER_EMAIL}
            </a>
          </div>

          <div className="pt-8 border-t border-border/50">
            <p className="label-xs text-bronze mb-2">WhatsApp</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-foreground border-b border-pink-salt-deep pb-0.5 hover:border-espresso transition-colors w-fit"
            >
              {WHATSAPP_NUMBER_DISPLAY}
            </a>
          </div>

          <div>
            <p className="label-xs text-bronze mb-2">Instagram</p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-espresso-soft transition-colors"
            >
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
