// ---------------------------------------------------------------------------
// DTDC shipping charges — based on ZONE (from pincode), WEIGHT, and SPEED.
//
// HOW TO UPDATE WITH DTDC'S REAL RATES:
//   1. Put the correct prices in ZONE_RATES below (one block per zone).
//   2. Each zone has `normal` and `express`, and within each:
//        base    = price for the first slab (up to `baseWeightGrams`)
//        addl    = price for each additional `stepGrams` after the base slab
//   3. Add any special-destination pincode prefixes to SPECIAL_PREFIXES.
//   4. Adjust the pincode→zone rules in detectZone() if DTDC's zoning differs.
// ---------------------------------------------------------------------------

export type ShippingSpeed = "normal" | "express";

export type ZoneKey =
  | "bangalore"
  | "karnataka"
  | "south"
  | "metro"
  | "rest"
  | "special";

export const ZONE_LABELS: Record<ZoneKey, string> = {
  bangalore: "Within Bangalore",
  karnataka: "Within Karnataka",
  south: "South / Zonal",
  metro: "Metro (Delhi, Mumbai, Kolkata)",
  rest: "Rest of India",
  special: "Special Destination",
};

interface SpeedRate {
  base: number; // charge for the first slab (up to baseWeightGrams)
  addl: number; // charge per additional stepGrams beyond the base slab
}

interface ZoneRate {
  baseWeightGrams: number; // first slab weight, e.g. 500g
  stepGrams: number; // additional slab size, e.g. 500g
  normal: SpeedRate;
  express: SpeedRate;
}

// EDIT THESE with DTDC's actual numbers. Values here are placeholders.
const ZONE_RATES: Record<ZoneKey, ZoneRate> = {
  bangalore: {
    baseWeightGrams: 500,
    stepGrams: 500,
    normal: { base: 40, addl: 20 },
    express: { base: 70, addl: 35 },
  },
  karnataka: {
    baseWeightGrams: 500,
    stepGrams: 500,
    normal: { base: 55, addl: 25 },
    express: { base: 90, addl: 45 },
  },
  south: {
    baseWeightGrams: 500,
    stepGrams: 500,
    normal: { base: 70, addl: 35 },
    express: { base: 110, addl: 55 },
  },
  metro: {
    baseWeightGrams: 500,
    stepGrams: 500,
    normal: { base: 85, addl: 40 },
    express: { base: 130, addl: 65 },
  },
  rest: {
    baseWeightGrams: 500,
    stepGrams: 500,
    normal: { base: 95, addl: 45 },
    express: { base: 150, addl: 75 },
  },
  special: {
    baseWeightGrams: 500,
    stepGrams: 500,
    normal: { base: 140, addl: 70 },
    express: { base: 200, addl: 100 },
  },
};

// Special-destination pincode PREFIXES (J&K, North-East, remote islands, etc.).
// Add/remove prefixes as per DTDC's special-destination list.
const SPECIAL_PREFIXES = [
  "18", "19", // Jammu & Kashmir, Ladakh
  "79", // most of North-East (Assam, Arunachal, Nagaland, Manipur, Mizoram, Tripura)
  "737", "744", // Sikkim, Andaman & Nicobar
];

// Bangalore city pincode prefixes
const BANGALORE_PREFIXES = ["560", "562", "561"];

// Determine the shipping zone from a pincode.
export function detectZone(pincode: string): ZoneKey {
  const p = (pincode || "").trim();
  const d2 = p.slice(0, 2);
  const d3 = p.slice(0, 3);

  // Special destinations first (they may overlap other ranges)
  if (SPECIAL_PREFIXES.some((pref) => p.startsWith(pref))) return "special";

  // Within Bangalore
  if (BANGALORE_PREFIXES.some((pref) => p.startsWith(pref))) return "bangalore";

  // Rest of Karnataka: 56x (non-Bangalore), 57x, 58x, 59x
  if (["56", "57", "58", "59"].includes(d2)) return "karnataka";

  // Metro cities
  if (d2 === "11") return "metro"; // Delhi
  if (d2 === "40") return "metro"; // Mumbai
  if (d2 === "70") return "metro"; // Kolkata

  // South / zonal: Andhra & Telangana (50-53), Tamil Nadu & Kerala & Puducherry (60-69)
  if (["50", "51", "52", "53"].includes(d2)) return "south";
  if (d2.startsWith("6")) return "south";

  // Everything else
  return "rest";
}

export interface ShippingResult {
  zone: ZoneKey;
  zoneLabel: string;
  speed: ShippingSpeed;
  weightGrams: number;
  charge: number;
}

// Compute the DTDC charge for a pincode + total weight (grams) + speed.
export function getShipping(
  pincode: string,
  weightGrams: number,
  speed: ShippingSpeed = "normal"
): ShippingResult {
  const zone = detectZone(pincode);
  const rate = ZONE_RATES[zone];
  const speedRate = rate[speed];

  const weight = Math.max(1, Math.ceil(weightGrams || 0));

  // First slab covered by base; extra weight billed per step (rounded up).
  let charge = speedRate.base;
  if (weight > rate.baseWeightGrams) {
    const extra = weight - rate.baseWeightGrams;
    const steps = Math.ceil(extra / rate.stepGrams);
    charge += steps * speedRate.addl;
  }

  return {
    zone,
    zoneLabel: ZONE_LABELS[zone],
    speed,
    weightGrams: weight,
    charge,
  };
}

// Default weight (grams) used when a product has no weight set.
export const DEFAULT_ITEM_WEIGHT_GRAMS = 500;
