module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: 'Test.ts$',
  globals: {
    'ts-jest': {
      diagnostics: false,  // disable type checking, leave that to webpack
    }
  }
};
