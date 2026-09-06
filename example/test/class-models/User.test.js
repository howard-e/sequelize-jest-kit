jest.mock(
  'sequelize',
  () => {
    const { Sequelize } = require('sequelize-jest-kit')
    return Sequelize
  },
  { virtual: true }
)

const { sequelize, Sequelize } = require('sequelize-jest-kit')
const UserFactory = require('../../src/class-models/User')

describe('example/src/class-models/User', () => {
  const { DataTypes } = Sequelize
  let User

  beforeAll(() => {
    User = UserFactory(sequelize)
  })

  afterEach(() => {
    User.init.mockClear()
  })

  it('called User.init with the correct parameters', () => {
    expect(User.init).toHaveBeenCalledWith(
      {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING
      },
      {
        sequelize,
        modelName: 'User'
      }
    )
  })
})
