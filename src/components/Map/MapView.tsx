import React, {useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Map, Camera, UserLocation, type CameraRef} from '@maplibre/maplibre-react-native';

// MapLibre's `OrnamentViewPosition` is the corner-anchored offset type
// used by `compassPosition`, `attributionPosition`, etc. It is exported
// from the deep path `components/map/Map` in the package, but the
// package's public barrel does NOT re-export it. To avoid a fragile
// deep import we inline the exact shape (a union of four corners).
type OrnamentViewPosition =
  | {top: number; left: number}
  | {top: number; right: number}
  | {bottom: number; right: number}
  | {bottom: number; left: number};
import {Station, Coordinate} from '../../types/station';
import {MAP_STYLE_URL} from '../../utils/constants';
import StationMarker from './StationMarker';

// Visual height of the floating fuel-type chip row rendered by
// `<FuelTypeSelector>` on top of the map (see its own styles: it sits at
// `top: insets.top + 12` with `minHeight: 44`). We offset the native
// MapLibre compass past the bottom of that row plus a small breathing gap
// so the needle never hides behind the chips.
const FUEL_CHIP_ROW_BOTTOM_OFFSET = 72;

interface Props {
  stations: Station[];
  userLocation: Coordinate;
  selectedFuelLabel: string;
  onStationPress: (station: Station) => void;
}

export default function MapView({
  stations,
  userLocation,
  selectedFuelLabel,
  onStationPress,
}: Props) {
  const cameraRef = useRef<CameraRef>(null);
  const insets = useSafeAreaInsets();

  // Anchor the compass to the top-right corner, *below* the fuel-type
  // chips. `OrnamentViewPosition` is a discriminated union so we have to
  // build the object with the exact `{top, right}` shape rather than
  // spreading conditionally.
  const compassPosition = useMemo<OrnamentViewPosition>(
    () => ({
      top: insets.top + FUEL_CHIP_ROW_BOTTOM_OFFSET,
      right: 8,
    }),
    [insets.top],
  );

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE_URL}
        logo={false}
        attribution={true}
        attributionPosition={{bottom: 8, left: 8}}
        compass={true}
        compassPosition={compassPosition}
        compassHiddenFacingNorth={true}>
        <Camera
          ref={cameraRef}
          center={[userLocation.longitude, userLocation.latitude]}
          zoom={13}
        />

        <UserLocation />

        {stations.map(station => (
          <StationMarker
            key={station.id}
            station={station}
            selectedFuelLabel={selectedFuelLabel}
            onPress={onStationPress}
          />
        ))}
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
