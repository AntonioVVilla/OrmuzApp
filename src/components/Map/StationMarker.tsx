import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Marker} from '@maplibre/maplibre-react-native';
import {Station} from '../../types/station';
import {contrastTextColor} from '../../utils/colors';
import {formatMarkerPrice} from '../../utils/formatPrice';

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
  const fuel = station.prices.find(p => p.fuelType === selectedFuelLabel);
  const hasPrice = fuel !== undefined && fuel.price > 0;
  const bgColor = hasPrice ? (station.color ?? '#888888') : '#B0B0B0';
  const textColor = contrastTextColor(bgColor);

  const handlePress = useCallback(() => {
    onPress(station);
  }, [onPress, station]);

  return (
    <Marker
      id={`marker-${station.id}`}
      lngLat={[station.longitude, station.latitude]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.touchable}>
        <View style={[styles.bubble, {backgroundColor: bgColor}]}>
          <Text style={[styles.priceText, {color: textColor}]}>
            {hasPrice ? formatMarkerPrice(fuel.price) : 'N/D'}
          </Text>
        </View>
        <View style={[styles.arrow, {borderTopColor: bgColor}]} />
      </TouchableOpacity>
    </Marker>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
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
