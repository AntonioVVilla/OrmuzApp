import {useMemo} from 'react';
import {Station} from '../types/station';
import {priceBucket, priceToColor} from '../utils/colors';

interface Options {
  colorblindSafe?: boolean;
}

/**
 * Compute color-coded stations based on the selected fuel type's price
 * relative to the current result set. Also tags each station with a
 * discrete `priceBucket` (1..3) so the UI can render a non-color
 * indicator (e.g. € signs) alongside the colour.
 */
export function usePriceColors(
  stations: Station[],
  selectedFuelLabel: string,
  options: Options = {},
): Station[] {
  return useMemo(() => {
    if (stations.length === 0) {
      return [];
    }

    const pricesMap = new Map<string, number>();
    for (const station of stations) {
      const fuel = station.prices.find(p => p.fuelType === selectedFuelLabel);
      if (fuel) {
        pricesMap.set(station.id, fuel.price);
      }
    }

    if (pricesMap.size === 0) {
      return stations;
    }

    const prices = Array.from(pricesMap.values());
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return stations
      .filter(station => pricesMap.has(station.id))
      .map(station => {
        const price = pricesMap.get(station.id)!;
        return {
          ...station,
          color: priceToColor(price, minPrice, maxPrice, {
            colorblindSafe: options.colorblindSafe,
          }),
          priceBucket: priceBucket(price, minPrice, maxPrice),
        };
      });
  }, [stations, selectedFuelLabel, options.colorblindSafe]);
}
