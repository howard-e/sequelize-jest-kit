const sequelize = require('../../src/sequelize')
const staticMethods = require('../../src/constants/staticMethods')

describe('src/sequelize', () => {
  it('has define', () => {
    expect(sequelize).toHaveProperty('define')
    expect(typeof sequelize.define).toBe('function')
  })

  staticMethods.forEach(method => {
    it(`has static method ${method}`, () => {
      expect(typeof sequelize[method]).toBe('function')
    })
  })
})
