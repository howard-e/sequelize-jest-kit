const models = require('../../src/models')

describe('example/src/models', () => {
  it('exports the application model factories', () => {
    expect(Object.keys(models).sort()).toEqual(['Category', 'Company', 'Image', 'User'])
  })
})
