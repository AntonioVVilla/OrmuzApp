import {StationArraySchema} from '../../src/schemas/station';

describe('StationArraySchema', () => {
  const validStation = {
    id: '123',
    name: 'Repsol',
    address: 'Gran Vía 1',
    city: 'Madrid',
    province: 'MADRID',
    postalCode: '28013',
    latitude: 40.4168,
    longitude: -3.7038,
    schedule: 'L-D: 24H',
    prices: [{fuelType: 'Gasolina 95', price: 1.5}],
  };

  it('accepts a valid station', () => {
    const result = StationArraySchema.safeParse([validStation]);
    expect(result.success).toBe(true);
  });

  it('rejects a missing required field', () => {
    const bad = {...validStation};
    delete (bad as {latitude?: number}).latitude;
    const result = StationArraySchema.safeParse([bad]);
    expect(result.success).toBe(false);
  });

  it('rejects negative prices', () => {
    const bad = {
      ...validStation,
      prices: [{fuelType: 'Gasolina 95', price: -1}],
    };
    const result = StationArraySchema.safeParse([bad]);
    expect(result.success).toBe(false);
  });

  it('rejects non-finite latitude', () => {
    const bad = {...validStation, latitude: NaN};
    const result = StationArraySchema.safeParse([bad]);
    expect(result.success).toBe(false);
  });
});
