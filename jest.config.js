/** @type {import('jest').Config} */
const config = {
  verbose: true,
  forceExit: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ['**/*.test.ts'],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};

module.exports = config;
