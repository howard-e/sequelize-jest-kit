const model = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      age: {
        type: DataTypes.INTEGER.UNSIGNED
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        lowercase: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      token: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['token'] },
        { unique: false, fields: ['firstName', 'lastName'] }
      ]
    }
  )

  User.beforeValidate(user => {
    if (user.email) {
      user.email = user.email.toLowerCase()
    }
  })

  User.associate = ({ Company, Image }) => {
    User.belongsTo(Company)
    User.hasOne(Image, { as: 'profilePic' })
  }

  return User
}

module.exports = model
