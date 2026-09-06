module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/unitTestHelper.js'],
  moduleNameMapper: {
    '^sequelize-jest-kit$': '<rootDir>/src/index.js'
  }
}
