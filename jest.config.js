module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverageFrom: [
    'src/services/**/*.ts',
    'src/utils/**/*.ts',
    'src/hooks/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 50,
      lines: 60,
      statements: 60,
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      'react-native' +
      '|@react-native' +
      '|@react-native-async-storage' +
      '|@maplibre' +
      '|@gorhom' +
      '|react-native-geolocation-service' +
      '|react-native-gesture-handler' +
      '|react-native-reanimated' +
      '|react-native-worklets' +
      '|react-native-safe-area-context' +
      '|react-native-localize' +
      '|react-native-permissions' +
      '))',
  ],
};
