/* global describe, it, expect */

const { serialCommaList } = require('../utils')

// if unique is true then expect index.unique to be true too, but
// if unique is false then index.unique can simply be be falsy
const matchUniqueness = (index, unique) => (unique ? index.unique === unique : !index.unique)
const prefix = unique => (unique ? 'n ' : ' non-')

const assertIndexAtPosition = (instance, indexNames, unique, i) => {
  const indexName = indexNames[i]
  expect(
    instance.indexes.find(index => matchUniqueness(index, unique) && index.fields[i] === indexName)
  ).toBeDefined()
}

const assertSingleIndexName = (instance, indexName, unique) => {
  expect(
    instance.indexes.find(index => matchUniqueness(index, unique) && index.fields[0] === indexName)
  ).toBeDefined()
}

/**
 * Same assertions as {@link checkIndex}, without registering tests. For use in tests or custom runners.
 */
const assertIndex = (instance, indexNameOrNames, unique = false) => {
  if (Array.isArray(indexNameOrNames)) {
    indexNameOrNames.forEach((_, i) => {
      assertIndexAtPosition(instance, indexNameOrNames, unique, i)
    })
  } else {
    assertSingleIndexName(instance, indexNameOrNames, unique)
  }
}

const checkSingleIndex = (instance, unique) => indexName => {
  it(`indexed a${prefix(unique)}unique ${indexName}`, () => {
    assertSingleIndexName(instance, indexName, unique)
  })
}

const checkAllIndexes = (instance, unique) => indexNames => {
  describe(`indexed a${prefix(unique)}unique composite of [${serialCommaList(indexNames)}]`, () => {
    indexNames.forEach((indexName, i) => {
      it(`includes ${indexName} at ${i}`, () => {
        assertIndexAtPosition(instance, indexNames, unique, i)
      })
    })
  })
}

const checkIndex = (instance, indexNameOrNames, unique = false) =>
  (Array.isArray(indexNameOrNames) ? checkAllIndexes : checkSingleIndex)(
    instance,
    unique
  )(indexNameOrNames)

module.exports = { checkIndex, assertIndex }
