import {
  parseAllStations,
  parseSpanishDecimal,
  parseStation,
} from '../../src/services/parser';

describe('parseSpanishDecimal', () => {
  it('converts comma decimal to number', () => {
    expect(parseSpanishDecimal('1,459')).toBeCloseTo(1.459);
  });

  it('handles integer strings', () => {
    expect(parseSpanishDecimal('42')).toBe(42);
  });

  it('returns NaN for empty/whitespace', () => {
    expect(Number.isNaN(parseSpanishDecimal(''))).toBe(true);
    expect(Number.isNaN(parseSpanishDecimal('   '))).toBe(true);
    expect(Number.isNaN(parseSpanishDecimal(undefined))).toBe(true);
  });

  it('returns NaN for non-numeric', () => {
    expect(Number.isNaN(parseSpanishDecimal('abc'))).toBe(true);
  });
});

const baseRaw = {
  IDEESS: '123',
  Latitud: '40,4168',
  'Longitud (WGS84)': '-3,7038',
  'Rótulo': 'Repsol',
  'Dirección': 'Gran Vía 1',
  Localidad: 'Madrid',
  Municipio: 'Madrid',
  Provincia: 'MADRID',
  'C.P.': '28013',
  Horario: 'L-D: 24H',
  'Precio Gasoleo A': '1,459',
  'Precio Gasolina 95 E5': '1,599',
  'Precio Gasolina 98 E5': '1,799',
  'Precio Gasoleo Premium': '1,559',
  'Precio Gasoleo B': '',
  'Precio Gases licuados del petróleo': '',
};

describe('parseStation', () => {
  it('parses a fully-populated station', () => {
    const station = parseStation(baseRaw);
    expect(station).not.toBeNull();
    expect(station!.id).toBe('123');
    expect(station!.name).toBe('Repsol');
    expect(station!.latitude).toBeCloseTo(40.4168);
    expect(station!.longitude).toBeCloseTo(-3.7038);
    expect(station!.prices.length).toBeGreaterThan(0);
  });

  it('skips empty prices', () => {
    const station = parseStation(baseRaw);
    const fuels = station!.prices.map(p => p.fuelType);
    expect(fuels).not.toContain('Gasóleo B');
    expect(fuels).not.toContain('GLP');
  });

  it('returns null for invalid coordinates', () => {
    const station = parseStation({...baseRaw, Latitud: 'xxx'});
    expect(station).toBeNull();
  });

  it('returns null when no prices are available', () => {
    const empty = {
      ...baseRaw,
      'Precio Gasoleo A': '',
      'Precio Gasolina 95 E5': '',
      'Precio Gasolina 98 E5': '',
      'Precio Gasoleo Premium': '',
    };
    expect(parseStation(empty)).toBeNull();
  });
});

describe('parseAllStations', () => {
  it('filters out invalid entries', () => {
    const valid = baseRaw;
    const invalid = {...baseRaw, Latitud: 'xxx'};
    const result = parseAllStations([valid, invalid, valid]);
    expect(result).toHaveLength(2);
  });
});
