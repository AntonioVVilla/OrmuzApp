import React, {ErrorInfo, PropsWithChildren} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import i18n from '../i18n';

interface State {
  error: Error | null;
}

interface Props extends PropsWithChildren {
  fallbackMessage?: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {error: null};

  static getDerivedStateFromError(error: Error): State {
    return {error};
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  private handleRetry = (): void => {
    this.setState({error: null});
  };

  override render(): React.ReactNode {
    if (this.state.error) {
      return (
        <View style={styles.container} accessibilityRole="alert">
          <Text style={styles.title}>{i18n.t('errors.title')}</Text>
          <Text style={styles.message}>
            {this.props.fallbackMessage ?? i18n.t('app.defaultFallbackError')}
          </Text>
          {__DEV__ && (
            <Text style={styles.detail}>{this.state.error.message}</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleRetry}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('errors.retry')}>
            <Text style={styles.buttonText}>{i18n.t('errors.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  detail: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ErrorBoundary;
