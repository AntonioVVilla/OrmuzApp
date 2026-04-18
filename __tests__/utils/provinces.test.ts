import {PROVINCES, getProvinceId} from '../../src/utils/provinces';

describe('PROVINCES', () => {
  it('covers the 52 Spanish provinces (50 + Ceuta + Melilla)', () => {
    expect(PROVINCES).toHaveLength(52);
  });

  it('has unique IDs', () => {
    const ids = new Set(PROVINCES.map(p => p.id));
    expect(ids.size).toBe(PROVINCES.length);
  });
});

describe('getProvinceId', () => {
  it('maps Madrid center → 28', () => {
    expect(getProvinceId(40.4168, -3.7038)).toBe('28');
  });

  it('maps Barcelona → 08', () => {
    expect(getProvinceId(41.3851, 2.1734)).toBe('08');
  });

  it('maps Las Palmas → 35 (Canary Islands)', () => {
    // Las Palmas de Gran Canaria is 28.124, -15.43
    expect(getProvinceId(28.1235, -15.4363)).toBe('35');
  });

  it('maps Ceuta → 51', () => {
    expect(getProvinceId(35.8894, -5.3198)).toBe('51');
  });

  it('maps Melilla → 52', () => {
    expect(getProvinceId(35.2923, -2.9381)).toBe('52');
  });

  it('falls back to nearest for sea coordinates', () => {
    // Middle of the Atlantic — just verify it returns *some* valid id
    const id = getProvinceId(40, -30);
    expect(PROVINCES.some(p => p.id === id)).toBe(true);
  });
});
