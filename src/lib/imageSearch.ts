// Image-based product search using TensorFlow.js MobileNet (runs in browser)
// Classifies the uploaded image, then maps the AI labels to product groups.

import { products } from "./products";

let modelPromise: Promise<any> | null = null;

async function loadModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      const mobilenet = await import("@tensorflow-models/mobilenet");
      // Use the smaller/faster model version (0.25 width, 224 input)
      return mobilenet.load({ version: 1, alpha: 0.25 });
    })();
  }
  return modelPromise;
}

// Wrap a promise with a timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

// Keywords from MobileNet predictions mapped to our product groups
const keywordToGroup: { keywords: string[]; group: string }[] = [
  { keywords: ["flower", "bouquet", "vase", "daisy", "sunflower", "rose", "petal", "pot", "plant", "bloom"], group: "Bouquets" },
  { keywords: ["horse", "pony", "stallion", "toy", "figurine"], group: "Rakhi" },
  { keywords: ["bangle", "bracelet", "ring", "jewelry", "jewellery", "necklace", "gem", "resin"], group: "Resin" },
  { keywords: ["book", "magazine", "envelope", "card", "paper", "gift", "box", "basket", "hamper", "magnet"], group: "Birthday" },
];

export interface ImageSearchResult {
  group: string | null;
  labels: string[];
  matchedProducts: typeof products;
}

export async function searchByImage(imgElement: HTMLImageElement): Promise<ImageSearchResult> {
  // Load model with a 15s timeout so it never hangs forever
  const model = await withTimeout(loadModel(), 15000);
  const predictions: { className: string; probability: number }[] = await withTimeout(model.classify(imgElement, 5), 8000);

  const labels = predictions.map((p) => p.className.toLowerCase());

  // Score each group by how many prediction keywords match
  const groupScores: Record<string, number> = {};
  for (const pred of predictions) {
    const text = pred.className.toLowerCase();
    for (const mapping of keywordToGroup) {
      if (mapping.keywords.some((kw) => text.includes(kw))) {
        groupScores[mapping.group] = (groupScores[mapping.group] || 0) + pred.probability;
      }
    }
  }

  // Pick the best group
  let bestGroup: string | null = null;
  let bestScore = 0;
  for (const [group, score] of Object.entries(groupScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestGroup = group;
    }
  }

  const matchedProducts = bestGroup
    ? products.filter((p) => (p.group || p.category) === bestGroup)
    : [];

  return {
    group: bestGroup,
    labels: predictions.map((p) => p.className),
    matchedProducts,
  };
}
