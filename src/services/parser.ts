import {RawStationParsed} from '../schemas/api';
import {FuelPrice, Station} from '../types/station';
import {FUEL_TYPES} from '../utils/constants';

/**
 * Parse a Spanish decimal string (comma separator) to a number.
 * Returns NaN if the string is empty or invalid.
 */
export function parseSpanishDecimal(value: string | undefined): number {
  if (!value || value.trim() === '') {
    return NaN;
  }
  return parseFloat(value.replace(',', '.'));
}

function parsePrices(raw: RawStationParsed): FuelPrice[] {
  const prices: FuelPrice[] = [];
  for (const fuel of FUEL_TYPES) {
    const rawPrice = raw[fuel.key];
    const price = parseSpanishDecimal(rawPrice);
    if (!isNaN(price) && price > 0) {
      prices.push({
        fuelType: fuel.label,
        price,
      });
    }
  }
  return prices;
}

export function parseStation(raw: RawStationParsed): Station | null {
  const latitude = parseSpanishDecimal(raw.Latitud);
  const longitude = parseSpanishDecimal(raw['Longitud (WGS84)']);

  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }

  const prices = parsePrices(raw);
  if (prices.length === 0) {
    return null;
  }

  return {
    id: raw.IDEESS,
    name: raw['Rótulo'] ?? 'Desconocida',
    address: raw['Dirección'] ?? '',
    city: raw.Localidad || raw.Municipio || '',
    province: raw.Provincia ?? '',
    postalCode: raw['C.P.'] ?? '',
    latitude,
    longitude,
    schedule: raw.Horario ?? '',
    prices,
  };
}

export function parseAllStations(rawStations: RawStationParsed[]): Station[] {
  const stations: Station[] = [];
  for (const raw of rawStations) {
    const station = parseStation(raw);
    if (station) {
      stations.push(station);
    }
  }
  return stations;
}
