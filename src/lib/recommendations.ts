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
export function searchProducts(allProducts: Product[], query: string): Product[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();

  return allProducts
    .map((p) => {
      let score = 0;
      const name = p.name.toLowerCase();
      const category = p.category.toLowerCase();
      const desc = p.description.toLowerCase();

      // Exact name match
      if (name === q) score += 100;
      // Name starts with query
      else if (name.startsWith(q)) score += 50;
      // Name contains query
      else if (name.includes(q)) score += 30;
      // Category matches
      if (category.includes(q)) score += 20;
      // Word in name starts with query
      if (name.split(" ").some((word) => word.startsWith(q))) score += 15;
      // Description contains query
      if (desc.includes(q)) score += 5;

      return { product: p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
}
