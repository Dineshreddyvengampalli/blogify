module.exports = {
  preset: 'ts-jest',
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which
  // coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.ts',
  ],

  coveragePathIgnorePatterns: ['src/migrations', 'src/seeds'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  transform: {
    '^.-+\\.ts?$': 'ts-jest',
  },

  testPathIgnorePatterns: ['dist'],

  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
