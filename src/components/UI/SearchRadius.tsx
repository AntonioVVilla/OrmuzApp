import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MAX_RADIUS_KM, MIN_RADIUS_KM} from '../../utils/constants';

interface Props {
  radius: number;
  onRadiusChange: (radius: number) => void;
}

const STEP_KM = 5;

export default function SearchRadius({radius, onRadiusChange}: Props) {
  const {t} = useTranslation();

  const decrease = () => {
    const newRadius = Math.max(MIN_RADIUS_KM, radius - STEP_KM);
    onRadiusChange(newRadius);
  };

  const increase = () => {
    const newRadius = Math.min(MAX_RADIUS_KM, radius + STEP_KM);
    onRadiusChange(newRadius);
  };

  return (
    <View
      style={styles.container}
      accessibilityRole="adjustable"
      accessibilityLabel={t('searchRadius.label')}
      accessibilityValue={{
        min: MIN_RADIUS_KM,
        max: MAX_RADIUS_KM,
        now: radius,
        text: t('searchRadius.value', {radius}),
      }}
      onAccessibilityAction={event => {
        if (event.nativeEvent.actionName === 'decrement') {
          decrease();
        } else if (event.nativeEvent.actionName === 'increment') {
          increase();
        }
      }}
      accessibilityActions={[{name: 'decrement'}, {name: 'increment'}]}>
      <Text style={styles.label}>{t('searchRadius.label')}</Text>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={decrease}
          activeOpacity={0.6}
          hitSlop={12}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={t('searchRadius.decrease')}>
          <Text style={styles.button}>−</Text>
        </TouchableOpacity>
        <Text style={styles.value}>
          {radius} {t('searchRadius.unit')}
        </Text>
        <TouchableOpacity
          onPress={increase}
          activeOpacity={0.6}
          hitSlop={12}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={t('searchRadius.increase')}>
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
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
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
    gap: 6,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1976D2',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 54,
    textAlign: 'center',
  },
});
