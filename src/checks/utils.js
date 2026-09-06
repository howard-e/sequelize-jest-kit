/* global describe, it, expect */

const { serialCommaList } = require('../utils')

// if unique is true then expect index.unique to be true too, but
// if unique is false then index.unique can simply be be falsy
const matchUniqueness = (index, unique) => (unique ? index.unique === unique : !index.unique)
const prefix = unique => (unique ? 'n ' : ' non-')

const normalizeField = field => (typeof field === 'string' ? field : field.name)

const matchFields = (index, indexNames) =>
  Array.isArray(index.fields) &&
  index.fields.length === indexNames.length &&
  index.fields.every((field, i) => normalizeField(field) === indexNames[i])

/**
 * Same assertions as {@link checkIndex}, without registering tests. For use in tests or custom runners.
 */
const assertIndex = (instance, indexNameOrNames, unique = false) => {
  const indexNames = Array.isArray(indexNameOrNames) ? indexNameOrNames : [indexNameOrNames]
  const matchingIndex = Array.isArray(instance.indexes)
    ? instance.indexes.find(
        index => matchUniqueness(index, unique) && matchFields(index, indexNames)
      )
    : undefined

  expect(matchingIndex).toBeDefined()
}

const checkSingleIndex = (instance, unique) => indexName => {
  it(`indexed a${prefix(unique)}unique ${indexName}`, () => {
    assertIndex(instance, indexName, unique)
  })
}

const checkAllIndexes = (instance, unique) => indexNames => {
  describe(`indexed a${prefix(unique)}unique composite of [${serialCommaList(indexNames)}]`, () => {
    it('matches all fields in order', () => {
      assertIndex(instance, indexNames, unique)
    })
  })
}

const checkIndex = (instance, indexNameOrNames, unique = false) =>
  (Array.isArray(indexNameOrNames) ? checkAllIndexes : checkSingleIndex)(
    instance,
    unique
  )(indexNameOrNames)

module.exports = { checkIndex, assertIndex }
