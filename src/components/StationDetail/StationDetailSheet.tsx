import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {Station} from '../../types/station';
import {formatDistance} from '../../utils/formatPrice';
import {
  openInGoogleMaps,
  openInSystemMaps,
  openInWaze,
  toNavigationTarget,
} from '../../utils/navigation';
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
  const snapPoints = useMemo(() => ['40%', '65%'], []);

  const navTarget = useMemo(
    () => (station ? toNavigationTarget(station) : null),
    [station],
  );

  // Fire-and-forget: the helpers swallow their own rejections and
  // return Promise<boolean>, so we don't need to await them or handle
  // failure here. We do ignore the boolean since there is no UI branch
  // that depends on whether the link resolved to native vs. web.
  const handleGoogleMaps = useCallback(() => {
    if (navTarget) {
      openInGoogleMaps(navTarget).catch(() => undefined);
    }
  }, [navTarget]);

  const handleWaze = useCallback(() => {
    if (navTarget) {
      openInWaze(navTarget).catch(() => undefined);
    }
  }, [navTarget]);

  const handleSystemMaps = useCallback(() => {
    if (navTarget) {
      openInSystemMaps(navTarget).catch(() => undefined);
    }
  }, [navTarget]);

  if (!station) {
    return null;
  }

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

        <Text style={styles.sectionTitle}>{t('stationDetail.navigate')}</Text>
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonGoogle]}
            onPress={handleGoogleMaps}
            accessibilityRole="button"
            accessibilityLabel={t('stationDetail.openInGoogleMaps')}>
            <Text style={styles.navButtonText}>
              {t('stationDetail.googleMaps')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonWaze]}
            onPress={handleWaze}
            accessibilityRole="button"
            accessibilityLabel={t('stationDetail.openInWaze')}>
            <Text style={styles.navButtonText}>{t('stationDetail.waze')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.navSecondary}
          onPress={handleSystemMaps}
          accessibilityRole="button"
          accessibilityLabel={t('stationDetail.openInSystemMaps')}>
          <Text style={styles.navSecondaryText}>
            {t('stationDetail.systemMaps')}
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
  navRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  navButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  navButtonGoogle: {
    backgroundColor: '#1976D2',
  },
  navButtonWaze: {
    backgroundColor: '#33CCFF',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  navSecondary: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    backgroundColor: '#F5F7FA',
  },
  navSecondaryText: {
    color: '#37474F',
    fontSize: 14,
    fontWeight: '600',
  },
});
