import { Product, Category } from "@/types";

export const DEMO_CATEGORIES: Category[] = [
  { id: "cat-men", name: "Men", slug: "men", gender: "men", image: null, display_order: 1 },
  { id: "cat-women", name: "Women", slug: "women", gender: "women", image: null, display_order: 2 },
  { id: "cat-kids", name: "Kids", slug: "kids", gender: "kids", image: null, display_order: 3 },
  { id: "cat-accessories", name: "Accessories", slug: "accessories", gender: "unisex", image: null, display_order: 4 },
];

const now = new Date().toISOString();

export const DEMO_PRODUCTS: Product[] = [
  // ─── MEN ───────────────────────────────────────────────────────────────────
  {
    id: "men-1", name: "Classic Fit Polo Shirt", slug: "classic-fit-polo-shirt",
    description: "A timeless polo shirt crafted from breathable piqué cotton. Perfect for smart-casual occasions.",
    price: 299, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop",
    ],
    category_id: "cat-men", category: DEMO_CATEGORIES[0], gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"], colors: ["white", "navy", "#2ECC71"],
    stock: 24, featured: true, active: true, created_at: now,
  },
  {
    id: "men-2", name: "Slim Fit Chino Pants", slug: "slim-fit-chino-pants",
    description: "Versatile slim-fit chinos in stretch cotton. Goes from office to weekend with ease.",
    price: 449, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4c8e?w=600&h=800&fit=crop",
    ],
    category_id: "cat-men", category: DEMO_CATEGORIES[0], gender: "men",
    sizes: ["30", "32", "34", "36", "38"], colors: ["#8B7355", "black", "khaki"],
    stock: 18, featured: false, active: true, created_at: now,
  },
  {
    id: "men-3", name: "Graphic Print Hoodie", slug: "graphic-print-hoodie",
    description: "Street-ready heavyweight hoodie with bold graphic print. Fleece-lined for extra warmth.",
    price: 599, sale_price: 399,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&h=800&fit=crop",
    ],
    category_id: "cat-men", category: DEMO_CATEGORIES[0], gender: "men",
    sizes: ["S", "M", "L", "XL"], colors: ["black", "grey", "#0D1B2A"],
    stock: 12, featured: true, active: true, created_at: now,
  },
  {
    id: "men-4", name: "Cargo Shorts", slug: "cargo-shorts",
    description: "Practical cargo shorts with deep side pockets. Ideal for warm South African days.",
    price: 349, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&h=800&fit=crop",
    ],
    category_id: "cat-men", category: DEMO_CATEGORIES[0], gender: "men",
    sizes: ["S", "M", "L", "XL"], colors: ["khaki", "black", "olive"],
    stock: 20, featured: false, active: true, created_at: now,
  },
  {
    id: "men-5", name: "Formal Button-Down Shirt", slug: "formal-button-down-shirt",
    description: "Crisp long-sleeve formal shirt in wrinkle-resistant fabric. Office-ready and polished.",
    price: 499, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop",
    ],
    category_id: "cat-men", category: DEMO_CATEGORIES[0], gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"], colors: ["white", "light blue", "#2ECC71"],
    stock: 15, featured: false, active: true, created_at: now,
  },

  // ─── WOMEN ─────────────────────────────────────────────────────────────────
  {
    id: "women-1", name: "Floral Wrap Dress", slug: "floral-wrap-dress",
    description: "Elegant wrap dress in lightweight viscose with a bold floral print. Flattering on every shape.",
    price: 549, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
    ],
    category_id: "cat-women", category: DEMO_CATEGORIES[1], gender: "women",
    sizes: ["XS", "S", "M", "L", "XL"], colors: ["floral pink", "floral blue"],
    stock: 14, featured: true, active: true, created_at: now,
  },
  {
    id: "women-2", name: "High-Waist Denim Jeans", slug: "high-waist-denim-jeans",
    description: "Classic high-waist jeans in stretch denim. Sculpting fit with a vintage-inspired wash.",
    price: 599, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&h=800&fit=crop",
    ],
    category_id: "cat-women", category: DEMO_CATEGORIES[1], gender: "women",
    sizes: ["6", "8", "10", "12", "14"], colors: ["light blue", "dark blue", "black"],
    stock: 22, featured: true, active: true, created_at: now,
  },
  {
    id: "women-3", name: "Cropped Ribbed Tee", slug: "cropped-ribbed-tee",
    description: "Soft ribbed crop tee with a snug fit. Pairs perfectly with high-waist bottoms.",
    price: 249, sale_price: 179,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&h=800&fit=crop",
    ],
    category_id: "cat-women", category: DEMO_CATEGORIES[1], gender: "women",
    sizes: ["XS", "S", "M", "L"], colors: ["white", "black", "#2ECC71", "coral"],
    stock: 30, featured: false, active: true, created_at: now,
  },
  {
    id: "women-4", name: "Pleated Midi Skirt", slug: "pleated-midi-skirt",
    description: "Flowing pleated midi skirt in satin-finish fabric. Effortlessly elegant for any occasion.",
    price: 449, sale_price: 299,
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=800&fit=crop",
    ],
    category_id: "cat-women", category: DEMO_CATEGORIES[1], gender: "women",
    sizes: ["XS", "S", "M", "L", "XL"], colors: ["blush", "black", "forest green"],
    stock: 10, featured: false, active: true, created_at: now,
  },
  {
    id: "women-5", name: "Oversized Blazer", slug: "oversized-blazer",
    description: "Power-dressing oversized blazer with structured shoulders. Layer over anything for instant polish.",
    price: 799, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4c8e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=800&fit=crop",
    ],
    category_id: "cat-women", category: DEMO_CATEGORIES[1], gender: "women",
    sizes: ["XS", "S", "M", "L"], colors: ["camel", "black", "chalk white"],
    stock: 8, featured: true, active: true, created_at: now,
  },

  // ─── KIDS ──────────────────────────────────────────────────────────────────
  {
    id: "kids-1", name: "Cartoon Print Tee", slug: "cartoon-print-tee",
    description: "Fun and vibrant kids tee with cheerful cartoon print. 100% soft cotton for all-day comfort.",
    price: 149, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
    ],
    category_id: "cat-kids", category: DEMO_CATEGORIES[2], gender: "kids",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"], colors: ["yellow", "coral", "#2ECC71"],
    stock: 35, featured: false, active: true, created_at: now,
  },
  {
    id: "kids-2", name: "Denim Dungarees", slug: "denim-dungarees",
    description: "Classic denim dungarees with adjustable straps. Durable enough for the playground.",
    price: 299, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
    ],
    category_id: "cat-kids", category: DEMO_CATEGORIES[2], gender: "kids",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"], colors: ["light blue", "dark blue"],
    stock: 18, featured: true, active: true, created_at: now,
  },
  {
    id: "kids-3", name: "Tracksuit Set", slug: "kids-tracksuit-set",
    description: "Cosy zip-up tracksuit set with jogger bottoms. Perfect for school runs and weekend adventures.",
    price: 349, sale_price: 249,
    images: [
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&h=800&fit=crop",
    ],
    category_id: "cat-kids", category: DEMO_CATEGORIES[2], gender: "kids",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"], colors: ["grey", "navy", "black"],
    stock: 20, featured: true, active: true, created_at: now,
  },
  {
    id: "kids-4", name: "School Chino Shorts", slug: "school-chino-shorts",
    description: "Smart chino shorts suitable for school or casual wear. Easy-care fabric with an elastic waistband.",
    price: 199, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
    ],
    category_id: "cat-kids", category: DEMO_CATEGORIES[2], gender: "kids",
    sizes: ["5-6Y", "7-8Y", "9-10Y", "11-12Y"], colors: ["khaki", "navy", "black"],
    stock: 25, featured: false, active: true, created_at: now,
  },
  {
    id: "kids-5", name: "Printed Zip Hoodie", slug: "kids-printed-zip-hoodie",
    description: "Bright and bold zip-up hoodie with fun all-over print. Fleece lining for cool evenings.",
    price: 279, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&h=800&fit=crop",
    ],
    category_id: "cat-kids", category: DEMO_CATEGORIES[2], gender: "kids",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"], colors: ["#2ECC71", "orange", "purple"],
    stock: 16, featured: false, active: true, created_at: now,
  },

  // ─── ACCESSORIES ───────────────────────────────────────────────────────────
  {
    id: "acc-1", name: "Premium Leather Belt", slug: "premium-leather-belt",
    description: "Full-grain leather belt with a brushed-silver buckle. A wardrobe essential for men and women.",
    price: 199, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
    ],
    category_id: "cat-accessories", category: DEMO_CATEGORIES[3], gender: "unisex",
    sizes: ["S/M", "L/XL"], colors: ["black", "brown", "tan"],
    stock: 30, featured: false, active: true, created_at: now,
  },
  {
    id: "acc-2", name: "Structured Baseball Cap", slug: "structured-baseball-cap",
    description: "Six-panel structured cap with embroidered MBS logo. Adjustable strap fits all sizes.",
    price: 149, sale_price: 99,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=800&fit=crop",
    ],
    category_id: "cat-accessories", category: DEMO_CATEGORIES[3], gender: "unisex",
    sizes: ["One Size"], colors: ["black", "#0D1B2A", "white", "#2ECC71"],
    stock: 40, featured: true, active: true, created_at: now,
  },
  {
    id: "acc-3", name: "Woven Bucket Hat", slug: "woven-bucket-hat",
    description: "On-trend bucket hat in woven cotton with a wide brim. UV-protective for sunny SA days.",
    price: 179, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=800&fit=crop",
    ],
    category_id: "cat-accessories", category: DEMO_CATEGORIES[3], gender: "unisex",
    sizes: ["One Size"], colors: ["natural", "black", "sage"],
    stock: 22, featured: false, active: true, created_at: now,
  },
  {
    id: "acc-4", name: "Canvas Tote Bag", slug: "canvas-tote-bag",
    description: "Heavy-duty canvas tote with zip closure and inner pocket. Spacious enough for everyday use.",
    price: 249, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
    ],
    category_id: "cat-accessories", category: DEMO_CATEGORIES[3], gender: "unisex",
    sizes: ["One Size"], colors: ["natural", "black", "#0D1B2A"],
    stock: 28, featured: true, active: true, created_at: now,
  },
  {
    id: "acc-5", name: "Ribbed Knit Beanie", slug: "ribbed-knit-beanie",
    description: "Soft ribbed beanie in a warm acrylic blend. A must-have for Highveld winter mornings.",
    price: 129, sale_price: null,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1510598155929-05cf9e025e79?w=600&h=800&fit=crop",
    ],
    category_id: "cat-accessories", category: DEMO_CATEGORIES[3], gender: "unisex",
    sizes: ["One Size"], colors: ["black", "grey", "#2ECC71", "camel"],
    stock: 35, featured: false, active: true, created_at: now,
  },
];

export function getDemoProductsByGender(gender: string): Product[] {
  return DEMO_PRODUCTS.filter((p) => p.gender === gender);
}

export function getDemoFeaturedProducts(): Product[] {
  return DEMO_PRODUCTS.filter((p) => p.featured);
}

export function getDemoProductBySlug(slug: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export function getDemoRelatedProducts(product: Product): Product[] {
  return DEMO_PRODUCTS.filter((p) => p.gender === product.gender && p.id !== product.id).slice(0, 4);
}
