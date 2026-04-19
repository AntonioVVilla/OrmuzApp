/**
 * Unit tests for the external-navigation deep-link helpers. These
 * exercise the dual-path behaviour (native scheme → web fallback)
 * without actually opening any URL: we spy on `Linking.canOpenURL` and
 * `Linking.openURL` and assert the exact strings that would have been
 * dispatched. That way we catch regressions in URL construction (e.g.
 * dropping the `&navigate=yes` suffix or forgetting to URL-encode the
 * station name) without needing an emulator.
 */

import {Linking} from 'react-native';
import {Station} from '../../src/types/station';
import {
  openInGoogleMaps,
  openInSystemMaps,
  openInWaze,
  toNavigationTarget,
} from '../../src/utils/navigation';

const SAMPLE_STATION: Station = {
  id: 'test-1',
  name: "Repsol O'Donnell",
  address: 'C/ ODonnell 1',
  city: 'Madrid',
  province: 'Madrid',
  postalCode: '28009',
  latitude: 40.4215,
  longitude: -3.6803,
  schedule: 'L-D: 24H',
  prices: [],
};

const TARGET = toNavigationTarget(SAMPLE_STATION);

describe('toNavigationTarget', () => {
  it('projects a Station down to just the fields we need for deep-links', () => {
    expect(TARGET).toEqual({
      latitude: 40.4215,
      longitude: -3.6803,
      name: "Repsol O'Donnell",
    });
  });
});

describe('openInGoogleMaps', () => {
  // React Native's jest preset already wraps Linking.{openURL,canOpenURL}
  // in `jest.fn()`s, so `jest.spyOn(...)` re-wraps an existing mock.
  // We need `clearAllMocks()` (zeroes call history on ALL jest.fns) in
  // addition to `restoreAllMocks()` (reverts spy implementations).
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('opens the native comgooglemaps:// URL when the scheme is available', async () => {
    const canOpen = jest
      .spyOn(Linking, 'canOpenURL')
      .mockResolvedValue(true);
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);

    const result = await openInGoogleMaps(TARGET);

    expect(result).toBe(true);
    expect(canOpen).toHaveBeenCalledWith(
      expect.stringMatching(/^comgooglemaps:\/\//),
    );
    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(
      'comgooglemaps://?daddr=40.4215,-3.6803&directionsmode=driving',
    );
  });

  it('falls back to the https maps URL when the native scheme is unavailable', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);

    const result = await openInGoogleMaps(TARGET);

    expect(result).toBe(true);
    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(
      'https://www.google.com/maps/dir/?api=1&destination=40.4215,-3.6803&travelmode=driving',
    );
  });

  it('still returns true via the web fallback when canOpenURL rejects', async () => {
    jest
      .spyOn(Linking, 'canOpenURL')
      .mockRejectedValue(new Error('boom'));
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);

    const result = await openInGoogleMaps(TARGET);

    expect(result).toBe(true);
    expect(openURL).toHaveBeenCalledWith(
      expect.stringContaining('https://www.google.com/maps/dir/'),
    );
  });

  it('returns false when both native and web openURL fail', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('nope'));

    const result = await openInGoogleMaps(TARGET);

    expect(result).toBe(false);
  });
});

describe('openInWaze', () => {
  // React Native's jest preset already wraps Linking.{openURL,canOpenURL}
  // in `jest.fn()`s, so `jest.spyOn(...)` re-wraps an existing mock.
  // We need `clearAllMocks()` (zeroes call history on ALL jest.fns) in
  // addition to `restoreAllMocks()` (reverts spy implementations).
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('uses the waze:// scheme with navigate=yes when available', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);

    await openInWaze(TARGET);

    expect(openURL).toHaveBeenCalledWith(
      'waze://?ll=40.4215,-3.6803&navigate=yes',
    );
  });

  it('falls back to the https waze.com/ul URL otherwise', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);

    await openInWaze(TARGET);

    expect(openURL).toHaveBeenCalledWith(
      'https://waze.com/ul?ll=40.4215,-3.6803&navigate=yes',
    );
  });
});

describe('openInSystemMaps', () => {
  // React Native's jest preset already wraps Linking.{openURL,canOpenURL}
  // in `jest.fn()`s, so `jest.spyOn(...)` re-wraps an existing mock.
  // We need `clearAllMocks()` (zeroes call history on ALL jest.fns) in
  // addition to `restoreAllMocks()` (reverts spy implementations).
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('builds a geo: URI with the URL-encoded station name as the label', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);

    await openInSystemMaps(TARGET);

    // `encodeURIComponent` leaves the apostrophe unencoded (it is in
    // the unreserved set per RFC 3986), but the space must become %20
    // and the outer `(label)` parentheses must be preserved so
    // Android's geo: intent picks up the station name.
    const url = openURL.mock.calls[0][0] as string;
    expect(url).toBe(
      "geo:40.4215,-3.6803?q=40.4215,-3.6803(Repsol%20O'Donnell)",
    );
  });

  it('falls back to https://www.google.com/maps?q=... when geo: is unavailable', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);

    await openInSystemMaps(TARGET);

    expect(openURL).toHaveBeenCalledWith(
      'https://www.google.com/maps?q=40.4215,-3.6803',
    );
  });
});
