"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

/**
 * Dark espresso full-width newsletter band. Submission shows a toast.
 * No backend — replace handler when connecting to real service.
 */
export default function NewsletterBand() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success(t("newsletter_success"));
    setEmail("");
  };

  return (
    <section className="w-full bg-espresso text-cream py-20 sm:py-28">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end">
          <div className="max-w-[520px]">
            <p className="label-xs text-pink-salt mb-3">{t("newsletter_eyebrow")}</p>
            <h2 className="display-lg text-cream">
              <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 96" }}>
                {t("newsletter_title_italic")}
              </span>
            </h2>
            <p className="mt-4 text-cream/70">{t("newsletter_subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <label htmlFor="newsletter-email" className="label-xs text-pink-salt block mb-2">
                {t("newsletter_label")}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter_placeholder")}
                className="w-full bg-transparent border-b border-cream/30 text-cream placeholder:text-cream/40 py-2 px-0 outline-none focus:border-pink-salt transition-colors"
              />
            </div>
            <button
              type="submit"
              className="label-sm text-cream bg-pink-salt-deep hover:bg-pink-salt-dark px-8 py-4 transition-colors shrink-0"
            >
              {t("newsletter_cta")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
