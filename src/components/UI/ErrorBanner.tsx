import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

interface Props {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorBanner({message, onDismiss}: Props) {
  const {t} = useTranslation();
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={t('errorBanner.dismissLabel')}>
          <Text style={styles.dismiss}>{t('errorBanner.dismiss')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 12,
    right: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    zIndex: 20,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
  },
  dismiss: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E65100',
    marginLeft: 12,
  },
});
