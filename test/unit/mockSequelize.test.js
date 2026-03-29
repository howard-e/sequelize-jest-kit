const Sequelize = require('../../src/mockSequelize')
const DataTypes = require('../../src/dataTypes')

describe('src/mockSequelize', () => {
  it('has Model', () => {
    expect(Sequelize).toHaveProperty('Model')
  })

  it('Model is a class', () => {
    expect(typeof Sequelize.Model).toBe('function')
    expect(typeof Sequelize.Model.constructor).toBe('function')
  })

  it('Model has a static init function', () => {
    expect(typeof Sequelize.Model.init).toBe('function')
  })

  it('has DataTypes', () => {
    expect(Sequelize).toHaveProperty('DataTypes', DataTypes)
  })
})
