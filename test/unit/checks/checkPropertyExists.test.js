const { sequelize, dataTypes, assertPropertyExists, checkPropertyExists } = require('../../../src')
const SimpleModel = require('../../models/Simple')

describe('src/checkPropertyExists', () => {
  const Model = SimpleModel(sequelize, dataTypes)
  const instance = new Model()

  describe('happy path', () => {
    ;['name'].forEach(checkPropertyExists(instance))
  })

  describe('unhappy path', () => {
    it('fails the test', () => {
      expect(() => assertPropertyExists(instance, 'no name')).toThrow()
    })
  })
})
