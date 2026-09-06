/* global it */

const { serialCommaList } = require('../utils')
const { assertIndex } = require('./utils')

/**
 * @deprecated both `checkUniqueIndex` and `checkNonUniqueIndex` will now check for either simple or composite indexes.
 */
const assertUniqueCompoundIndex = (instance, indexes) => {
  assertIndex(instance, indexes, true)
}

const checkUniqueCompoundIndex = instance => indexes => {
  it(`indexed an unique index of ${serialCommaList(indexes)}`, () => {
    assertUniqueCompoundIndex(instance, indexes)
  })
}

checkUniqueCompoundIndex.assertUniqueCompoundIndex = assertUniqueCompoundIndex

module.exports = checkUniqueCompoundIndex
