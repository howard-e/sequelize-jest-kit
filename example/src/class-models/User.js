const { Model, DataTypes } = require('sequelize')

const factory = sequelize => {
  class User extends Model {}

  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING
    },
    { sequelize, modelName: 'User' }
  )

  return User
}

module.exports = factory
