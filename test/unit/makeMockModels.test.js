const { makeMockModels, listModels } = require('../../src')

describe('src/makeMockModels', () => {
  const doTests = suffix => {
    const mockModels = makeMockModels({ Fake: 'a fake' }, 'test/models', suffix)
    const models = listModels('test/models', suffix)

    const doTest = model => {
      it(`has the model ${model}`, () => {
        expect(mockModels).toHaveProperty(model)
      })
    }
    ;[...models, 'Fake'].forEach(doTest)

    it("adds '@noCallThru: true'", () => {
      expect(mockModels).toHaveProperty('@noCallThru', true)
    })
  }

  describe('default suffix', () => {
    doTests()
  })

  describe('custom suffix', () => {
    doTests('.js')
  })
})
