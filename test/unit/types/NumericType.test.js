const NumericType = require('../../../src/types/NumericType')

describe('src/types/NumericType', () => {
  it('is a function', () => {
    expect(typeof NumericType).toBe('function')
  })

  it('returns itself', () => {
    expect(NumericType()).toBe(NumericType)
  })

  it('has property UNSIGNED', () => {
    expect(NumericType).toHaveProperty('UNSIGNED', NumericType)
  })

  it('has property ZEROFILL', () => {
    expect(NumericType).toHaveProperty('ZEROFILL', NumericType)
  })
})
