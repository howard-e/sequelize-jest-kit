const { sequelize, dataTypes, assertIndex, checkUniqueIndex } = require('../../../src')
const IndexedModel = require('../../models/Indexed')

describe('src/checkUniqueIndex', () => {
  const Model = IndexedModel(sequelize, dataTypes)
  const instance = new Model()

  describe('happy path', () => {
    ;['uuid', ['name', 'lunch']].forEach(checkUniqueIndex(instance))
  })

  describe('unhappy path', () => {
    it('fails the test', () => {
      expect(() => assertIndex(instance, 'no such index', true)).toThrow()
    })
  })
})
