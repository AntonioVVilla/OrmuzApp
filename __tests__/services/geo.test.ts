import {filterByProximity, haversine} from '../../src/services/geo';
import {Station} from '../../src/types/station';

function station(id: string, lat: number, lng: number): Station {
  return {
    id,
    name: `Station ${id}`,
    address: '',
    city: '',
    province: '',
    postalCode: '',
    latitude: lat,
    longitude: lng,
    schedule: '',
    prices: [],
  };
}

describe('haversine', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversine(40, -3, 40, -3)).toBe(0);
  });

  it('approximates the Madrid↔Barcelona great-circle distance', () => {
    // ~504 km — tolerate a small rounding error
    const d = haversine(40.4168, -3.7038, 41.3851, 2.1734);
    expect(d).toBeGreaterThan(490);
    expect(d).toBeLessThan(520);
  });
});

describe('filterByProximity', () => {
  const madrid = {latitude: 40.4168, longitude: -3.7038};

  it('returns only stations within radiusKm', () => {
    const stations = [
      station('near', 40.42, -3.7),
      station('far', 41.38, 2.17), // Barcelona, ~504 km away
    ];
    const result = filterByProximity(stations, madrid, 20, 50);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('near');
  });

  it('sorts by ascending distance', () => {
    const stations = [
      station('b', 40.45, -3.73),
      station('a', 40.42, -3.7),
    ];
    const result = filterByProximity(stations, madrid, 20, 50);
    expect(result.map(s => s.id)).toEqual(['a', 'b']);
  });

  it('caps results at maxResults', () => {
    const stations = Array.from({length: 200}, (_, i) =>
      station(String(i), 40.4168 + i * 0.0001, -3.7038),
    );
    const result = filterByProximity(stations, madrid, 20, 100);
    expect(result).toHaveLength(100);
  });

  it('attaches distance to each returned station', () => {
    const stations = [station('x', 40.42, -3.7)];
    const [result] = filterByProximity(stations, madrid, 20, 50);
    expect(result!.distance).toBeDefined();
    expect(result!.distance).toBeGreaterThan(0);
  });
});
