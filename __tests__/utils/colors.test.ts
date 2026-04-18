import {
  contrastTextColor,
  priceBucket,
  priceBucketLabel,
  priceToColor,
} from '../../src/utils/colors';

describe('priceToColor', () => {
  it('returns green when min === max (default palette)', () => {
    expect(priceToColor(1.5, 1.5, 1.5)).toBe('#4CAF50');
  });

  it('returns viridis[0] when min === max and colorblindSafe is true', () => {
    const color = priceToColor(1.5, 1.5, 1.5, {colorblindSafe: true});
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('returns green-ish for the cheapest price', () => {
    const color = priceToColor(1.0, 1.0, 2.0);
    // hue=120 (green) in our HSL palette → green-dominant RGB
    const g = parseInt(color.slice(3, 5), 16);
    const r = parseInt(color.slice(1, 3), 16);
    expect(g).toBeGreaterThan(r);
  });

  it('returns red-ish for the most expensive price', () => {
    const color = priceToColor(2.0, 1.0, 2.0);
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    expect(r).toBeGreaterThan(g);
  });

  it('clamps prices below min and above max', () => {
    const cheapest = priceToColor(1.0, 1.0, 2.0);
    expect(priceToColor(0.5, 1.0, 2.0)).toBe(cheapest);
    const mostExpensive = priceToColor(2.0, 1.0, 2.0);
    expect(priceToColor(3.0, 1.0, 2.0)).toBe(mostExpensive);
  });
});

describe('priceBucket', () => {
  it('returns 1 for equal min/max', () => {
    expect(priceBucket(1.5, 1.5, 1.5)).toBe(1);
  });

  it('buckets correctly across the range', () => {
    expect(priceBucket(1.0, 1.0, 2.0)).toBe(1);
    expect(priceBucket(1.4, 1.0, 2.0)).toBe(2);
    expect(priceBucket(1.8, 1.0, 2.0)).toBe(3);
  });
});

describe('priceBucketLabel', () => {
  it('returns N € signs for bucket N', () => {
    expect(priceBucketLabel(1)).toBe('€');
    expect(priceBucketLabel(2)).toBe('€€');
    expect(priceBucketLabel(3)).toBe('€€€');
  });
});

describe('contrastTextColor', () => {
  it('returns black on light backgrounds', () => {
    expect(contrastTextColor('#FFFFFF')).toBe('#000000');
    expect(contrastTextColor('#FFEB3B')).toBe('#000000');
  });

  it('returns white on dark backgrounds', () => {
    expect(contrastTextColor('#000000')).toBe('#FFFFFF');
    expect(contrastTextColor('#1A1A1A')).toBe('#FFFFFF');
  });
});
