const { sequelize, dataTypes, assertIndex, checkNonUniqueIndex } = require('../../../src')
const IndexedModel = require('../../models/Indexed')

describe('src/checkNonUniqueIndex', () => {
  const Model = IndexedModel(sequelize, dataTypes)
  const instance = new Model()

  describe('happy path', () => {
    ;['name', ['coffee', 'lunch']].forEach(checkNonUniqueIndex(instance))
  })

  describe('unhappy path', () => {
    it('fails the test', () => {
      expect(() => assertIndex(instance, 'no name', false)).toThrow()
    })
  })
})
