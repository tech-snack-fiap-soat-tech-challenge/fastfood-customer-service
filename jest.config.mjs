const config = {
  rootDir: './src',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
  setupFilesAfterEnv: ['../test-setup.config.mjs'],
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/$1',
    '^@/setup/(.*)$': '<rootDir>/setup/$1',
    '^@/common/(.*)$': '<rootDir>/common/$1',
    '^@/api/(.*)$': '<rootDir>/customer/api/$1',
    '^@/domain/(.*)$': '<rootDir>/customer/core/domain/$1',
    '^@/application/(.*)$': '<rootDir>/customer/core/application/$1',
    '^@/infrastructure/(.*)$': '<rootDir>/customer/infrastructure/$1',
  },
};

export default config;
