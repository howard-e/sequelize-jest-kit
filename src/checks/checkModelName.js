/* global it, expect */

const assertModelName = (model, modelName) => {
  expect(model.modelName).toBe(modelName)
}

const checkModelName = model => modelName => {
  it(`is named '${modelName}'`, () => {
    assertModelName(model, modelName)
  })
}

checkModelName.assertModelName = assertModelName

module.exports = checkModelName
