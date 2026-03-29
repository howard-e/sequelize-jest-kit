const {
  sequelize,
  dataTypes,
  assertUniqueCompoundIndex,
  checkUniqueCompoundIndex
} = require('../../../src')
const IndexedModel = require('../../models/Indexed')

describe('src/checkUniqueCompoundIndex', () => {
  const Model = IndexedModel(sequelize, dataTypes)
  const instance = new Model()

  describe('happy path', () => {
    ;[['name', 'lunch']].forEach(checkUniqueCompoundIndex(instance))
  })

  describe('unhappy path', () => {
    it('fails the test', () => {
      expect(() => assertUniqueCompoundIndex(instance, 'no such index')).toThrow()
    })
  })
})
