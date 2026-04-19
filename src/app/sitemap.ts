import type { MetadataRoute } from "next";
import { sampleProducts } from "@/lib/sample-data";

const BASE = "https://lotofabrics.ae";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages = ["", "/products", "/demo", "/about", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  // Locale-prefixed static pages
  for (const locale of ["en", "ar"]) {
    for (const path of staticPages) {
      entries.push({
        url: `${BASE}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1.0 : 0.7,
      });
    }
    // Product pages
    for (const product of sampleProducts) {
      entries.push({
        url: `${BASE}/${locale}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  return entries;
}
