import type { Product } from "@/types/product";

// ─── Catalog ──────────────────────────────────────────────────────────
// 7 fabric features + 3 fabric essentials (per-meter pricing)
// 22 ready-to-wear mikhwars (per-piece, opening price 889 was 999)
// 10 everyday jalabiyas (price on request — inquire on WhatsApp)
// ─────────────────────────────────────────────────────────────────────

export const sampleProducts: Product[] = [
  // ═══════════════════════════════════════════════════════════════════
  // FABRIC — sold by the meter
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "1",
    nameEn: "Burgundy Rose Ivory Silk",
    nameAr: "حرير عاجي بورد عنابي",
    slug: "burgundy-rose-ivory-silk",
    descriptionEn:
      "Heirloom ivory silk charmeuse, hand-embroidered with cascading burgundy roses and antique gold vines. A statement cloth that carries its own presence into the room — unrepeatable, made in a 28-piece run.",
    descriptionAr:
      "حرير شارميوز عاجي موروث، مطرز يدوياً بورود عنابية متدفقة وكرمات ذهبية عتيقة. قماش مميز يحمل حضوره الخاص إلى الغرفة — فريد من نوعه، من إنتاج محدود 28 قطعة.",
    priceMode: "per_meter",
    pricePerMeter: 720,
    compareAtPrice: 860,
    minOrderMeters: 2,
    sku: "LF-BRI-001",
    fabricType: "silk",
    fabricWeight: "140 GSM",
    fabricWidth: "140 cm",
    composition: "100% Mulberry Silk · Hand-embroidered bullion & silk floss",
    careInstructions: "Dry clean only. Store flat, away from direct light.",
    origin: "Embroidered in Dubai",
    certifications: ["OEKO-TEX Standard 100"],
    isCustomizable: true,
    isFeatured: true,
    isLimited: true,
    inStock: true,
    stockQuantity: 18,
    collection: "bridal",
    colorFamily: "burgundy",
    styledWith: ["3", "5", "9"],
    images: [{ id: "img-1-a", url: "/images/products/kaftan-burgundy-rose.png", sortOrder: 0, isMain: true, alt: "Burgundy rose ivory silk kaftan" }],
    variants: [],
    tags: ["silk", "embroidered", "ivory", "burgundy", "gold", "bridal", "limited"],
    createdAt: "2025-09-01",
    updatedAt: "2026-03-15",
  },
  {
    id: "2",
    nameEn: "Champagne Royal Chiffon",
    nameAr: "شيفون شامبين ملكي",
    slug: "champagne-royal-chiffon",
    descriptionEn:
      "All-over champagne chiffon worked with gold metallic thread, pearl beads, and silver sequins. Soft drape that catches candlelight across a room. Designed for Eid, engagement, and celebration.",
    descriptionAr:
      "شيفون شامبين مطرز بالكامل بخيوط ذهبية معدنية، خرز لؤلؤ، وترتر فضي. انسدال ناعم يلتقط ضوء الشموع عبر الغرفة. مصمم للعيد، الخطوبة، والاحتفالات.",
    priceMode: "per_meter",
    pricePerMeter: 560,
    minOrderMeters: 2,
    sku: "LF-CRC-002",
    fabricType: "chiffon",
    fabricWeight: "85 GSM",
    fabricWidth: "145 cm",
    composition: "Silk chiffon · Metallic bullion · Seed pearls · Sequin",
    careInstructions: "Dry clean only.",
    origin: "Embroidered in Dubai",
    isCustomizable: true,
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockQuantity: 34,
    collection: "occasion",
    colorFamily: "gold",
    styledWith: ["5", "6", "1"],
    images: [{ id: "img-2-a", url: "/images/products/kaftan-champagne-royal.png", sortOrder: 0, isMain: true, alt: "Champagne royal chiffon kaftan" }],
    variants: [],
    tags: ["chiffon", "champagne", "gold", "pearl", "occasion", "new"],
    createdAt: "2026-02-10",
    updatedAt: "2026-04-01",
  },
  {
    id: "3",
    nameEn: "Pearl & Gold Chiffon",
    nameAr: "شيفون لؤلؤي وذهبي",
    slug: "pearl-and-gold-chiffon",
    descriptionEn:
      "Ivory chiffon with a dense V-neck medallion of seed pearls, bullion scrollwork, and silver thread. Cascading borders at hem and cuff. Bridal fabric designed to photograph.",
    descriptionAr:
      "شيفون عاجي مع ميدالية كثيفة برقبة V من خرز اللؤلؤ، تطريز معدني، وخيط فضي. حواف متدفقة عند الذيل والكم. قماش زفاف مصمم للتصوير.",
    priceMode: "per_meter",
    pricePerMeter: 640,
    minOrderMeters: 2,
    sku: "LF-PGC-003",
    fabricType: "chiffon",
    fabricWeight: "90 GSM",
    fabricWidth: "150 cm",
    composition: "Silk chiffon · Seed pearl · Silver & gold bullion",
    careInstructions: "Dry clean only. Handle with care.",
    origin: "Embroidered in Dubai",
    certifications: ["OEKO-TEX Standard 100"],
    isCustomizable: true,
    isFeatured: true,
    inStock: true,
    stockQuantity: 22,
    collection: "bridal",
    colorFamily: "cream",
    styledWith: ["1", "6", "8"],
    images: [{ id: "img-3-a", url: "/images/products/kaftan-pearl-gold.png", sortOrder: 0, isMain: true, alt: "Pearl and gold chiffon kaftan" }],
    variants: [],
    tags: ["chiffon", "pearl", "gold", "ivory", "bridal"],
    createdAt: "2025-11-15",
    updatedAt: "2026-03-20",
  },
  {
    id: "4",
    nameEn: "Peach Blossom Silk",
    nameAr: "حرير زهر الخوخ",
    slug: "peach-blossom-silk",
    descriptionEn:
      "Ivory silk scattered with embroidered peach blossoms and muted gold leaves. Soft enough for drape, substantial enough to hold shape — our most-ordered bridal fabric.",
    descriptionAr:
      "حرير عاجي متناثر بزهور الخوخ المطرزة وأوراق ذهبية هادئة. ناعم بما يكفي للانسدال، ومميز بما يكفي للحفاظ على الشكل — أكثر أقمشة الزفاف طلباً لدينا.",
    priceMode: "per_meter",
    pricePerMeter: 490,
    minOrderMeters: 2,
    sku: "LF-PBS-004",
    fabricType: "silk",
    fabricWeight: "120 GSM",
    fabricWidth: "150 cm",
    composition: "100% Pure Silk · Silk floss embroidery",
    careInstructions: "Dry clean only.",
    origin: "Embroidered in Dubai",
    isCustomizable: true,
    isFeatured: true,
    inStock: true,
    stockQuantity: 52,
    collection: "bridal",
    colorFamily: "cream",
    styledWith: ["3", "1", "7"],
    images: [{ id: "img-4-a", url: "/images/products/kaftan-peach-blossom.png", sortOrder: 0, isMain: true, alt: "Peach blossom ivory silk kaftan" }],
    variants: [],
    tags: ["silk", "embroidered", "peach", "gold", "bridal"],
    createdAt: "2024-06-01",
    updatedAt: "2026-03-01",
  },
  {
    id: "5",
    nameEn: "Golden Heritage Kaftan Silk",
    nameAr: "حرير ذهبي تراثي",
    slug: "golden-heritage-kaftan-silk",
    descriptionEn:
      "Warm ivory silk with traditional Khaleeji panels rendered in antique gold. Heritage pattern, lightweight drape, designed for everyday wearing into heirloom territory.",
    descriptionAr:
      "حرير عاجي دافئ مع لوحات خليجية تقليدية بالذهب العتيق. نمط تراثي، انسدال خفيف الوزن، مصمم للارتداء اليومي ليصبح إرثاً.",
    priceMode: "per_meter",
    pricePerMeter: 420,
    minOrderMeters: 2,
    sku: "LF-GHK-005",
    fabricType: "silk",
    fabricWeight: "110 GSM",
    fabricWidth: "145 cm",
    composition: "Silk blend · Gold metallic thread",
    careInstructions: "Dry clean only.",
    origin: "Embroidered in Dubai",
    isCustomizable: true,
    isFeatured: true,
    inStock: true,
    stockQuantity: 41,
    collection: "occasion",
    colorFamily: "gold",
    styledWith: ["2", "6", "4"],
    images: [{ id: "img-5-a", url: "/images/products/kaftan-golden-heritage.png", sortOrder: 0, isMain: true, alt: "Golden heritage kaftan silk" }],
    variants: [],
    tags: ["silk", "gold", "heritage", "khaleeji", "occasion"],
    createdAt: "2025-08-20",
    updatedAt: "2026-02-20",
  },
  {
    id: "6",
    nameEn: "White Gold Floral Net",
    nameAr: "شبك زهري أبيض ذهبي",
    slug: "white-gold-floral-net",
    descriptionEn:
      "Fine tulle net scattered with hand-embroidered gold botanicals. Best layered over solid silk. A versatile bridal base used across our custom commissions.",
    descriptionAr:
      "شبك تول ناعم متناثر بنباتات ذهبية مطرزة يدوياً. يفضل ارتداؤه فوق حرير سادة. قاعدة زفاف متعددة الاستخدامات نستخدمها في تصاميمنا المخصصة.",
    priceMode: "per_meter",
    pricePerMeter: 380,
    minOrderMeters: 2,
    sku: "LF-WGF-006",
    fabricType: "tulle",
    fabricWeight: "60 GSM",
    fabricWidth: "150 cm",
    composition: "Tulle net · Gold bullion embroidery",
    careInstructions: "Dry clean recommended.",
    origin: "Embroidered in Dubai",
    isCustomizable: true,
    isFeatured: true,
    inStock: true,
    stockQuantity: 46,
    collection: "bridal",
    colorFamily: "cream",
    styledWith: ["3", "2", "5"],
    images: [{ id: "img-6-a", url: "/images/products/kaftan-white-gold-floral.png", sortOrder: 0, isMain: true, alt: "White gold floral net kaftan" }],
    variants: [],
    tags: ["tulle", "net", "white", "gold", "bridal", "floral"],
    createdAt: "2024-11-01",
    updatedAt: "2026-02-15",
  },
  {
    id: "7",
    nameEn: "Blush Pink Crystal Organza",
    nameAr: "أورجانزا كريستال وردي",
    slug: "blush-pink-crystal-organza",
    descriptionEn:
      "Pale blush organza detailed with crystal seed beads and iridescent sequin clusters. Wing-sleeve drape. The softest expression of our Pink Salt palette.",
    descriptionAr:
      "أورجانزا وردية فاتحة مزينة بخرز كريستال صغير وعناقيد ترتر متلألئة. انسدال أكمام واسعة. أنعم تعبير عن لوحة الوردي الملحي لدينا.",
    priceMode: "per_meter",
    pricePerMeter: 545,
    compareAtPrice: 620,
    minOrderMeters: 2,
    sku: "LF-BPC-007",
    fabricType: "organza",
    fabricWeight: "70 GSM",
    fabricWidth: "150 cm",
    composition: "Silk organza · Crystal seed bead · Sequin",
    careInstructions: "Dry clean only. Handle with care.",
    origin: "Embroidered in Dubai",
    isCustomizable: false,
    isFeatured: true,
    isNew: true,
    inStock: true,
    stockQuantity: 28,
    collection: "occasion",
    colorFamily: "pink",
    styledWith: ["4", "3", "1"],
    images: [{ id: "img-7-a", url: "/images/products/kaftan-blush-pink-crystal.png", sortOrder: 0, isMain: true, alt: "Blush pink crystal organza kaftan" }],
    variants: [],
    tags: ["organza", "pink", "crystal", "blush", "occasion", "new"],
    createdAt: "2026-01-20",
    updatedAt: "2026-04-10",
  },
  // ─── Essentials (solid-dyed) ───
  {
    id: "8",
    nameEn: "Signature Silk Crêpe",
    nameAr: "كريب حرير كلاسيكي",
    slug: "signature-silk-crepe",
    descriptionEn:
      "Solid-dyed pure silk crêpe, woven in Como. Our core base cloth for bespoke commissions — takes embroidery, dye, and cut cleanly. Available in six house tones.",
    descriptionAr:
      "كريب حرير سادة مصبوغ، منسوج في كومو. قماشنا الأساسي للطلبات المخصصة — يقبل التطريز، الصبغ، والقص بدقة. متوفر بستة درجات من الألوان.",
    priceMode: "per_meter",
    pricePerMeter: 240,
    minOrderMeters: 3,
    sku: "LF-SSC-008",
    fabricType: "silk",
    fabricWeight: "110 GSM",
    fabricWidth: "140 cm",
    composition: "100% Silk crêpe",
    careInstructions: "Dry clean.",
    origin: "Woven in Como, Italy",
    certifications: ["OEKO-TEX Standard 100"],
    isCustomizable: true,
    isFeatured: false,
    inStock: true,
    stockQuantity: 120,
    collection: "essentials",
    colorFamily: "cream",
    styledWith: ["9", "10", "6"],
    images: [{ id: "img-8-a", url: "/images/products/kaftan-peach-blossom.png", sortOrder: 0, isMain: true, alt: "Signature silk crepe (essentials)" }],
    variants: [],
    tags: ["silk", "solid", "essentials", "base", "bespoke"],
    createdAt: "2024-03-10",
    updatedAt: "2026-01-10",
  },
  {
    id: "9",
    nameEn: "Pink Salt Cotton-Silk",
    nameAr: "قطن حرير وردي ملحي",
    slug: "pink-salt-cotton-silk",
    descriptionEn:
      "A quiet cotton-silk blend in our house Pink Salt. Cool-to-the-touch, breathable, and substantial — for abayas and unlined summer pieces.",
    descriptionAr:
      "مزيج هادئ من القطن والحرير بلون الوردي الملحي الخاص بنا. بارد الملمس، قابل للتنفس، ومتين — للعبايات والقطع الصيفية غير المبطنة.",
    priceMode: "per_meter",
    pricePerMeter: 195,
    minOrderMeters: 5,
    sku: "LF-PSC-009",
    fabricType: "cotton",
    fabricWeight: "95 GSM",
    fabricWidth: "150 cm",
    composition: "60% Egyptian cotton · 40% silk",
    careInstructions: "Hand wash cold. Lay flat to dry.",
    origin: "Woven in Cairo",
    certifications: ["GOTS"],
    isCustomizable: false,
    isFeatured: false,
    isNew: true,
    inStock: true,
    stockQuantity: 88,
    collection: "essentials",
    colorFamily: "pink",
    styledWith: ["8", "10", "7"],
    images: [{ id: "img-9-a", url: "/images/products/kaftan-blush-pink-crystal.png", sortOrder: 0, isMain: true, alt: "Pink salt cotton-silk blend (essentials)" }],
    variants: [],
    tags: ["cotton", "silk-blend", "pink", "essentials", "everyday", "new"],
    createdAt: "2026-02-01",
    updatedAt: "2026-04-01",
  },
  {
    id: "10",
    nameEn: "Espresso Linen",
    nameAr: "كتان إسبريسو",
    slug: "espresso-linen",
    descriptionEn:
      "Belgian linen dyed in deep espresso. Slub texture, hefty hand, falls in clean architectural folds — for structured abayas and heirloom table linens.",
    descriptionAr:
      "كتان بلجيكي مصبوغ بلون الإسبريسو العميق. ملمس غير منتظم، قبضة قوية، يتدلى في طيات معمارية نظيفة — للعبايات المهيكلة وأقمشة المائدة الموروثة.",
    priceMode: "per_meter",
    pricePerMeter: 180,
    minOrderMeters: 5,
    sku: "LF-EL-010",
    fabricType: "linen",
    fabricWeight: "200 GSM",
    fabricWidth: "150 cm",
    composition: "100% Belgian linen",
    careInstructions: "Machine wash cold. Line dry.",
    origin: "Woven in Belgium",
    certifications: ["European Flax"],
    isCustomizable: false,
    isFeatured: false,
    inStock: true,
    stockQuantity: 64,
    collection: "essentials",
    colorFamily: "neutral",
    styledWith: ["8", "9"],
    images: [{ id: "img-10-a", url: "/images/products/kaftan-burgundy-rose.png", sortOrder: 0, isMain: true, alt: "Espresso linen (essentials)" }],
    variants: [],
    tags: ["linen", "solid", "neutral", "espresso", "essentials", "everyday"],
    createdAt: "2024-05-20",
    updatedAt: "2025-12-10",
  },

  // ═══════════════════════════════════════════════════════════════════
  // MIKHWAR — finished occasion-wear, opening price 889 (was 999)
  // ═══════════════════════════════════════════════════════════════════
  ...buildMikhwars(),

  // ═══════════════════════════════════════════════════════════════════
  // JALABYA — everyday flowing pieces, price on request
  // ═══════════════════════════════════════════════════════════════════
  ...buildJalabyas(),
];

// ─── Mikhwar generator ──────────────────────────────────────────────────
// 22 finished pieces, all 889 / was 999 AED. Color/name variety so the catalog
// reads as a real curated drop, not a synthetic list.
function buildMikhwars(): Product[] {
  const M: Array<{ name: { en: string; ar: string }; descEn: string; descAr: string; color: Product["colorFamily"]; isFeatured?: boolean; isNew?: boolean }> = [
    { name: { en: "Pearl Cascade Mikhwar", ar: "مكوار شلال اللؤلؤ" }, descEn: "Ivory tulle with cascading pearl and silver bullion at the V-neck. Floor-length with bell sleeves.", descAr: "تول عاجي مع شلال من اللؤلؤ والتطريز الفضي عند الرقبة. طول الأرض بأكمام واسعة.", color: "cream", isFeatured: true, isNew: true },
    { name: { en: "Onyx Paisley Mikhwar", ar: "مكوار بيزلي أونيكس" }, descEn: "Deep black net layered with red and silver paisley embroidery. Long bell sleeves.", descAr: "شبك أسود عميق مطبق بتطريز بيزلي أحمر وفضي. أكمام واسعة طويلة.", color: "black", isFeatured: true },
    { name: { en: "Blush Crystal Mikhwar", ar: "مكوار كريستال وردي" }, descEn: "Soft blush net dense with crystal beadwork and silver-gold thread. Wing-sleeve drape.", descAr: "شبك وردي ناعم مكتنز بأعمال الكريستال والخيط الفضي الذهبي. انسدال أجنحة.", color: "pink", isFeatured: true },
    { name: { en: "Champagne Heritage Mikhwar", ar: "مكوار شامبين تراثي" }, descEn: "Champagne tulle with all-over heritage Khaleeji embroidery in antique gold.", descAr: "تول شامبين بتطريز خليجي تراثي شامل بالذهب العتيق.", color: "gold", isFeatured: true },
    { name: { en: "Ivory Bullion Mikhwar", ar: "مكوار عاجي معدني" }, descEn: "Ivory chiffon with a vertical bullion panel and pearl scatter. Wedding-ready.", descAr: "شيفون عاجي مع لوحة معدنية رأسية وتناثر اللؤلؤ. جاهز للأعراس.", color: "cream" },
    { name: { en: "Garnet Rose Mikhwar", ar: "مكوار وردة الجارنت" }, descEn: "Deep garnet net with hand-stitched rose vines and gold accents.", descAr: "شبك جارنت غامق مع كرمات الورود المخيطة يدوياً ولمسات ذهبية.", color: "burgundy", isFeatured: true },
    { name: { en: "Sapphire Bloom Mikhwar", ar: "مكوار زهر الياقوت" }, descEn: "Sapphire-blue tulle scattered with silver florals and pearl drops.", descAr: "تول أزرق ياقوتي متناثر بزهور فضية وقطرات لؤلؤ.", color: "blue" },
    { name: { en: "Crimson Dynasty Mikhwar", ar: "مكوار سلالة قرمزية" }, descEn: "Vivid crimson net richly worked with gold paisley and pearl edging.", descAr: "شبك قرمزي حيوي مزخرف بغنى ببيزلي ذهبي وحواف لؤلؤية.", color: "red", isFeatured: true },
    { name: { en: "Golden Lattice Mikhwar", ar: "مكوار شبكة ذهبية" }, descEn: "Champagne tulle with a golden trellis pattern and beadwork along the panel.", descAr: "تول شامبين بنمط شبكي ذهبي وأعمال خرز على اللوحة.", color: "gold" },
    { name: { en: "Pearl Court Mikhwar", ar: "مكوار بلاط اللؤلؤ" }, descEn: "Cream tulle with seed pearl medallion and scalloped silver borders.", descAr: "تول كريمي مع ميدالية لؤلؤية وحواف فضية مزخرفة.", color: "cream", isNew: true },
    { name: { en: "Emerald Vine Mikhwar", ar: "مكوار كرمة الزمرد" }, descEn: "Emerald-base net with silver and gold botanical embroidery, cascading sleeves.", descAr: "شبك بقاعدة زمردية بتطريز نباتي فضي وذهبي وأكمام متدفقة.", color: "green" },
    { name: { en: "Antique Silver Mikhwar", ar: "مكوار الفضة العتيقة" }, descEn: "Ivory chiffon with antique-silver scrollwork and pearl tassel detail.", descAr: "شيفون عاجي بتطريز فضي عتيق وتفاصيل شراشيب لؤلؤية.", color: "cream" },
    { name: { en: "Rose Gold Mikhwar", ar: "مكوار الذهب الوردي" }, descEn: "Soft pink chiffon with rose-gold thread and bead clusters at the bodice.", descAr: "شيفون وردي ناعم بخيوط ذهبية وردية وعناقيد خرز عند الصدر.", color: "pink", isNew: true },
    { name: { en: "Midnight Garden Mikhwar", ar: "مكوار حديقة منتصف الليل" }, descEn: "Black net with multicolour floral embroidery — pinks, golds, and seafoam green.", descAr: "شبك أسود بتطريز زهري متعدد الألوان — وردي، ذهبي، وأخضر بحري.", color: "black" },
    { name: { en: "Saffron Court Mikhwar", ar: "مكوار بلاط الزعفران" }, descEn: "Warm saffron tulle with antique-gold heritage panel down the centre.", descAr: "تول زعفراني دافئ بلوحة تراثية ذهبية عتيقة في المنتصف.", color: "gold" },
    { name: { en: "Ivory Crown Mikhwar", ar: "مكوار التاج العاجي" }, descEn: "Ivory chiffon with a tall crown-shaped pearl panel and bell sleeves.", descAr: "شيفون عاجي بلوحة لؤلؤية على شكل تاج طويل وأكمام واسعة.", color: "cream", isFeatured: true },
    { name: { en: "Wine & Gold Mikhwar", ar: "مكوار العنب والذهب" }, descEn: "Wine-dark net richly worked with gold and pearl, hem-trail embroidery.", descAr: "شبك بلون النبيذ الغامق بتطريز ذهبي ولؤلؤي غني وذيل مطرز.", color: "burgundy" },
    { name: { en: "Powder Pink Mikhwar", ar: "مكوار الوردي الناعم" }, descEn: "Powder-pink chiffon with crystal scatter and pearl-edge sleeve cuffs.", descAr: "شيفون بلون الوردي الناعم بتناثر كريستالي وحواف لؤلؤية للأكمام.", color: "pink" },
    { name: { en: "Royal Indigo Mikhwar", ar: "مكوار النيلي الملكي" }, descEn: "Indigo-blue net with silver foliage and turquoise bead accents.", descAr: "شبك أزرق نيلي بأوراق فضية ولمسات خرز تركوازي.", color: "blue", isNew: true },
    { name: { en: "Golden Dawn Mikhwar", ar: "مكوار فجر ذهبي" }, descEn: "Sunlit champagne tulle with light-catching sequin work across the bodice.", descAr: "تول شامبين مضاء بأعمال ترتر تلتقط الضوء عبر الصدر.", color: "gold" },
    { name: { en: "Pearl Midnight Mikhwar", ar: "مكوار لؤلؤة منتصف الليل" }, descEn: "Black net with all-over silver and pearl embroidery — light against dark.", descAr: "شبك أسود بتطريز فضي ولؤلؤي شامل — ضوء على خلفية داكنة.", color: "black" },
    { name: { en: "Heritage Cream Mikhwar", ar: "مكوار كريم تراثي" }, descEn: "Cream net with traditional Khaleeji panel and gold leaf detailing throughout.", descAr: "شبك كريمي بلوحة خليجية تقليدية وتفاصيل ورق ذهبي في كل مكان.", color: "cream", isFeatured: true },
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
      sku: `LF-MK-${num}`,
      fabricType: "tulle",
      composition: "Net base · Hand-embroidered bullion, beads, and pearls",
      careInstructions: "Dry clean only. Store flat.",
      origin: "Embroidered in Abu Dhabi",
      isCustomizable: false,
      isFeatured: !!m.isFeatured,
      isNew: m.isNew,
      inStock: true,
      stockQuantity: 1,
      collection: "mikhwar",
      colorFamily: m.color,
      images: [
        { id: `m-${num}-a`, url: `/images/products/garments/mikhwars/mikhwar-${num}.png`, sortOrder: 0, isMain: true, alt: `${m.name.en} — front view` },
      ],
      variants: [],
      tags: ["mikhwar", "occasion", "ready-to-wear", m.color],
      createdAt: "2026-04-26",
      updatedAt: "2026-04-26",
    };
  });
}

// ─── Jalabya generator ────────────────────────────────────────────────
// 10 everyday pieces, price on request — inquire on WhatsApp.
function buildJalabyas(): Product[] {
  const J: Array<{ name: { en: string; ar: string }; descEn: string; descAr: string; color: Product["colorFamily"]; isFeatured?: boolean; isNew?: boolean }> = [
    { name: { en: "Sky Blue Floral Jalabya", ar: "جلابية زرقاء سماوية بزخارف زهرية" }, descEn: "Sky-blue printed jalabya with a floral motif, scalloped lace neckline, and hand-tied tassel.", descAr: "جلابية مطبوعة باللون الأزرق السماوي بزخرفة زهرية ورقبة دانتيل ومزخرفة بشرابة.", color: "blue", isFeatured: true, isNew: true },
    { name: { en: "Ivory Lavender Jalabya", ar: "جلابية عاجية لافندر" }, descEn: "Cream cotton with soft lavender motifs and lace bib detail at the neckline.", descAr: "قطن كريمي بزخارف لافندر ناعمة وتفصيل دانتيل عند الرقبة.", color: "neutral" },
    { name: { en: "Garden Rose Jalabya", ar: "جلابية وردة الحديقة" }, descEn: "Vivid floral print on a deep teal base with painterly rose blooms.", descAr: "طباعة زهرية حيوية على قاعدة لون البحر الغامق مع زهور ورد فنية.", color: "green", isFeatured: true },
    { name: { en: "Mauve Damask Jalabya", ar: "جلابية دمشقية بنفسجية" }, descEn: "Soft mauve damask print with intricate medallion neckline detail.", descAr: "طباعة دمشقية بنفسجية ناعمة مع تفصيل ميدالية معقد عند الرقبة.", color: "pink" },
    { name: { en: "Crimson Paisley Jalabya", ar: "جلابية بيزلي قرمزية" }, descEn: "Classic crimson paisley print, lace neckline, lightweight summer drape.", descAr: "طباعة بيزلي قرمزية كلاسيكية، رقبة دانتيل، انسدال صيفي خفيف.", color: "red", isNew: true },
    { name: { en: "Verdant Bloom Jalabya", ar: "جلابية إزدهار أخضر" }, descEn: "Forest green base with painterly tropical florals and gold accent piping.", descAr: "قاعدة خضراء غابية مع زهور استوائية فنية وحواف ذهبية.", color: "green", isFeatured: true },
    { name: { en: "Saffron Sunset Jalabya", ar: "جلابية غروب الزعفران" }, descEn: "Warm saffron and ochre print with abstract botanical motif and lace bib.", descAr: "طباعة دافئة بالزعفران والمغرة بزخرفة نباتية تجريدية وصدرية دانتيل.", color: "gold" },
    { name: { en: "Coral Bouquet Jalabya", ar: "جلابية باقة المرجان" }, descEn: "Coral and ivory bouquet print, scalloped lace neckline, soft full sleeves.", descAr: "طباعة باقة مرجانية وعاجية، رقبة دانتيل مزخرفة، أكمام كاملة ناعمة.", color: "pink" },
    { name: { en: "Cobalt Wildflower Jalabya", ar: "جلابية الزهور البرية الكوبالتية" }, descEn: "Cobalt-blue base scattered with delicate wildflowers and gold edging.", descAr: "قاعدة زرقاء كوبالتية متناثرة بأزهار برية رقيقة وحواف ذهبية.", color: "blue" },
    { name: { en: "Heritage Brick Jalabya", ar: "جلابية الطوب التراثي" }, descEn: "Brick-red and amber heritage print with paisley motif and lace neckline.", descAr: "طباعة تراثية بلون الطوب الأحمر والكهرماني بزخرفة بيزلي ورقبة دانتيل.", color: "red" },
  ];

  return J.map((j, idx): Product => {
    const num = String(idx + 1).padStart(2, "0");
    const slug = j.name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: `j-${num}`,
      nameEn: j.name.en,
      nameAr: j.name.ar,
      slug,
      descriptionEn: j.descEn,
      descriptionAr: j.descAr,
      priceMode: "on_request",
      sku: `LF-JL-${num}`,
      fabricType: "cotton",
      composition: "Cotton-silk blend · Printed",
      careInstructions: "Hand wash cold. Line dry.",
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
