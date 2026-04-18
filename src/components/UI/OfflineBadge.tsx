import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

export default function OfflineBadge() {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, {top: insets.top + 60}]}
      accessibilityRole="alert"
      accessibilityLabel={t('offlineBadge.label')}>
      <View style={styles.dot} />
      <Text style={styles.text}>{t('offlineBadge.label')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E65100',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E65100',
  },
});
