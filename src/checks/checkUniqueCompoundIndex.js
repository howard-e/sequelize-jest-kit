/* global it, expect */

const { serialCommaList } = require('../utils')

/**
 * @deprecated both `checkUniqueIndex` and `checkNonUniqueIndex` will now check for either simple or composite indexes.
 */
const assertUniqueCompoundIndex = (instance, indexes) => {
  expect(
    instance.indexes.find(
      index => index.unique === true && index.fields.join('') === indexes.join('')
    )
  ).toBeDefined()
}

const checkUniqueCompoundIndex = instance => indexes => {
  it(`indexed an unique index of ${serialCommaList(indexes)}`, () => {
    assertUniqueCompoundIndex(instance, indexes)
  })
}

checkUniqueCompoundIndex.assertUniqueCompoundIndex = assertUniqueCompoundIndex

module.exports = checkUniqueCompoundIndex
