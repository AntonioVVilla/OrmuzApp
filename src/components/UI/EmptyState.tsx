import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

interface Props {
  onIncreaseRadius?: () => void;
  onRetry?: () => void;
}

export default function EmptyState({onIncreaseRadius, onRetry}: Props) {
  const {t} = useTranslation();

  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
      accessibilityRole="summary">
      <View style={styles.card} pointerEvents="auto">
        <Text style={styles.title}>{t('emptyState.title')}</Text>
        <Text style={styles.message}>{t('emptyState.message')}</Text>
        <View style={styles.actions}>
          {onIncreaseRadius && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onIncreaseRadius}
              accessibilityRole="button"
              accessibilityLabel={t('emptyState.increaseRadius')}>
              <Text style={styles.primaryButtonText}>
                {t('emptyState.increaseRadius')}
              </Text>
            </TouchableOpacity>
          )}
          {onRetry && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onRetry}
              accessibilityRole="button"
              accessibilityLabel={t('emptyState.retry')}>
              <Text style={styles.secondaryButtonText}>
                {t('emptyState.retry')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
    alignItems: 'center',
    zIndex: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    maxWidth: 400,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#1976D2',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#ECEFF1',
  },
  secondaryButtonText: {
    color: '#1565C0',
    fontSize: 13,
    fontWeight: '700',
  },
});
