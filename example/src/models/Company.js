const model = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  })

  Company.associate = ({ User, Category }) => {
    Company.hasMany(User, { as: 'employees' })
    Company.belongsToMany(Category, {
      through: 'CategoriesCompanies',
      as: 'categories'
    })
  }

  return Company
}

module.exports = model
