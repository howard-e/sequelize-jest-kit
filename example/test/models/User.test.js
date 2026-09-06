const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkNonUniqueIndex,
  checkPropertyExists,
  checkHookDefined
} = require('sequelize-jest-kit')

const UserModel = require('../../src/models/User')

describe('example/src/models/User', () => {
  const User = UserModel(sequelize, dataTypes)
  const user = new User()

  checkModelName(User)('User')

  describe('properties', () => {
    ;['age', 'firstName', 'lastName', 'email', 'token'].forEach(checkPropertyExists(user))
  })

  describe('hooks', () => {
    ;['beforeValidate'].forEach(checkHookDefined(user))
  })

  describe('associations', () => {
    const Company = 'some dummy company'
    const Image = 'some dummy image'

    beforeAll(() => {
      User.associate({ Company, Image })
    })

    it('defined a belongsTo association with Company', () => {
      expect(User.belongsTo).toHaveBeenCalledWith(Company)
    })

    it("defined a hasOne association with Image as 'profilePic'", () => {
      expect(User.hasOne).toHaveBeenCalledWith(Image, {
        as: 'profilePic'
      })
    })
  })

  describe('indexes', () => {
    describe('unique', () => {
      ;['email', 'token'].forEach(checkUniqueIndex(user))
    })

    describe('non unique (and also composite in this example)', () => {
      ;[['firstName', 'lastName']].forEach(checkNonUniqueIndex(user))
    })
  })
})
