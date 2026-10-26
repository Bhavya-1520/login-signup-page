// Recommendation & search helpers
// Uses smart relevance scoring (lightweight ML-style ranking)

import { Product } from "./products";

// Track viewed products in localStorage
export function trackProductView(productId: string, category: string) {
  if (typeof window === "undefined") return;
  try {
    const viewed = JSON.parse(localStorage.getItem("viewedProducts") || "[]");
    // Remove if already exists, add to front
    const filtered = viewed.filter((v: any) => v.id !== productId);
    filtered.unshift({ id: productId, category, viewedAt: Date.now() });
    // Keep last 20
    localStorage.setItem("viewedProducts", JSON.stringify(filtered.slice(0, 20)));
  } catch {}
}

export function getViewedProducts(): { id: string; category: string; viewedAt: number }[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("viewedProducts") || "[]");
  } catch {
    return [];
  }
}

// Get recommended products based on viewing history
export function getRecommendations(allProducts: Product[], currentProductId?: string): Product[] {
  const viewed = getViewedProducts();
  if (viewed.length === 0) return [];

  // Score each product by how many times its category was viewed
  const categoryScores: Record<string, number> = {};
  viewed.forEach((v, index) => {
    // More recent views get higher weight
    const weight = 1 / (index + 1);
    categoryScores[v.category] = (categoryScores[v.category] || 0) + weight;
  });

  // Rank products by category score, excluding current & already viewed
  const viewedIds = new Set(viewed.map((v) => v.id));

  return allProducts
    .filter((p) => p.id !== currentProductId)
    .map((p) => ({
      product: p,
      score: (categoryScores[p.category] || 0) + (viewedIds.has(p.id) ? -0.5 : 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.product);
}

// Get related products (same category)
export function getRelatedProducts(allProducts: Product[], product: Product): Product[] {
  return allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
}

// Smart search with relevance scoring
// Synonyms / extra keywords so natural words map to the right products.
// Keyed by a word the customer might type/say; value = keywords that, if present
// in a product's name/category/group, should match.
const SEARCH_SYNONYMS: Record<string, string[]> = {
  horse: ["horse", "rakhi", "raksha"],
  horses: ["horse", "rakhi"],
  rakhi: ["rakhi", "horse", "raksha", "combo"],
  raksha: ["rakhi", "horse", "raksha"],
  combo: ["combo", "horse", "letter"],
  letter: ["combo", "letter", "horse"],
  flower: ["bouquet", "flower", "rose", "sunflower", "pipe"],
  flowers: ["bouquet", "flower", "rose", "sunflower", "pipe"],
  bouquet: ["bouquet", "flower", "rose", "sunflower"],
  boquet: ["bouquet", "flower", "rose"],
  rose: ["rose", "satin", "bouquet"],
  satin: ["satin", "ribbon", "rose"],
  sunflower: ["sunflower", "bouquet"],
  pipe: ["pipe", "cleaner", "bouquet"],
  mug: ["cup", "coffee", "mug"],
  cup: ["cup", "coffee", "magic", "mug"],
  coffee: ["coffee", "cup", "mug"],
  magic: ["magic", "cup"],
  bangle: ["resin", "bangle"],
  bangles: ["resin", "bangle"],
  resin: ["resin", "bangle"],
  magnet: ["magnet", "fridge"],
  magnets: ["magnet", "fridge"],
  card: ["card", "birthday"],
  hamper: ["hamper", "birthday"],
  magazine: ["magazine"],
  birthday: ["birthday", "card", "hamper", "magazine"],
  photo: ["portrait", "photo", "magazine"],
  portrait: ["portrait", "photo"],
  gift: ["gift", "hamper", "card", "cup", "combo"],
  gifts: ["gift", "hamper", "card", "cup"],
};

// Build the searchable text blob for a product (name + category + group + desc + keywords)
function productText(p: any): string {
  return [p.name, p.category, p.group, p.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// Smart, forgiving search: tokenizes the query, applies synonyms, and matches
// partial words so "horse", "flower", "mug", "rakhi" etc. all find products.
export function searchProducts(allProducts: Product[], query: string): Product[] {
  if (!query.trim()) return [];

  const raw = query.toLowerCase().trim();
  // Split into words, drop tiny filler words
  const words = raw
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 2 && !["the", "and", "for", "a", "an", "of", "in", "my"].includes(w));

  if (words.length === 0) words.push(raw);

  return allProducts
    .map((p) => {
      const text = productText(p);
      const name = p.name.toLowerCase();
      let score = 0;

      // Whole-query boosts
      if (name === raw) score += 100;
      else if (name.startsWith(raw)) score += 50;
      else if (name.includes(raw)) score += 30;

      // Per-word matching (partial / contains)
      for (const w of words) {
        if (name.includes(w)) score += 20;
        else if (text.includes(w)) score += 10;

        // Synonym expansion — match related keywords in the product text
        const syns = SEARCH_SYNONYMS[w];
        if (syns && syns.some((s) => text.includes(s))) score += 15;

        // Loose match: word is a prefix of any word in the text
        if (text.split(/\s+/).some((t) => t.startsWith(w))) score += 8;
      }

      return { product: p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
}
