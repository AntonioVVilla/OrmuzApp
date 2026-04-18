import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Station} from '../../types/station';
import {formatPrice, formatDistance} from '../../utils/formatPrice';

interface Props {
  station: Station;
}

function MarkerCalloutBase({station}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{station.name}</Text>
      <Text style={styles.address}>{station.address}</Text>
      {station.distance !== undefined && (
        <Text style={styles.distance}>
          {formatDistance(station.distance)}
        </Text>
      )}
      {station.prices.map(fuel => (
        <View key={fuel.fuelType} style={styles.priceRow}>
          <Text style={styles.fuelType}>{fuel.fuelType}</Text>
          <Text style={styles.price}>{formatPrice(fuel.price)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  address: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  distance: {
    fontSize: 11,
    color: '#1976D2',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  fuelType: {
    fontSize: 12,
    color: '#555',
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});

export default React.memo(MarkerCalloutBase);
