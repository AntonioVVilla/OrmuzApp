export interface PriceColorOptions {
  // Use a colour-blind friendly viridis-style palette instead of the
  // default green→yellow→red gradient. Off by default.
  colorblindSafe?: boolean;
}

// Discrete viridis anchors at t = 0, 0.25, 0.5, 0.75, 1. Good perceptual
// uniformity + distinguishable under deutan/protan/tritan simulations.
const VIRIDIS_STOPS: ReadonlyArray<readonly [number, number, number]> = [
  [68, 1, 84],
  [59, 82, 139],
  [33, 145, 140],
  [94, 201, 98],
  [253, 231, 37],
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function viridis(t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * (VIRIDIS_STOPS.length - 1);
  const idx = Math.min(Math.floor(scaled), VIRIDIS_STOPS.length - 2);
  const local = scaled - idx;
  const a = VIRIDIS_STOPS[idx]!;
  const b = VIRIDIS_STOPS[idx + 1]!;
  const r = Math.round(lerp(a[0], b[0], local));
  const g = Math.round(lerp(a[1], b[1], local));
  const bl = Math.round(lerp(a[2], b[2], local));
  return rgbToHex(r, g, bl);
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Map a price onto the [min, max] range and return a colour for it.
 * Default palette: green (cheap) → yellow → red (expensive).
 * With `colorblindSafe: true`: viridis (purple → teal → yellow).
 */
export function priceToColor(
  price: number,
  minPrice: number,
  maxPrice: number,
  options: PriceColorOptions = {},
): string {
  if (maxPrice === minPrice) {
    return options.colorblindSafe ? viridis(0) : '#4CAF50';
  }
  const t = Math.max(
    0,
    Math.min(1, (price - minPrice) / (maxPrice - minPrice)),
  );
  if (options.colorblindSafe) {
    return viridis(t);
  }
  const hue = 120 * (1 - t);
  return hslToHex(hue, 80, 45);
}

/**
 * Returns 1 (cheap), 2 (mid) or 3 (expensive). Intended as a
 * redundant, non-colour indicator (rendered as € signs in the UI).
 */
export function priceBucket(
  price: number,
  minPrice: number,
  maxPrice: number,
): 1 | 2 | 3 {
  if (maxPrice === minPrice) {
    return 1;
  }
  const t = (price - minPrice) / (maxPrice - minPrice);
  if (t < 1 / 3) {
    return 1;
  }
  if (t < 2 / 3) {
    return 2;
  }
  return 3;
}

/**
 * Returns '€', '€€' or '€€€' based on price bucket, to complement
 * colour coding for users who can't perceive it.
 */
export function priceBucketLabel(bucket: 1 | 2 | 3): string {
  return '€'.repeat(bucket);
}

/**
 * Returns the text color (black or white) for best contrast on the
 * supplied background hex. Uses perceived luminance (not sRGB gamma).
 */
export function contrastTextColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
