const config = {
  rootDir: '.',
  preset: 'ts-jest',
  transform: { '^.+\\.ts$': 'ts-jest' },
  testMatch: ['**/__tests__/**/*.spec.ts'],
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  setupFilesAfterEnv: ['<rootDir>/test/test-setup.ts'],

  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/**/__tests__/**/*'],
  coverageThreshold: { global: { branches: 80, functions: 80, lines: 80, statements: 80 } },
  coveragePathIgnorePatterns: ['<rootDir>/src/main.ts', '<rootDir>/src/setup', '\\.module\\.ts'],

  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/src/$1',
    '^@/domain/(.*)$': ['<rootDir>/src/customer/core/domain/$1', '<rootDir>/src/common/domain/$1'],
    '^@/application/(.*)$': ['<rootDir>/src/customer/core/application/$1', '<rootDir>/src/common/application/$1'],
    '^@/presentation/(.*)$': ['<rootDir>/src/customer/api/$1', '<rootDir>/src/common/api/$1'],
    '^@/infrastructure/(.*)$': ['<rootDir>/src/customer/infrastructure/$1', '<rootDir>/src/common/infrastructure/$1'],
    '^@/fixtures/(.*)$': ['<rootDir>src/customer/__fixtures__/$1', '<rootDir>/src/common/__fixtures__/$1'],
  },
};

export default config;
