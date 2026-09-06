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
    it('fails when the index does not exist', () => {
      expect(() => assertUniqueCompoundIndex(instance, ['no such index'])).toThrow()
    })

    it('does not match ambiguous concatenated field names', () => {
      const ambiguousIndex = {
        indexes: [{ unique: true, fields: ['ab', 'c'] }]
      }

      expect(() => assertUniqueCompoundIndex(ambiguousIndex, ['a', 'bc'])).toThrow()
    })
  })
})
