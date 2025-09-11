/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testTimeout: 30000,
  testMatch: ['<rootDir>/test/e2e/**/*.e2e-spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@interface/(.*)$': '<rootDir>/src/interface/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.(ts|js)', '!src/**/*.d.ts'],
  coverageDirectory: './coverage/e2e',
  coverageReporters: ['text', 'lcov'],
};
