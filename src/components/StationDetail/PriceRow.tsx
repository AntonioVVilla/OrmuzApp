import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FuelPrice} from '../../types/station';
import {priceBucketLabel} from '../../utils/colors';
import {formatPrice} from '../../utils/formatPrice';

interface Props {
  fuel: FuelPrice;
  isSelected: boolean;
  bucket?: 1 | 2 | 3;
}

function PriceRowBase({fuel, isSelected, bucket}: Props) {
  return (
    <View style={[styles.container, isSelected && styles.selected]}>
      <Text style={[styles.fuelType, isSelected && styles.selectedText]}>
        {fuel.fuelType}
      </Text>
      <View style={styles.priceGroup}>
        {isSelected && bucket && (
          <Text
            style={styles.bucket}
            accessibilityElementsHidden
            importantForAccessibility="no">
            {priceBucketLabel(bucket)}
          </Text>
        )}
        <Text style={[styles.price, isSelected && styles.selectedText]}>
          {formatPrice(fuel.price)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  selected: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginHorizontal: -4,
    paddingHorizontal: 20,
  },
  fuelType: {
    fontSize: 15,
    color: '#333',
  },
  selectedText: {
    fontWeight: '700',
    color: '#1565C0',
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bucket: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1565C0',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
});

export default React.memo(PriceRowBase);
