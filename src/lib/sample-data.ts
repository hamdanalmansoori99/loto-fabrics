import type { Product } from "@/types/product";

// ─── Catalog ──────────────────────────────────────────────────────────
// 22 ready-to-wear thybans (per-piece, opening price 889 was 999 AED)
// 10 everyday jalabiyas (price on request — inquire on WhatsApp)
// ─────────────────────────────────────────────────────────────────────

export const sampleProducts: Product[] = [

  // ═══════════════════════════════════════════════════════════════════
  // THYBAN — finished occasion-wear, opening price 889 (was 999)
  // ═══════════════════════════════════════════════════════════════════
  ...buildThybans(),

  // ═══════════════════════════════════════════════════════════════════
  // JALABYA — everyday flowing pieces, price on request
  // ═══════════════════════════════════════════════════════════════════
  ...buildJalabyas(),
];

// ─── Thyban generator ──────────────────────────────────────────────────
// 22 finished pieces, all 889 / was 999 AED. Color/name variety so the catalog
// reads as a real curated drop, not a synthetic list.
function buildThybans(): Product[] {
  const M: Array<{ name: { en: string; ar: string }; descEn: string; descAr: string; color: Product["colorFamily"]; isFeatured?: boolean; isNew?: boolean }> = [
    { name: { en: "Pearl Cascade Thyban", ar: "ثوب شلال اللؤلؤ" }, descEn: "Ivory tulle with cascading pearl and silver bullion at the V-neck. Floor-length with bell sleeves.", descAr: "تول عاجي مع شلال من اللؤلؤ والتطريز الفضي عند الرقبة. طول الأرض بأكمام واسعة.", color: "cream", isFeatured: true, isNew: true },
    { name: { en: "Onyx Paisley Thyban", ar: "ثوب بيزلي أونيكس" }, descEn: "Deep black net layered with red and silver paisley embroidery. Long bell sleeves.", descAr: "شبك أسود عميق مطبق بتطريز بيزلي أحمر وفضي. أكمام واسعة طويلة.", color: "black", isFeatured: true },
    { name: { en: "Blush Crystal Thyban", ar: "ثوب كريستال وردي" }, descEn: "Soft blush net dense with crystal beadwork and silver-gold thread. Wing-sleeve drape.", descAr: "شبك وردي ناعم مكتنز بأعمال الكريستال والخيط الفضي الذهبي. انسدال أجنحة.", color: "pink", isFeatured: true },
    { name: { en: "Champagne Heritage Thyban", ar: "ثوب شامبين تراثي" }, descEn: "Champagne tulle with all-over heritage Khaleeji embroidery in antique gold.", descAr: "تول شامبين بتطريز خليجي تراثي شامل بالذهب العتيق.", color: "gold", isFeatured: true },
    { name: { en: "Ivory Bullion Thyban", ar: "ثوب عاجي معدني" }, descEn: "Ivory chiffon with a vertical bullion panel and pearl scatter. Wedding-ready.", descAr: "شيفون عاجي مع لوحة معدنية رأسية وتناثر اللؤلؤ. جاهز للأعراس.", color: "cream" },
    { name: { en: "Garnet Rose Thyban", ar: "ثوب وردة الجارنت" }, descEn: "Deep garnet net with hand-stitched rose vines and gold accents.", descAr: "شبك جارنت غامق مع كرمات الورود المخيطة يدوياً ولمسات ذهبية.", color: "burgundy", isFeatured: true },
    { name: { en: "Sapphire Bloom Thyban", ar: "ثوب زهر الياقوت" }, descEn: "Sapphire-blue tulle scattered with silver florals and pearl drops.", descAr: "تول أزرق ياقوتي متناثر بزهور فضية وقطرات لؤلؤ.", color: "blue" },
    { name: { en: "Crimson Dynasty Thyban", ar: "ثوب سلالة قرمزية" }, descEn: "Vivid crimson net richly worked with gold paisley and pearl edging.", descAr: "شبك قرمزي حيوي مزخرف بغنى ببيزلي ذهبي وحواف لؤلؤية.", color: "red", isFeatured: true },
    { name: { en: "Golden Lattice Thyban", ar: "ثوب شبكة ذهبية" }, descEn: "Champagne tulle with a golden trellis pattern and beadwork along the panel.", descAr: "تول شامبين بنمط شبكي ذهبي وأعمال خرز على اللوحة.", color: "gold" },
    { name: { en: "Pearl Court Thyban", ar: "ثوب بلاط اللؤلؤ" }, descEn: "Cream tulle with seed pearl medallion and scalloped silver borders.", descAr: "تول كريمي مع ميدالية لؤلؤية وحواف فضية مزخرفة.", color: "cream", isNew: true },
    { name: { en: "Emerald Vine Thyban", ar: "ثوب كرمة الزمرد" }, descEn: "Emerald-base net with silver and gold botanical embroidery, cascading sleeves.", descAr: "شبك بقاعدة زمردية بتطريز نباتي فضي وذهبي وأكمام متدفقة.", color: "green" },
    { name: { en: "Antique Silver Thyban", ar: "ثوب الفضة العتيقة" }, descEn: "Ivory chiffon with antique-silver scrollwork and pearl tassel detail.", descAr: "شيفون عاجي بتطريز فضي عتيق وتفاصيل شراشيب لؤلؤية.", color: "cream" },
    { name: { en: "Rose Gold Thyban", ar: "ثوب الذهب الوردي" }, descEn: "Soft pink chiffon with rose-gold thread and bead clusters at the bodice.", descAr: "شيفون وردي ناعم بخيوط ذهبية وردية وعناقيد خرز عند الصدر.", color: "pink", isNew: true },
    { name: { en: "Midnight Garden Thyban", ar: "ثوب حديقة منتصف الليل" }, descEn: "Black net with multicolour floral embroidery — pinks, golds, and seafoam green.", descAr: "شبك أسود بتطريز زهري متعدد الألوان — وردي، ذهبي، وأخضر بحري.", color: "black" },
    { name: { en: "Saffron Court Thyban", ar: "ثوب بلاط الزعفران" }, descEn: "Warm saffron tulle with antique-gold heritage panel down the centre.", descAr: "تول زعفراني دافئ بلوحة تراثية ذهبية عتيقة في المنتصف.", color: "gold" },
    { name: { en: "Ivory Crown Thyban", ar: "ثوب التاج العاجي" }, descEn: "Ivory chiffon with a tall crown-shaped pearl panel and bell sleeves.", descAr: "شيفون عاجي بلوحة لؤلؤية على شكل تاج طويل وأكمام واسعة.", color: "cream", isFeatured: true },
    { name: { en: "Wine & Gold Thyban", ar: "ثوب العنب والذهب" }, descEn: "Wine-dark net richly worked with gold and pearl, hem-trail embroidery.", descAr: "شبك بلون النبيذ الغامق بتطريز ذهبي ولؤلؤي غني وذيل مطرز.", color: "burgundy" },
    { name: { en: "Powder Pink Thyban", ar: "ثوب الوردي الناعم" }, descEn: "Powder-pink chiffon with crystal scatter and pearl-edge sleeve cuffs.", descAr: "شيفون بلون الوردي الناعم بتناثر كريستالي وحواف لؤلؤية للأكمام.", color: "pink" },
    { name: { en: "Royal Indigo Thyban", ar: "ثوب النيلي الملكي" }, descEn: "Indigo-blue net with silver foliage and turquoise bead accents.", descAr: "شبك أزرق نيلي بأوراق فضية ولمسات خرز تركوازي.", color: "blue", isNew: true },
    { name: { en: "Golden Dawn Thyban", ar: "ثوب فجر ذهبي" }, descEn: "Sunlit champagne tulle with light-catching sequin work across the bodice.", descAr: "تول شامبين مضاء بأعمال ترتر تلتقط الضوء عبر الصدر.", color: "gold" },
    { name: { en: "Pearl Midnight Thyban", ar: "ثوب لؤلؤة منتصف الليل" }, descEn: "Black net with all-over silver and pearl embroidery — light against dark.", descAr: "شبك أسود بتطريز فضي ولؤلؤي شامل — ضوء على خلفية داكنة.", color: "black" },
    { name: { en: "Heritage Cream Thyban", ar: "ثوب كريم تراثي" }, descEn: "Cream net with traditional Khaleeji panel and gold leaf detailing throughout.", descAr: "شبك كريمي بلوحة خليجية تقليدية وتفاصيل ورق ذهبي في كل مكان.", color: "cream", isFeatured: true },
  ];

  return M.map((m, idx): Product => {
    const num = String(idx + 1).padStart(2, "0");
    const slug = m.name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: `m-${num}`,
      nameEn: m.name.en,
      nameAr: m.name.ar,
      slug,
      descriptionEn: m.descEn,
      descriptionAr: m.descAr,
      priceMode: "per_piece",
      pricePerPiece: 889,
      compareAtPrice: 999,
      sku: `LF-TH-${num}`,
      fabricType: "tulle",
      composition: "Net base · Hand-embroidered bullion, beads, and pearls",
      careInstructions: "Dry clean only. Store flat.",
      origin: "Embroidered in Abu Dhabi",
      isCustomizable: false,
      isFeatured: !!m.isFeatured,
      isNew: m.isNew,
      inStock: true,
      stockQuantity: 1,
      collection: "thyban",
      colorFamily: m.color,
      images: [
        { id: `m-${num}-a`, url: `/images/products/garments/mikhwars/mikhwar-${num}.png`, sortOrder: 0, isMain: true, alt: `${m.name.en} — front view` },
      ],
      variants: [],
      tags: ["thyban", "occasion", "ready-to-wear", m.color],
      createdAt: "2026-04-26",
      updatedAt: "2026-04-26",
    };
  });
}

// ─── Jalabya generator ────────────────────────────────────────────────
// 10 everyday pieces, price on request — inquire on WhatsApp.
// `material` overrides the default cotton fabric type — admin panel will
// expose this same toggle so each piece can be cotton or silk per the actual
// stock.
function buildJalabyas(): Product[] {
  const J: Array<{ name: { en: string; ar: string }; descEn: string; descAr: string; color: Product["colorFamily"]; isFeatured?: boolean; isNew?: boolean; material?: "cotton" | "silk" }> = [
    { name: { en: "Sky Blue Floral Jalabya", ar: "جلابية زرقاء سماوية بزخارف زهرية" }, descEn: "Sky-blue printed jalabya with a floral motif, scalloped lace neckline, and hand-tied tassel.", descAr: "جلابية مطبوعة باللون الأزرق السماوي بزخرفة زهرية ورقبة دانتيل ومزخرفة بشرابة.", color: "blue", isFeatured: true, isNew: true, material: "silk" },
    { name: { en: "Ivory Lavender Jalabya", ar: "جلابية عاجية لافندر" }, descEn: "Cream cotton with soft lavender motifs and lace bib detail at the neckline.", descAr: "قطن كريمي بزخارف لافندر ناعمة وتفصيل دانتيل عند الرقبة.", color: "neutral" },
    { name: { en: "Garden Rose Jalabya", ar: "جلابية وردة الحديقة" }, descEn: "Vivid floral print on a deep teal base with painterly rose blooms.", descAr: "طباعة زهرية حيوية على قاعدة لون البحر الغامق مع زهور ورد فنية.", color: "green", isFeatured: true, material: "silk" },
    { name: { en: "Mauve Damask Jalabya", ar: "جلابية دمشقية بنفسجية" }, descEn: "Soft mauve damask print with intricate medallion neckline detail.", descAr: "طباعة دمشقية بنفسجية ناعمة مع تفصيل ميدالية معقد عند الرقبة.", color: "pink" },
    { name: { en: "Crimson Paisley Jalabya", ar: "جلابية بيزلي قرمزية" }, descEn: "Classic crimson paisley print, lace neckline, lightweight summer drape.", descAr: "طباعة بيزلي قرمزية كلاسيكية، رقبة دانتيل، انسدال صيفي خفيف.", color: "red", isNew: true, material: "silk" },
    { name: { en: "Verdant Bloom Jalabya", ar: "جلابية إزدهار أخضر" }, descEn: "Forest green base with painterly tropical florals and gold accent piping.", descAr: "قاعدة خضراء غابية مع زهور استوائية فنية وحواف ذهبية.", color: "green", isFeatured: true },
    { name: { en: "Saffron Sunset Jalabya", ar: "جلابية غروب الزعفران" }, descEn: "Warm saffron and ochre print with abstract botanical motif and lace bib.", descAr: "طباعة دافئة بالزعفران والمغرة بزخرفة نباتية تجريدية وصدرية دانتيل.", color: "gold" },
    { name: { en: "Coral Bouquet Jalabya", ar: "جلابية باقة المرجان" }, descEn: "Coral and ivory bouquet print, scalloped lace neckline, soft full sleeves.", descAr: "طباعة باقة مرجانية وعاجية، رقبة دانتيل مزخرفة، أكمام كاملة ناعمة.", color: "pink", material: "silk" },
    { name: { en: "Cobalt Wildflower Jalabya", ar: "جلابية الزهور البرية الكوبالتية" }, descEn: "Cobalt-blue base scattered with delicate wildflowers and gold edging.", descAr: "قاعدة زرقاء كوبالتية متناثرة بأزهار برية رقيقة وحواف ذهبية.", color: "blue", material: "silk" },
    { name: { en: "Heritage Brick Jalabya", ar: "جلابية الطوب التراثي" }, descEn: "Brick-red and amber heritage print with paisley motif and lace neckline.", descAr: "طباعة تراثية بلون الطوب الأحمر والكهرماني بزخرفة بيزلي ورقبة دانتيل.", color: "red", material: "silk" },
  ];

  return J.map((j, idx): Product => {
    const num = String(idx + 1).padStart(2, "0");
    const slug = j.name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const material = j.material ?? "cotton";
    return {
      id: `j-${num}`,
      nameEn: j.name.en,
      nameAr: j.name.ar,
      slug,
      descriptionEn: j.descEn,
      descriptionAr: j.descAr,
      priceMode: "on_request",
      sku: `LF-JL-${num}`,
      fabricType: material,
      composition: material === "silk" ? "Pure silk · Printed" : "Cotton-silk blend · Printed",
      careInstructions: material === "silk" ? "Dry clean only." : "Hand wash cold. Line dry.",
      origin: "Made in Abu Dhabi",
      isCustomizable: false,
      isFeatured: !!j.isFeatured,
      isNew: j.isNew,
      inStock: true,
      stockQuantity: 1,
      collection: "jalabya",
      colorFamily: j.color,
      images: [
        { id: `j-${num}-a`, url: `/images/products/garments/jalabyas/jalabya-${num}.png`, sortOrder: 0, isMain: true, alt: `${j.name.en} — front view` },
      ],
      variants: [],
      tags: ["jalabya", "everyday", "ready-to-wear", j.color],
      createdAt: "2026-04-26",
      updatedAt: "2026-04-26",
    };
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────
export function getProductBySlug(slug: string) {
  return sampleProducts.find((p) => p.slug === slug);
}

export function getProductsByCollection(collection: string) {
  return sampleProducts.filter((p) => p.collection === collection);
}

export function getStyledWith(productId: string, limit = 3) {
  const product = sampleProducts.find((p) => p.id === productId);
  if (!product?.styledWith) return [];
  return product.styledWith
    .map((id) => sampleProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, limit);
}

/** Returns true when a product can be added to the cart (has a fixed price). */
export function isPurchasable(product: Product): boolean {
  return product.priceMode === "per_meter" || product.priceMode === "per_piece";
}
