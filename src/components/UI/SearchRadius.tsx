import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MIN_RADIUS_KM, MAX_RADIUS_KM} from '../../utils/constants';

interface Props {
  radius: number;
  onRadiusChange: (radius: number) => void;
}

export default function SearchRadius({radius, onRadiusChange}: Props) {
  const {t} = useTranslation();
  const decrease = () => {
    const newRadius = Math.max(MIN_RADIUS_KM, radius - 5);
    onRadiusChange(newRadius);
  };

  const increase = () => {
    const newRadius = Math.min(MAX_RADIUS_KM, radius + 5);
    onRadiusChange(newRadius);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('searchRadius.label')}</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={decrease} activeOpacity={0.6} hitSlop={8}>
          <Text style={styles.button}>−</Text>
        </TouchableOpacity>
        <Text style={styles.value}>
          {radius} {t('searchRadius.unit')}
        </Text>
        <TouchableOpacity onPress={increase} activeOpacity={0.6} hitSlop={8}>
          <Text style={styles.button}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1976D2',
    paddingHorizontal: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 50,
    textAlign: 'center',
  },
});
