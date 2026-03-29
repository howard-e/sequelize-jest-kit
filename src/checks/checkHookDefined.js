/* global it, expect */

const assertHookDefined = (instance, hookName) => {
  expect(typeof instance.hooks[hookName]).toBe('function')
}

const checkHookDefined = instance => hookName => {
  it(`defined the ${hookName} hook`, () => {
    assertHookDefined(instance, hookName)
  })
}

checkHookDefined.assertHookDefined = assertHookDefined

module.exports = checkHookDefined
