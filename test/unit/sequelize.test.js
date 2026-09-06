const sequelize = require('../../src/sequelize')
const staticMethods = require('../../src/constants/staticMethods')

describe('src/sequelize', () => {
  it('has define', () => {
    expect(sequelize).toHaveProperty('define')
    expect(typeof sequelize.define).toBe('function')
  })

  it('attaches option-defined hooks immediately', () => {
    const beforeValidate = jest.fn()
    const Model = sequelize.define('Hooked', {}, { hooks: { beforeValidate } })

    expect(new Model().hooks.beforeValidate).toBe(beforeValidate)
  })

  it('copies the option-defined hook map', () => {
    const beforeValidate = jest.fn()
    const optionHooks = { beforeValidate }
    const Model = sequelize.define('Hooked', {}, { hooks: optionHooks })

    expect(Model.prototype.hooks).not.toBe(optionHooks)
  })

  it('does not mutate option-defined hooks when registering more hooks', () => {
    const beforeValidate = jest.fn()
    const optionHooks = { beforeValidate }
    const Model = sequelize.define('Hooked', {}, { hooks: optionHooks })

    Model.addHook('afterValidate', jest.fn())

    expect(optionHooks).toEqual({ beforeValidate })
  })

  staticMethods.forEach(method => {
    it(`has static method ${method}`, () => {
      expect(typeof sequelize[method]).toBe('function')
    })
  })
})
