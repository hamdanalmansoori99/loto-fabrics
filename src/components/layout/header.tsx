"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useSavedStore } from "@/stores/saved-store";
import LocaleSwitcher from "./locale-switcher";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const itemCount = useCartStore((s) => s.getItemCount());
  const savedCount = useSavedStore((s) => s.savedIds.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Lock body scroll when mobile menu is open
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: `/${locale}/products`, label: t("products") },
    { href: `/${locale}/demo`, label: t("demo") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled ? "frosted-light border-b border-border/40" : "bg-background"
        )}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-baseline gap-2 transition-opacity hover:opacity-70"
            >
              <span className="display-sm text-espresso" style={{ fontVariationSettings: "'SOFT' 0, 'opsz' 32" }}>
                Loto
              </span>
              <span className="hidden sm:inline label-xs text-muted-foreground">
                Fabrics
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="label-xs text-foreground/70 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <LocaleSwitcher />

              <Link
                href={`/${locale}/products?saved=1`}
                className="relative p-2 hover:text-pink-salt-deep transition-colors"
                aria-label={t("saved")}
              >
                <Heart className="h-5 w-5" />
                {savedCount > 0 && (
                  <span className="absolute -top-0.5 -end-0.5 min-w-4 h-4 px-1 rounded-full bg-espresso text-cream text-[10px] leading-4 text-center font-medium">
                    {savedCount}
                  </span>
                )}
              </Link>

              <Link
                href={`/${locale}/cart`}
                className="relative p-2 hover:text-pink-salt-deep transition-colors"
                aria-label={t("cart")}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -end-0.5 min-w-4 h-4 px-1 rounded-full bg-espresso text-cream text-[10px] leading-4 text-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="md:hidden inline-flex items-center justify-center p-2 hover:bg-cream-warm transition-colors"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen takeover */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 border-b border-border/40">
            <Link
              href={`/${locale}`}
              onClick={() => setMobileOpen(false)}
              className="display-sm text-espresso"
              style={{ fontVariationSettings: "'SOFT' 0, 'opsz' 32" }}
            >
              Loto
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-6 py-12 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="display-md text-foreground hover:text-espresso-soft transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-6 py-6 border-t border-border/40 flex items-center justify-between">
            <a
              href="https://instagram.com/loto_ae"
              target="_blank"
              rel="noopener noreferrer"
              className="label-xs text-muted-foreground hover:text-foreground"
            >
              @LOTO_AE
            </a>
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </>
  );
}
