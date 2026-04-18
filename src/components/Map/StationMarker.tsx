import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Marker} from '@maplibre/maplibre-react-native';
import {useTranslation} from 'react-i18next';
import {Station} from '../../types/station';
import {contrastTextColor, priceBucketLabel} from '../../utils/colors';
import {
  formatDistance,
  formatMarkerPrice,
  formatPrice,
} from '../../utils/formatPrice';

interface Props {
  station: Station;
  selectedFuelLabel: string;
  onPress: (station: Station) => void;
}

export default function StationMarker({
  station,
  selectedFuelLabel,
  onPress,
}: Props) {
  const {t} = useTranslation();
  const fuel = station.prices.find(p => p.fuelType === selectedFuelLabel);
  const hasPrice = fuel !== undefined && fuel.price > 0;
  const bgColor = hasPrice ? (station.color ?? '#888888') : '#B0B0B0';
  const textColor = contrastTextColor(bgColor);
  const bucketLabel =
    hasPrice && station.priceBucket ? priceBucketLabel(station.priceBucket) : '';

  const handlePress = useCallback(() => {
    onPress(station);
  }, [onPress, station]);

  const a11yLabel = t('map.marker', {
    name: station.name,
    fuel: selectedFuelLabel,
    price: hasPrice ? formatPrice(fuel.price) : 'N/D',
    distance:
      station.distance !== undefined ? formatDistance(station.distance) : '-',
  });

  return (
    <Marker
      id={`marker-${station.id}`}
      lngLat={[station.longitude, station.latitude]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}>
        <View style={[styles.bubble, {backgroundColor: bgColor}]}>
          <Text style={[styles.priceText, {color: textColor}]}>
            {hasPrice ? formatMarkerPrice(fuel.price) : 'N/D'}
          </Text>
          {bucketLabel !== '' && (
            <Text
              style={[styles.bucket, {color: textColor}]}
              accessibilityElementsHidden
              importantForAccessibility="no">
              {bucketLabel}
            </Text>
          )}
        </View>
        <View style={[styles.arrow, {borderTopColor: bgColor}]} />
      </TouchableOpacity>
    </Marker>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  bubble: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    minWidth: 50,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  bucket: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
