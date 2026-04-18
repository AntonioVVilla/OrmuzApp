import React, {useState, useCallback, useDeferredValue, useEffect} from 'react';
import {StyleSheet, StatusBar, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import './src/i18n';
import MapView from './src/components/Map/MapView';
import FuelTypeSelector from './src/components/UI/FuelTypeSelector';
import SearchRadius from './src/components/UI/SearchRadius';
import LoadingOverlay from './src/components/UI/LoadingOverlay';
import ErrorBanner from './src/components/UI/ErrorBanner';
import EmptyState from './src/components/UI/EmptyState';
import OfflineBadge from './src/components/UI/OfflineBadge';
import StationDetailSheet from './src/components/StationDetail/StationDetailSheet';
import ErrorBoundary from './src/components/ErrorBoundary';
import {useLocation} from './src/hooks/useLocation';
import {useStations} from './src/hooks/useStations';
import {usePriceColors} from './src/hooks/usePriceColors';
import {
  DEFAULT_FUEL_TYPE,
  DEFAULT_RADIUS_KM,
  MAX_RADIUS_KM,
} from './src/utils/constants';
import {Station} from './src/types/station';

const RADIUS_STEP_KM = 5;

function App() {
  const [selectedFuelKey, setSelectedFuelKey] = useState<string>(
    DEFAULT_FUEL_TYPE.key,
  );
  const [selectedFuelLabel, setSelectedFuelLabel] = useState<string>(
    DEFAULT_FUEL_TYPE.label,
  );
  const [radius, setRadius] = useState(DEFAULT_RADIUS_KM);
  // Defer the radius used by the expensive proximity filter so rapid
  // +/- taps update the on-screen control immediately and the map
  // recomputes on the next idle tick. Cheap version of debouncing.
  const deferredRadius = useDeferredValue(radius);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [errorDismissed, setErrorDismissed] = useState(false);

  const {location, loading: locationLoading} = useLocation();
  const {
    nearbyStations,
    loading: stationsLoading,
    error,
    refresh: refreshStations,
  } = useStations(location, deferredRadius, selectedFuelLabel);
  const coloredStations = usePriceColors(nearbyStations, selectedFuelLabel);

  const handleFuelSelect = useCallback(
    (fuelKey: string, fuelLabel: string) => {
      setSelectedFuelKey(fuelKey);
      setSelectedFuelLabel(fuelLabel);
    },
    [],
  );

  const handleStationPress = useCallback((station: Station) => {
    setSelectedStation(station);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedStation(null);
  }, []);

  const handleDismissError = useCallback(() => {
    setErrorDismissed(true);
  }, []);

  const handleIncreaseRadius = useCallback(() => {
    setRadius(prev => Math.min(MAX_RADIUS_KM, prev + RADIUS_STEP_KM));
  }, []);

  useEffect(() => {
    setErrorDismissed(false);
  }, [error]);

  const isLoading = locationLoading || stationsLoading;
  const hasStations = coloredStations.length > 0;
  const subtleLoading = isLoading && hasStations;
  const blockingLoading = isLoading && !hasStations;
  const isOfflineStale = error?.code === 'OFFLINE_STALE';
  const isFatalError = error !== null && !isOfflineStale;
  const showEmptyState =
    !isLoading && !hasStations && !isFatalError && location !== null;
  const showBanner = isFatalError && !errorDismissed;

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.flex}>
        <SafeAreaProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <View style={styles.flex}>
            <MapView
              stations={coloredStations}
              userLocation={location}
              selectedFuelLabel={selectedFuelLabel}
              onStationPress={handleStationPress}
            />

            <FuelTypeSelector
              selectedFuelKey={selectedFuelKey}
              onSelect={handleFuelSelect}
            />

            <SearchRadius radius={radius} onRadiusChange={setRadius} />

            {blockingLoading && <LoadingOverlay />}
            {subtleLoading && <LoadingOverlay subtle />}

            {isOfflineStale && <OfflineBadge />}

            {showBanner && error && (
              <ErrorBanner
                message={error.message}
                onDismiss={handleDismissError}
              />
            )}

            {showEmptyState && (
              <EmptyState
                onIncreaseRadius={
                  radius < MAX_RADIUS_KM ? handleIncreaseRadius : undefined
                }
                onRetry={refreshStations}
              />
            )}

            {selectedStation && (
              <StationDetailSheet
                station={selectedStation}
                selectedFuelLabel={selectedFuelLabel}
                onClose={handleCloseDetail}
              />
            )}
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default App;
