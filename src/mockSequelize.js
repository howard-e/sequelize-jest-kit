const { fn } = require('jest-mock')

const DataTypes = require('./dataTypes')

class Model {}
Model.init = fn()
Model.belongsToMany = fn()
Model.belongsTo = fn()
Model.hasMany = fn()
Model.hasOne = fn()

module.exports = { Model, DataTypes }
