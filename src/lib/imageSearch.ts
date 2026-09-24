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
      // Use the full-accuracy model (alpha 1.0) so labels are far more reliable.
      // It is a bit larger, but classification quality matters most here.
      return mobilenet.load({ version: 2, alpha: 1.0 });
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

// MobileNet returns specific ImageNet class names. We map a broad set of those
// (and general words) to our product groups so real photos classify correctly.
const keywordToGroup: { keywords: string[]; group: string }[] = [
  {
    group: "Bouquets",
    keywords: [
      "flower", "bouquet", "vase", "daisy", "sunflower", "rose", "petal", "pot", "plant",
      "bloom", "blossom", "hip", "rosehip", "yellow lady's slipper", "picket fence",
      "corn", "cardoon", "buckeye", "bee", "greenhouse", "florist", "arrangement",
    ],
  },
  {
    group: "Rakhi",
    keywords: [
      "horse", "pony", "stallion", "sorrel", "arabian", "hobby", "rocking horse", "toyshop",
      "toy", "figurine", "carousel", "merry-go-round", "unicorn", "colt", "mare",
      "dalmatian", "zebra", "camel",
    ],
  },
  {
    group: "Resin",
    keywords: [
      "bangle", "bracelet", "ring", "jewelry", "jewellery", "necklace", "gem", "resin",
      "bead", "chain", "hoopskirt", "buckle", "prayer", "rosary", "pendant", "loupe",
    ],
  },
  {
    group: "Birthday",
    keywords: [
      "book", "magazine", "envelope", "card", "paper", "gift", "box", "basket", "hamper",
      "magnet", "packet", "carton", "wrapping", "birthday", "cake", "candle", "notebook",
      "binder", "menu", "comic", "photograph", "picture frame", "refrigerator", "mug",
      "coffee mug", "cup", "chocolate",
    ],
  },
];

export interface ImageSearchResult {
  group: string | null;
  labels: string[];
  matchedProducts: typeof products;
}

export async function searchByImage(imgElement: HTMLImageElement): Promise<ImageSearchResult> {
  // Load model with a 20s timeout so it never hangs forever
  const model = await withTimeout(loadModel(), 20000);
  const predictions: { className: string; probability: number }[] =
    await withTimeout(model.classify(imgElement, 10), 12000);

  const labels = predictions.map((p) => p.className);

  // Score each group by how strongly its keywords match the predictions.
  // Each MobileNet label may be comma-separated (e.g. "sorrel, horse").
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
    : // No confident group match — show everything so the customer still gets
      // browsable results instead of a dead-end "no results" screen.
      products;

  return {
    group: bestGroup,
    labels,
    matchedProducts,
  };
}
