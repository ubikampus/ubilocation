module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false,  // disable type checking, leave that to webpack
    }
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: 'Test.ts$',
};
