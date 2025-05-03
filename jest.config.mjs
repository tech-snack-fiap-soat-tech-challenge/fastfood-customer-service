const config = {
  rootDir: './src',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
  setupFilesAfterEnv: ['../testUtils.ts'],
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.ts'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/$1',
    '^@/setup/(.*)$': '<rootDir>/setup/$1',
    '^@/common/(.*)$': '<rootDir>/common/$1',
    '^@/modules/(.*)$': '<rootDir>/modules/customer/$1',
    '^@/api/(.*)$': '<rootDir>/modules/customer/api/$1',
    '^@/core/(.*)$': '<rootDir>/modules/customer/core/$1',
    '^@/infra/(.*)$': '<rootDir>/modules/customer/infra/$1',
  },
};

export default config;
