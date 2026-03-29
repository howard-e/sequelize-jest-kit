const Noop = require('../../../src/types/Noop')

describe('src/types/Noop', () => {
  it('is a function', () => {
    expect(typeof Noop).toBe('function')
  })

  it('returns itself', () => {
    expect(Noop()).toBe(Noop)
  })
})
