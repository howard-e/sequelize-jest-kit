jest.mock('../../src/models', () => {
  const { makeMockModels } = require('sequelize-jest-kit')
  return makeMockModels({ User: { findOne: jest.fn() } }, 'example/src/models')
})

const mockModels = require('../../src/models')
const { User } = mockModels
const save = require('../../src/utils/save')

describe('example/src/utils/save', () => {
  const id = 1
  const data = {
    firstName: 'Testy',
    lastName: 'McTestFace',
    email: 'testy.mctestface.test.tes',
    token: 'some-token'
  }
  const fakeUser = { id, ...data, update: jest.fn() }

  let result

  it('includes the rest of the application models', () => {
    expect(mockModels).toEqual(
      expect.objectContaining({
        Category: 'Category',
        Company: 'Company',
        Image: 'Image',
        User,
        '@noCallThru': true
      })
    )
  })

  describe('user does not exist', () => {
    beforeEach(async () => {
      User.findOne.mockResolvedValue(undefined)
      result = await save({ id, ...data })
    })

    it('called User.findOne', () => {
      expect(User.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: { id } }))
    })

    it("didn't call user.update", () => {
      expect(fakeUser.update).not.toHaveBeenCalled()
    })

    it('returned null', () => {
      expect(result).toBeNull()
    })
  })

  describe('user exists', () => {
    beforeEach(async () => {
      fakeUser.update.mockResolvedValue(fakeUser)
      User.findOne.mockResolvedValue(fakeUser)
      result = await save({ id, ...data })
    })

    it('called User.findOne', () => {
      expect(User.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: { id } }))
    })

    it('called user.update', () => {
      expect(fakeUser.update).toHaveBeenCalledWith(expect.objectContaining(data))
    })

    it('returned the user', () => {
      expect(result).toEqual(fakeUser)
    })
  })
})
