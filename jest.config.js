module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/unitTestHelper.js'],
  moduleNameMapper: {
    '^sequelize-jest-kit$': '<rootDir>/src/index.js'
  }
}
