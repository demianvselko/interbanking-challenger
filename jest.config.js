/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'src',
    testRegex: '.*\\.(spec|test)\\.ts$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        '^@application/(.*)$': '<rootDir>/application/$1',
        '^@core/(.*)$': '<rootDir>/core/$1',
        '^@framework/(.*)$': '<rootDir>/framework/$1',
        '^@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
        '^@shared/(.*)$': '<rootDir>/shared/$1',
    },
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.(ts|js)',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/test/**'
    ],
    coverageDirectory: '<rootDir>/../coverage',
};
