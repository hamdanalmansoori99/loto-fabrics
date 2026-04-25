import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Inter, Cairo, Fraunces, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// ─── Typography system: 3-font editorial hierarchy ───
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lotofabrics.ae"),
  title: {
    default: "Loto Fabrics — Heirloom Embroidered Cloth, UAE",
    template: "%s · Loto Fabrics",
  },
  description:
    "Hand-embroidered bridal and occasion fabrics sold by the meter. Made in the UAE.",
  openGraph: {
    type: "website",
    siteName: "Loto Fabrics",
    images: [{ url: "/images/products/garments/mikhwars/mikhwar-15.png", width: 1200, height: 1600 }],
  },
  twitter: { card: "summary_large_image" },
  themeColor: "#F6EFE9",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRtl = locale === "ar";
  const fontClass = `${inter.variable} ${fraunces.variable} ${jetbrains.variable} ${cairo.variable}`;

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} className={fontClass}>
      <body className={`min-h-screen flex flex-col bg-background text-foreground antialiased ${isRtl ? "font-arabic" : "font-sans"}`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position={isRtl ? "bottom-left" : "bottom-right"} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
