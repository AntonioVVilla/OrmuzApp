import {useMemo} from 'react';
import {Station} from '../types/station';
import {priceToColor} from '../utils/colors';

/**
 * Compute color-coded stations based on selected fuel type price
 */
export function usePriceColors(
  stations: Station[],
  selectedFuelLabel: string,
): Station[] {
  return useMemo(() => {
    if (stations.length === 0) {
      return [];
    }

    // Get prices for the selected fuel type
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
          color: priceToColor(price, minPrice, maxPrice),
        };
      });
  }, [stations, selectedFuelLabel]);
}
