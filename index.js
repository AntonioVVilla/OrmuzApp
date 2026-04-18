/**
 * @format
 */

// Must be the very first import so the native module registers before any
// JS touches the tree. Missing it causes startup crashes in release builds.
import 'react-native-gesture-handler';

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// In release builds there is no Metro/Dev bridge to surface uncaught
// exceptions, so without a handler they vanish and the app just dies.
// Route them into `console.error` so logcat (tag `ReactNativeJS`) picks
// them up; do NOT re-throw because that would still crash the process.
if (typeof ErrorUtils !== 'undefined' && ErrorUtils?.setGlobalHandler) {
  const previous = ErrorUtils.getGlobalHandler?.();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    try {
      console.error(
        `[GlobalError] fatal=${isFatal ? 'true' : 'false'}`,
        error && error.stack ? error.stack : error,
      );
    } catch {
      // swallow: logging must never itself crash
    }
    previous?.(error, isFatal);
  });
}

// Suppress noisy warnings that we cannot action and that would otherwise
// spam the red-box in dev; keep this list short and reviewed.
LogBox.ignoreLogs([
  'new NativeEventEmitter',
]);

AppRegistry.registerComponent(appName, () => App);
