import { fn } from 'jest-mock'

import kit = require('../..')

import { dataTypes as namedDataTypes, sequelize as namedSequelize } from '../..'

const beforeValidate: kit.Hook = instance => instance
namedSequelize.define('NamedImport', { id: { type: namedDataTypes.INTEGER } })
const User = kit.sequelize.define(
  'User',
  {
    email: {
      allowNull: false,
      type: kit.dataTypes.STRING
    }
  },
  {
    hooks: { beforeValidate },
    indexes: [{ fields: ['email'], unique: true }]
  }
)

const user = new User()
user.hooks.beforeValidate?.(user)
user.update.mockResolvedValue(user)
User.findOne.mockResolvedValue(user)
User.afterCreate(instance => instance)
User.addHook('afterValidate', instance => instance)
User.addHook('afterCreate', 'namedHook', instance => instance)

kit.assertHookDefined(user, 'beforeValidate')
kit.assertIndex(user, 'email', true)
kit.assertModelName(User, 'User')
kit.assertPropertyExists(user, 'email')
kit.assertUniqueCompoundIndex(user, ['email'])
kit.checkHookDefined(user)('beforeValidate')
kit.checkModelName(User)('User')
kit.checkNonUniqueIndex(user)(['firstName', 'lastName'])
kit.checkPropertyExists(user)('email')
kit.checkUniqueCompoundIndex(user)(['email'])
kit.checkUniqueIndex(user)('email')

kit.dataTypes.STRING(255).BINARY
kit.dataTypes.INTEGER(11).UNSIGNED.ZEROFILL
kit.dataTypes.Deferrable.INITIALLY_DEFERRED
kit.sequelize.fn('COUNT', kit.sequelize.col('id'))

kit.Sequelize.Model.init.mockClear()
kit.Sequelize.Model.belongsTo.mockClear()
kit.Sequelize.DataTypes.UUID

const mockModels = kit.makeMockModels(
  {
    User: {
      findOne: fn<() => Promise<typeof user | undefined>>()
    }
  },
  'models',
  '.ts'
)

mockModels.User.findOne()
mockModels['@noCallThru']
kit.listModels('models', '.ts')

// @ts-expect-error JSONTYPE is not part of the Sequelize 6 DataTypes contract.
kit.dataTypes.JSONTYPE

// @ts-expect-error Object-form index fields require a name.
kit.assertIndex({ indexes: [{ fields: [{ attribute: 'email' }] }] }, 'email')
