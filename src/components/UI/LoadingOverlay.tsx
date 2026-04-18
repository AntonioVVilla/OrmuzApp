import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

interface Props {
  message?: string;
  // When `subtle` is true, render as a non-blocking pill at the top
  // of the screen instead of a full-screen modal. Use this when there
  // is already data on screen that the user can continue interacting
  // with while we refresh in the background.
  subtle?: boolean;
}

export default function LoadingOverlay({message, subtle = false}: Props) {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const text = message ?? t('loading.stations');

  if (subtle) {
    return (
      <View
        style={[styles.subtleContainer, {top: insets.top + 12}]}
        pointerEvents="none"
        accessibilityLiveRegion="polite"
        accessibilityLabel={text}>
        <View style={styles.subtleCard}>
          <ActivityIndicator size="small" color="#1976D2" />
          <Text style={styles.subtleText}>{text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 100,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#555',
  },
  subtleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  subtleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
  subtleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
});
