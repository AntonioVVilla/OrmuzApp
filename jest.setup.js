/* eslint-env jest */
/* global jest */

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  const api = {
    getItem: jest.fn((k) => Promise.resolve(store.has(k) ? store.get(k) : null)),
    setItem: jest.fn((k, v) => {
      store.set(k, String(v));
      return Promise.resolve();
    }),
    removeItem: jest.fn((k) => {
      store.delete(k);
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      store.clear();
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Array.from(store.keys()))),
    multiGet: jest.fn((keys) =>
      Promise.resolve(keys.map((k) => [k, store.has(k) ? store.get(k) : null])),
    ),
    multiSet: jest.fn((pairs) => {
      pairs.forEach(([k, v]) => store.set(k, String(v)));
      return Promise.resolve();
    }),
    multiRemove: jest.fn((keys) => {
      keys.forEach((k) => store.delete(k));
      return Promise.resolve();
    }),
  };
  return {__esModule: true, default: api, ...api};
});

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    BaseButton: View,
    Directions: {},
    State: {},
    gestureHandlerRootHOC: (c) => c,
  };
});

jest.mock('react-native-reanimated', () => {
  try {
    return require('react-native-reanimated/mock');
  } catch {
    return {};
  }
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    SafeAreaProvider: ({children}) => React.createElement(View, null, children),
    SafeAreaView: ({children}) => React.createElement(View, null, children),
    useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
  };
});

jest.mock('react-native-localize', () => ({
  findBestLanguageTag: () => ({languageTag: 'es', isRTL: false}),
  getLocales: () => [
    {countryCode: 'ES', languageTag: 'es-ES', languageCode: 'es', isRTL: false},
  ],
  getNumberFormatSettings: () => ({
    decimalSeparator: ',',
    groupingSeparator: '.',
  }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'ES',
  getCurrencies: () => ['EUR'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'Europe/Madrid',
  uses24HourClock: () => true,
  usesMetricSystem: () => true,
}));

jest.mock('react-native-geolocation-service', () => ({
  __esModule: true,
  default: {
    getCurrentPosition: jest.fn(),
    requestAuthorization: jest.fn().mockResolvedValue('granted'),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    stopObserving: jest.fn(),
  },
}));

jest.mock('@maplibre/maplibre-react-native', () => {
  const React = require('react');
  const {View} = require('react-native');
  const Passthrough = ({children}) => React.createElement(View, null, children);
  return {
    Map: Passthrough,
    Camera: Passthrough,
    UserLocation: Passthrough,
    Marker: Passthrough,
  };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const {View} = require('react-native');
  const BottomSheet = React.forwardRef(({children}, _ref) =>
    React.createElement(View, null, children),
  );
  const BottomSheetScrollView = ({children}) =>
    React.createElement(View, null, children);
  return {__esModule: true, default: BottomSheet, BottomSheetScrollView};
});
