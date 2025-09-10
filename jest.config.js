module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['**/*.spec.ts', '**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        '^@application/(.*)$': '<rootDir>/application/$1',
        '^@domain/(.*)$': '<rootDir>/domain/$1',
        '^@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
        '^@interface/(.*)$': '<rootDir>/interface/$1',
        '^@shared/(.*)$': '<rootDir>/shared/$1'
    },
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.(ts|js)',
        '!**/*.d.ts',
        '!**/node_modules/**'
    ],
    coverageDirectory: '../coverage'
};
