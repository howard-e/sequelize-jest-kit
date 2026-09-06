const { sequelize, dataTypes, checkModelName, checkPropertyExists } = require('sequelize-jest-kit')

const CompanyModel = require('../../src/models/Company')

describe('example/src/models/Company', () => {
  const Company = CompanyModel(sequelize, dataTypes)
  const company = new Company()

  checkModelName(Company)('Company')

  describe('properties', () => {
    ;['name'].forEach(checkPropertyExists(company))
  })

  describe('associations', () => {
    const User = 'some dummy user'
    const Category = 'some dummy category'

    beforeAll(() => {
      Company.associate({ User, Category })
    })

    it("defined a hasMany association with User as 'employees'", () => {
      expect(Company.hasMany).toHaveBeenCalledWith(User, {
        as: 'employees'
      })
    })

    it("defined a belongsToMany association with Category through CategoriesCompanies as 'categories'", () => {
      expect(Company.belongsToMany).toHaveBeenCalledWith(Category, {
        through: 'CategoriesCompanies',
        as: 'categories'
      })
    })
  })
})
