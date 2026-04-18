import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, StatusBar, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import './src/i18n';
import MapView from './src/components/Map/MapView';
import FuelTypeSelector from './src/components/UI/FuelTypeSelector';
import SearchRadius from './src/components/UI/SearchRadius';
import LoadingOverlay from './src/components/UI/LoadingOverlay';
import ErrorBanner from './src/components/UI/ErrorBanner';
import StationDetailSheet from './src/components/StationDetail/StationDetailSheet';
import ErrorBoundary from './src/components/ErrorBoundary';
import {useLocation} from './src/hooks/useLocation';
import {useStations} from './src/hooks/useStations';
import {usePriceColors} from './src/hooks/usePriceColors';
import {DEFAULT_FUEL_TYPE, DEFAULT_RADIUS_KM} from './src/utils/constants';
import {Station} from './src/types/station';

function App() {
  const [selectedFuelKey, setSelectedFuelKey] = useState<string>(DEFAULT_FUEL_TYPE.key);
  const [selectedFuelLabel, setSelectedFuelLabel] = useState<string>(
    DEFAULT_FUEL_TYPE.label,
  );
  const [radius, setRadius] = useState(DEFAULT_RADIUS_KM);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [errorDismissed, setErrorDismissed] = useState(false);

  const {location, loading: locationLoading} = useLocation();
  const {
    nearbyStations,
    loading: stationsLoading,
    error,
  } = useStations(location, radius, selectedFuelLabel);
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

  useEffect(() => {
    setErrorDismissed(false);
  }, [error]);

  const isLoading = locationLoading || stationsLoading;

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

          {isLoading && <LoadingOverlay />}

          {error && !errorDismissed && (
            <ErrorBanner
              message={error.message}
              onDismiss={handleDismissError}
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
