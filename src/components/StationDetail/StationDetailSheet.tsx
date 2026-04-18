import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {Station} from '../../types/station';
import {formatDistance} from '../../utils/formatPrice';
import PriceRow from './PriceRow';

interface Props {
  station: Station | null;
  selectedFuelLabel: string;
  onClose: () => void;
}

export default function StationDetailSheet({
  station,
  selectedFuelLabel,
  onClose,
}: Props) {
  const {t} = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['35%', '60%'], []);

  const handleNavigate = useCallback(() => {
    if (!station) return;
    const url = `geo:${station.latitude},${station.longitude}?q=${station.latitude},${station.longitude}(${encodeURIComponent(station.name)})`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`,
      );
    });
  }, [station]);

  if (!station) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}>
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{station.name}</Text>
            <Text style={styles.address}>
              {station.address}, {station.city}
            </Text>
            {station.distance !== undefined && (
              <Text style={styles.distance}>
                {t('stationDetail.distance', {
                  distance: formatDistance(station.distance),
                })}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t('stationDetail.close')}>
            <Text style={styles.closeGlyph}>×</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.schedule}>{station.schedule}</Text>

        <View style={styles.pricesContainer}>
          <Text style={styles.sectionTitle}>{t('stationDetail.prices')}</Text>
          {station.prices.map(fuel => (
            <PriceRow
              key={fuel.fuelType}
              fuel={fuel}
              isSelected={fuel.fuelType === selectedFuelLabel}
              bucket={
                fuel.fuelType === selectedFuelLabel
                  ? station.priceBucket
                  : undefined
              }
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNavigate}
          accessibilityRole="button"
          accessibilityLabel={t('stationDetail.navigate')}>
          <Text style={styles.navButtonText}>
            {t('stationDetail.navigate')}
          </Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  indicator: {
    backgroundColor: '#CCC',
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  distance: {
    fontSize: 13,
    color: '#1976D2',
    fontWeight: '600',
    marginTop: 4,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeGlyph: {
    fontSize: 28,
    color: '#666',
    fontWeight: '400',
    lineHeight: 30,
  },
  schedule: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  pricesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  navButton: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
