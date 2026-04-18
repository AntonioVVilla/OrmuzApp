import {
  formatDistance,
  formatMarkerPrice,
  formatPrice,
} from '../../src/utils/formatPrice';

describe('formatPrice', () => {
  it('formats to 3 decimals and appends €', () => {
    expect(formatPrice(1.459)).toBe('1.459 €');
    expect(formatPrice(1)).toBe('1.000 €');
  });
});

describe('formatMarkerPrice', () => {
  it('formats to 3 decimals without unit', () => {
    expect(formatMarkerPrice(1.459)).toBe('1.459');
  });
});

describe('formatDistance', () => {
  it('renders metres under 1 km', () => {
    expect(formatDistance(0.25)).toBe('250 m');
    expect(formatDistance(0.999)).toBe('999 m');
  });

  it('renders km with one decimal above 1 km', () => {
    expect(formatDistance(1)).toBe('1.0 km');
    expect(formatDistance(12.345)).toBe('12.3 km');
  });
});
