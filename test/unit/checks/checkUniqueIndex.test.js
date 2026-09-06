const { sequelize, dataTypes, assertIndex, checkUniqueIndex } = require('../../../src')
const IndexedModel = require('../../models/Indexed')

describe('src/checkUniqueIndex', () => {
  const Model = IndexedModel(sequelize, dataTypes)
  const instance = new Model()

  describe('happy path', () => {
    ;['uuid', ['name', 'lunch']].forEach(checkUniqueIndex(instance))
  })

  describe('unhappy path', () => {
    it('fails when the index does not exist', () => {
      expect(() => assertIndex(instance, 'no such index', true)).toThrow()
    })

    it('fails when fields are split across different indexes', () => {
      const splitIndexes = {
        indexes: [
          { unique: true, fields: ['name', 'coffee'] },
          { unique: true, fields: ['uuid', 'lunch'] }
        ]
      }

      expect(() => assertIndex(splitIndexes, ['name', 'lunch'], true)).toThrow()
    })

    it('fails when fields are in the wrong order', () => {
      expect(() => assertIndex(instance, ['lunch', 'name'], true)).toThrow()
    })

    it('fails when the matching index has extra fields', () => {
      const indexWithExtraField = {
        indexes: [{ unique: true, fields: ['name', 'lunch', 'coffee'] }]
      }

      expect(() => assertIndex(indexWithExtraField, ['name', 'lunch'], true)).toThrow()
    })

    it('fails when concatenated field names are ambiguous', () => {
      const ambiguousIndex = {
        indexes: [{ unique: true, fields: ['ab', 'c'] }]
      }

      expect(() => assertIndex(ambiguousIndex, ['a', 'bc'], true)).toThrow()
    })
  })

  describe('Sequelize field objects', () => {
    it('matches fields by name', () => {
      const objectFields = {
        indexes: [
          {
            unique: true,
            fields: [{ name: 'name', length: 10 }, { name: 'lunch' }]
          }
        ]
      }

      expect(() => assertIndex(objectFields, ['name', 'lunch'], true)).not.toThrow()
    })
  })
})
