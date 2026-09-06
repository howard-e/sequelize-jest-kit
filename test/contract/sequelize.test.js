const Sequelize = require('sequelize')
const { hooks: sequelizeHooks } = require('sequelize/lib/hooks')

const dataTypes = require('../../src/dataTypes')
const mockSequelize = require('../../src/mockSequelize')
const sequelize = require('../../src/sequelize')
const hooks = require('../../src/constants/hooks')
const staticMethods = require('../../src/constants/staticMethods')
const { syncMethods, asyncMethods } = require('../../src/constants/staticModelMethods')

const expectFunctions = (target, names) => {
  names.forEach(name => {
    expect(target).toHaveProperty(name)
    expect(typeof target[name]).toBe('function')
  })
}

describe('Sequelize 6 contract', () => {
  it('tracks the complete Sequelize hook contract', () => {
    expect(hooks).toEqual(Object.keys(sequelizeHooks))
  })

  it('only mocks Sequelize static helpers that exist', () => {
    expectFunctions(Sequelize, staticMethods)
  })

  it('only mocks Sequelize Model static methods that exist', () => {
    expectFunctions(Sequelize.Model, [...syncMethods, ...asyncMethods])
  })

  it('only exposes DataTypes that Sequelize exposes', () => {
    const typeNames = Object.keys(dataTypes).filter(name => name !== 'Deferrable')
    const unsupportedTypes = typeNames.filter(name => !(name in Sequelize.DataTypes))

    expect(unsupportedTypes).toEqual([])
  })

  it('tracks the Sequelize Deferrable contract', () => {
    expect(Object.keys(dataTypes.Deferrable).sort()).toEqual(
      Object.keys(Sequelize.Deferrable).sort()
    )
  })

  it('keeps the lightweight Model facade compatible with Sequelize Model', () => {
    const standardClassProperties = new Set(['length', 'name', 'prototype'])
    const mockedMethods = Object.getOwnPropertyNames(mockSequelize.Model).filter(
      name => !standardClassProperties.has(name) && typeof mockSequelize.Model[name] === 'function'
    )

    expectFunctions(Sequelize.Model, mockedMethods)
  })

  it('keeps mocked model instance methods compatible with Sequelize Model', () => {
    const model = sequelize.define('ContractModel', {})
    const mockedMethods = Object.getOwnPropertyNames(model.prototype).filter(
      name => name !== 'constructor' && typeof model.prototype[name] === 'function'
    )

    expectFunctions(Sequelize.Model.prototype, mockedMethods)
  })
})
