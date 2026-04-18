import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {FUEL_TYPES} from '../../utils/constants';

interface Props {
  selectedFuelKey: string;
  onSelect: (fuelKey: string, fuelLabel: string) => void;
}

export default function FuelTypeSelector({selectedFuelKey, onSelect}: Props) {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  return (
    <View
      style={[styles.container, {top: insets.top + 12}]}
      accessibilityRole="tablist"
      accessibilityLabel={t('fuel.selector')}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {FUEL_TYPES.map(fuel => {
          const isSelected = fuel.key === selectedFuelKey;
          return (
            <TouchableOpacity
              key={fuel.key}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(fuel.key, fuel.label)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{selected: isSelected}}
              accessibilityLabel={t(
                isSelected ? 'fuel.chipSelected' : 'fuel.chip',
                {label: fuel.label},
              )}>
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}>
                {fuel.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  chipSelected: {
    backgroundColor: '#1976D2',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
