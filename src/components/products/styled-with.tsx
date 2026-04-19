import { getTranslations } from "next-intl/server";
import ProductCard from "./product-card";
import { getStyledWith } from "@/lib/sample-data";

interface StyledWithProps {
  productId: string;
}

export default async function StyledWith({ productId }: StyledWithProps) {
  const t = await getTranslations("products");
  const items = getStyledWith(productId);

  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 border-t border-border/50">
      <div className="mb-8 sm:mb-10">
        <p className="label-xs text-bronze mb-2">{t("styled_with")}</p>
        <h2 className="display-md italic text-foreground" style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 48" }}>
          {t("styled_with")}
        </h2>
      </div>

      <div className="snap-row no-scrollbar overflow-x-auto">
        <div className="flex gap-4 sm:gap-6">
          {items.map((p) => (
            <div key={p.id} className="snap-start-always shrink-0 w-[70vw] sm:w-[32vw] lg:w-[24vw]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
