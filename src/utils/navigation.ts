import {Linking} from 'react-native';
import {Station} from '../types/station';

/**
 * Deep-link helpers for opening a fuel station in external navigation
 * apps. Each provider exposes one function that:
 *
 *   1. Builds the provider-specific URL.
 *   2. Asks the OS whether something is registered for that scheme.
 *   3. If yes, opens it. If no, falls back to a universal web URL that
 *      is guaranteed to resolve to *some* navigation experience
 *      (the system browser will forward waze.com / maps.google.com
 *      to the installed app via Android App Links when possible).
 *
 * On Android 11+ `Linking.canOpenURL` only returns `true` for schemes
 * whose target package is declared in `AndroidManifest.xml <queries>`.
 * That declaration lives in
 * `android/app/src/main/AndroidManifest.xml` so this file does not
 * need to be kept in sync with package names at runtime.
 *
 * The functions are pure wrappers around `Linking.openURL` and are
 * safe to call from event handlers — any rejection in the underlying
 * promise is caught so the caller never sees a spurious crash in the
 * UI thread.
 */

export interface NavigationTarget {
  latitude: number;
  longitude: number;
  name: string;
}

export function toNavigationTarget(station: Station): NavigationTarget {
  return {
    latitude: station.latitude,
    longitude: station.longitude,
    name: station.name,
  };
}

async function tryOpen(primary: string, fallback: string): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL(primary);
    if (canOpen) {
      await Linking.openURL(primary);
      return true;
    }
  } catch {
    // Fall through to the web fallback.
  }
  try {
    await Linking.openURL(fallback);
    return true;
  } catch {
    return false;
  }
}

/**
 * Open the destination in Google Maps. Prefers the native
 * `comgooglemaps://` scheme and falls back to the universal
 * `https://www.google.com/maps/dir/` URL which Android forwards to
 * the Google Maps app via App Links when installed.
 */
export async function openInGoogleMaps(
  target: NavigationTarget,
): Promise<boolean> {
  const {latitude, longitude} = target;
  const native =
    `comgooglemaps://?daddr=${latitude},${longitude}` +
    `&directionsmode=driving`;
  const web =
    `https://www.google.com/maps/dir/?api=1&destination=` +
    `${latitude},${longitude}&travelmode=driving`;
  return tryOpen(native, web);
}

/**
 * Open the destination in Waze. Prefers the native `waze://` scheme
 * and falls back to the universal `https://waze.com/ul` URL.
 */
export async function openInWaze(
  target: NavigationTarget,
): Promise<boolean> {
  const {latitude, longitude} = target;
  const native = `waze://?ll=${latitude},${longitude}&navigate=yes`;
  const web = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  return tryOpen(native, web);
}

/**
 * Open the destination in the system's default maps application
 * using the geo: URI scheme. On Android this opens whichever app
 * the user has chosen as their default handler for geo intents.
 * Falls back to `https://www.google.com/maps?q=...` if nothing is
 * registered for geo: (rare — almost every Android device has at
 * least Google Maps installed).
 */
export async function openInSystemMaps(
  target: NavigationTarget,
): Promise<boolean> {
  const {latitude, longitude, name} = target;
  const q = `${latitude},${longitude}(${encodeURIComponent(name)})`;
  const native = `geo:${latitude},${longitude}?q=${q}`;
  const web = `https://www.google.com/maps?q=${latitude},${longitude}`;
  return tryOpen(native, web);
}
