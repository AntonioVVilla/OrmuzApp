import AsyncStorage from '@react-native-async-storage/async-storage';
import {Station} from '../types/station';
import {StationArraySchema} from '../schemas/station';
import {CACHE_TTL_MS} from '../utils/constants';

function cacheKey(provinceId: string) {
  return `stations_cache_${provinceId}`;
}
function timestampKey(provinceId: string) {
  return `stations_cache_ts_${provinceId}`;
}

function safeParseStations(dataStr: string): Station[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(dataStr);
  } catch {
    return null;
  }
  const result = StationArraySchema.safeParse(parsed);
  return result.success ? result.data : null;
}

async function clearCache(provinceId: string): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(cacheKey(provinceId)),
      AsyncStorage.removeItem(timestampKey(provinceId)),
    ]);
  } catch {
    // Ignore — cache cleanup is best-effort.
  }
}

export async function getCachedStations(
  provinceId: string,
): Promise<Station[] | null> {
  try {
    const [dataStr, tsStr] = await Promise.all([
      AsyncStorage.getItem(cacheKey(provinceId)),
      AsyncStorage.getItem(timestampKey(provinceId)),
    ]);

    if (!dataStr || !tsStr) {
      return null;
    }

    const timestamp = parseInt(tsStr, 10);
    if (!Number.isFinite(timestamp)) {
      await clearCache(provinceId);
      return null;
    }
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      return null; // Cache expired
    }

    const stations = safeParseStations(dataStr);
    if (!stations) {
      await clearCache(provinceId);
      return null;
    }
    return stations;
  } catch {
    return null;
  }
}

export async function getCachedStationsIgnoreTTL(
  provinceId: string,
): Promise<Station[] | null> {
  try {
    const dataStr = await AsyncStorage.getItem(cacheKey(provinceId));
    if (!dataStr) {
      return null;
    }
    const stations = safeParseStations(dataStr);
    if (!stations) {
      await clearCache(provinceId);
      return null;
    }
    return stations;
  } catch {
    return null;
  }
}

export async function cacheStations(
  provinceId: string,
  stations: Station[],
): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(cacheKey(provinceId), JSON.stringify(stations)),
      AsyncStorage.setItem(timestampKey(provinceId), Date.now().toString()),
    ]);
  } catch {
    // Silently fail - cache is not critical
  }
}
