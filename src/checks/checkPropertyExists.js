/* global it, expect */

const assertPropertyExists = (instance, propName) => {
  expect(instance).toHaveProperty(propName)
}

const checkPropertyExists = instance => propName => {
  it(`has property ${propName}`, () => {
    assertPropertyExists(instance, propName)
  })
}

checkPropertyExists.assertPropertyExists = assertPropertyExists

module.exports = checkPropertyExists
