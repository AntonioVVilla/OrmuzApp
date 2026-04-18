import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  cacheStations,
  getCachedStations,
  getCachedStationsIgnoreTTL,
} from '../../src/services/cache';
import {Station} from '../../src/types/station';

const PROVINCE = '28';

function station(id: string): Station {
  return {
    id,
    name: `Station ${id}`,
    address: '',
    city: '',
    province: '',
    postalCode: '',
    latitude: 40,
    longitude: -3,
    schedule: '',
    prices: [{fuelType: 'Gasolina 95', price: 1.5}],
  };
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('cacheStations + getCachedStations', () => {
  it('round-trips stations within TTL', async () => {
    const data = [station('a'), station('b')];
    await cacheStations(PROVINCE, data);
    const result = await getCachedStations(PROVINCE);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    expect(result![0]!.id).toBe('a');
  });

  it('returns null when no cache entry exists', async () => {
    const result = await getCachedStations(PROVINCE);
    expect(result).toBeNull();
  });

  it('returns null when the timestamp is stale', async () => {
    await cacheStations(PROVINCE, [station('a')]);
    // Force stale timestamp (2 hours ago)
    const staleTs = (Date.now() - 2 * 60 * 60 * 1000).toString();
    await AsyncStorage.setItem(`stations_cache_ts_${PROVINCE}`, staleTs);
    const result = await getCachedStations(PROVINCE);
    expect(result).toBeNull();
  });

  it('returns null and clears cache when the timestamp is corrupt', async () => {
    await cacheStations(PROVINCE, [station('a')]);
    await AsyncStorage.setItem(`stations_cache_ts_${PROVINCE}`, 'not-a-number');
    const result = await getCachedStations(PROVINCE);
    expect(result).toBeNull();
    // Cache should have been cleared
    const raw = await AsyncStorage.getItem(`stations_cache_${PROVINCE}`);
    expect(raw).toBeNull();
  });

  it('ignores corrupt JSON', async () => {
    await AsyncStorage.setItem(`stations_cache_${PROVINCE}`, '{not json}');
    await AsyncStorage.setItem(
      `stations_cache_ts_${PROVINCE}`,
      Date.now().toString(),
    );
    const result = await getCachedStations(PROVINCE);
    expect(result).toBeNull();
  });

  it('ignores schema-invalid payloads', async () => {
    await AsyncStorage.setItem(
      `stations_cache_${PROVINCE}`,
      JSON.stringify([{id: 'x'}]), // missing required fields
    );
    await AsyncStorage.setItem(
      `stations_cache_ts_${PROVINCE}`,
      Date.now().toString(),
    );
    const result = await getCachedStations(PROVINCE);
    expect(result).toBeNull();
  });
});

describe('getCachedStationsIgnoreTTL', () => {
  it('returns data even after TTL has expired', async () => {
    await cacheStations(PROVINCE, [station('a')]);
    const staleTs = (Date.now() - 2 * 60 * 60 * 1000).toString();
    await AsyncStorage.setItem(`stations_cache_ts_${PROVINCE}`, staleTs);
    const result = await getCachedStationsIgnoreTTL(PROVINCE);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
  });

  it('still rejects corrupt JSON', async () => {
    await AsyncStorage.setItem(`stations_cache_${PROVINCE}`, '{{{');
    const result = await getCachedStationsIgnoreTTL(PROVINCE);
    expect(result).toBeNull();
  });
});
