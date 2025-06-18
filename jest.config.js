export default {
  extensionsToTreatAsEsm: ['.ts', '.mts'], // Treat .ts and .mts files as ES modules
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm', // This preset handles most ESM settings for ts-jest
  transform: {
    // Redundant if preset is working, but can be explicit:
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    // This mapper helps Jest resolve .js extensions in imports to their .ts counterparts
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|mts)$', // Adjusted to common .ts/.mts
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!src/**/*.d.mts',
    '!src/example.ts', // Exclude example.ts from coverage
  ],
};
