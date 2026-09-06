const { sequelize, dataTypes, assertIndex, checkNonUniqueIndex } = require('../../../src')
const IndexedModel = require('../../models/Indexed')

describe('src/checkNonUniqueIndex', () => {
  const Model = IndexedModel(sequelize, dataTypes)
  const instance = new Model()

  describe('happy path', () => {
    ;['name', ['coffee', 'lunch']].forEach(checkNonUniqueIndex(instance))

    it('defaults to matching non-unique indexes', () => {
      expect(() => assertIndex(instance, 'name')).not.toThrow()
    })
  })

  describe('unhappy path', () => {
    it('fails when the index does not exist', () => {
      expect(() => assertIndex(instance, 'no name', false)).toThrow()
    })

    it('fails when fields are split across different indexes', () => {
      const splitIndexes = {
        indexes: [{ fields: ['coffee', 'name'] }, { fields: ['uuid', 'lunch'] }]
      }

      expect(() => assertIndex(splitIndexes, ['coffee', 'lunch'], false)).toThrow()
    })

    it('fails when only a composite index starts with the requested field', () => {
      const compositeOnly = {
        indexes: [{ fields: ['name', 'lunch'] }]
      }

      expect(() => assertIndex(compositeOnly, 'name', false)).toThrow()
    })

    it('fails when the matching index is unique', () => {
      expect(() => assertIndex(instance, ['name', 'lunch'], false)).toThrow()
    })

    it('fails with an assertion when indexes are not defined', () => {
      expect(() => assertIndex({}, 'name', false)).toThrow()
    })

    it('fails when index fields are not an array', () => {
      const invalidFields = {
        indexes: [{ fields: 'name' }]
      }

      expect(() => assertIndex(invalidFields, 'name', false)).toThrow()
    })
  })

  describe('Sequelize field objects', () => {
    it('matches fields by name', () => {
      const objectFields = {
        indexes: [{ fields: [{ name: 'coffee' }, { name: 'lunch', order: 'DESC' }] }]
      }

      expect(() => assertIndex(objectFields, ['coffee', 'lunch'], false)).not.toThrow()
    })
  })
})
