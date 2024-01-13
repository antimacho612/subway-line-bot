/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['test/**/*+(spec|test).+(ts|tsx|js)'],
};

module.exports = config;
