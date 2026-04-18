import {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {fetchStationsByProvince} from '../services/api';
import {parseAllStations} from '../services/parser';
import {filterByProximity} from '../services/geo';
import {
  getCachedStations,
  getCachedStationsIgnoreTTL,
  cacheStations,
} from '../services/cache';
import {getProvinceId} from '../utils/provinces';
import {Coordinate, Station} from '../types/station';
import {AppError, toAppError} from '../types/errors';
import {MAX_STATIONS} from '../utils/constants';
import i18n from '../i18n';

interface StationsState {
  allStations: Station[];
  nearbyStations: Station[];
  loading: boolean;
  error: AppError | null;
  lastUpdate: Date | null;
  provinceId: string | null;
}

const INITIAL_STATE: StationsState = {
  allStations: [],
  nearbyStations: [],
  loading: true,
  error: null,
  lastUpdate: null,
  provinceId: null,
};

export function useStations(
  location: Coordinate,
  radiusKm: number,
  selectedFuelLabel: string,
) {
  const [state, setState] = useState<StationsState>(INITIAL_STATE);

  const abortControllerRef = useRef<AbortController | null>(null);

  const provinceId = useMemo(
    () => getProvinceId(location.latitude, location.longitude),
    [location.latitude, location.longitude],
  );

  const loadStations = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState(prev => {
      const provinceChanged = prev.provinceId !== provinceId;
      return {
        ...prev,
        loading: true,
        error: null,
        allStations: provinceChanged ? [] : prev.allStations,
        nearbyStations: provinceChanged ? [] : prev.nearbyStations,
        provinceId,
      };
    });

    try {
      let stations = await getCachedStations(provinceId);

      if (!stations) {
        const response = await fetchStationsByProvince(
          provinceId,
          controller.signal,
        );
        stations = parseAllStations(response.ListaEESSPrecio);
        await cacheStations(provinceId, stations);
      }

      if (controller.signal.aborted) {
        return;
      }

      setState(prev => ({
        ...prev,
        allStations: stations ?? [],
        loading: false,
        lastUpdate: new Date(),
      }));
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      try {
        const cached = await getCachedStationsIgnoreTTL(provinceId);
        if (cached && cached.length > 0) {
          setState(prev => ({
            ...prev,
            allStations: cached,
            loading: false,
            error: {
              code: 'OFFLINE_STALE',
              message: i18n.t('errors.offlineStale'),
            },
            lastUpdate: new Date(),
          }));
          return;
        }
      } catch {
        // cache fallback itself failed, fall through to main error
      }

      const appErr = toAppError(err, 'NETWORK');
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          code: appErr.code,
          message: i18n.t('errors.network'),
        },
      }));
    }
  }, [provinceId]);

  useEffect(() => {
    if (state.allStations.length === 0) {
      setState(prev =>
        prev.nearbyStations.length === 0 ? prev : {...prev, nearbyStations: []},
      );
      return;
    }

    const withFuel = state.allStations.filter(s =>
      s.prices.some(p => p.fuelType === selectedFuelLabel),
    );

    const nearby = filterByProximity(
      withFuel,
      location,
      radiusKm,
      MAX_STATIONS,
    );

    setState(prev => ({...prev, nearbyStations: nearby}));
  }, [state.allStations, location, radiusKm, selectedFuelLabel]);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    ...state,
    refresh: loadStations,
  };
}
