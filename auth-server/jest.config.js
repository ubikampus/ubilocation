module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.ts"],
  globals: {
    DEFINE_NODE_ENV: "test",
    "ts-jest": {
      diagnostics: true // disable type checking, leave that to webpack
    },
  },
  preset: "ts-jest",
  testRegex: "Test.ts$"
};
