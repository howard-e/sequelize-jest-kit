import type { Mock } from 'jest-mock'

declare namespace SequelizeJestKit {
  type AnyFunction = (...args: any[]) => any
  type Hook = (...args: any[]) => unknown
  type MockFunction = Mock<AnyFunction>

  type HookName =
    | 'beforeValidate'
    | 'afterValidate'
    | 'validationFailed'
    | 'beforeCreate'
    | 'afterCreate'
    | 'beforeDestroy'
    | 'afterDestroy'
    | 'beforeRestore'
    | 'afterRestore'
    | 'beforeUpdate'
    | 'afterUpdate'
    | 'beforeSave'
    | 'afterSave'
    | 'beforeUpsert'
    | 'afterUpsert'
    | 'beforeBulkCreate'
    | 'afterBulkCreate'
    | 'beforeBulkDestroy'
    | 'afterBulkDestroy'
    | 'beforeBulkRestore'
    | 'afterBulkRestore'
    | 'beforeBulkUpdate'
    | 'afterBulkUpdate'
    | 'beforeFind'
    | 'beforeFindAfterExpandIncludeAll'
    | 'beforeFindAfterOptions'
    | 'afterFind'
    | 'beforeCount'
    | 'beforeDefine'
    | 'afterDefine'
    | 'beforeInit'
    | 'afterInit'
    | 'beforeAssociate'
    | 'afterAssociate'
    | 'beforeConnect'
    | 'afterConnect'
    | 'beforeDisconnect'
    | 'afterDisconnect'
    | 'beforePoolAcquire'
    | 'afterPoolAcquire'
    | 'beforeSync'
    | 'afterSync'
    | 'beforeBulkSync'
    | 'afterBulkSync'
    | 'beforeQuery'
    | 'afterQuery'

  type ModelMethodName =
    | 'addScope'
    | 'belongsTo'
    | 'belongsToMany'
    | 'build'
    | 'getTableName'
    | 'hasMany'
    | 'hasOne'
    | 'init'
    | 'removeAttribute'
    | 'schema'
    | 'scope'
    | 'unscoped'
    | 'aggregate'
    | 'bulkCreate'
    | 'count'
    | 'create'
    | 'decrement'
    | 'describe'
    | 'destroy'
    | 'drop'
    | 'findAll'
    | 'findAndCountAll'
    | 'findByPk'
    | 'findCreateFind'
    | 'findOne'
    | 'findOrBuild'
    | 'findOrCreate'
    | 'increment'
    | 'max'
    | 'min'
    | 'restore'
    | 'sum'
    | 'sync'
    | 'truncate'
    | 'update'
    | 'upsert'

  type HookMap = Partial<Record<HookName, Hook>>

  interface IndexField {
    name: string
  }

  interface ModelIndex {
    fields: ReadonlyArray<string | IndexField>
    unique?: boolean
    [option: string]: unknown
  }

  interface IndexContainer {
    indexes?: ReadonlyArray<ModelIndex>
  }

  interface HookContainer {
    hooks: HookMap
  }

  interface NamedModel {
    modelName: string
  }

  interface DefineOptions {
    hooks?: HookMap
    indexes?: ReadonlyArray<ModelIndex>
    scopes?: unknown
    validate?: unknown
    [option: string]: unknown
  }

  interface MockModelInstance extends HookContainer, IndexContainer {
    reload: MockFunction
    set: MockFunction
    update: MockFunction
    scopes?: unknown
    validate?: unknown
  }

  interface AddHook {
    (hookType: HookName, hook: Hook): void
    (hookType: HookName, name: string, hook: Hook): void
  }

  type MockModelConstructor<TDefinition extends object = Record<string, unknown>> = {
    new (): MockModelInstance & TDefinition
    readonly modelName: string
    addHook: AddHook
    hook: AddHook
    isHierarchy: MockFunction
  } & Record<HookName, (hook: Hook) => void> &
    Record<ModelMethodName, MockFunction> &
    Record<string, any>

  interface SequelizeFacade {
    define<TDefinition extends object = Record<string, unknown>>(
      modelName: string,
      modelDefinition: TDefinition,
      options?: DefineOptions
    ): MockModelConstructor<TDefinition>
    and: MockFunction
    cast: MockFunction
    col: MockFunction
    fn: MockFunction
    json: MockFunction
    literal: MockFunction
    or: MockFunction
    useCLS: MockFunction
    where: MockFunction
  }

  interface BasicDataType {
    (...args: unknown[]): BasicDataType
  }

  interface NumericDataType {
    (...args: unknown[]): NumericDataType
    UNSIGNED: NumericDataType
    ZEROFILL: NumericDataType
  }

  interface StringDataType {
    (...args: unknown[]): StringDataType
    BINARY: StringDataType
  }

  interface Deferrable {
    INITIALLY_IMMEDIATE: 'INITIALLY_IMMEDIATE'
    INITIALLY_DEFERRED: 'INITIALLY_DEFERRED'
    NOT: 'NOT'
    SET_DEFERRED: 'SET_DEFERRED'
    SET_IMMEDIATE: 'SET_IMMEDIATE'
  }

  interface DataTypes {
    ABSTRACT: BasicDataType
    ARRAY: BasicDataType
    BIGINT: NumericDataType
    BLOB: BasicDataType
    BOOLEAN: BasicDataType
    CHAR: StringDataType
    CIDR: BasicDataType
    DATE: BasicDataType
    DATEONLY: BasicDataType
    DECIMAL: NumericDataType
    DOUBLE: NumericDataType
    'DOUBLE PRECISION': NumericDataType
    ENUM: BasicDataType
    FLOAT: NumericDataType
    GEOGRAPHY: BasicDataType
    GEOMETRY: BasicDataType
    HSTORE: BasicDataType
    INET: BasicDataType
    INTEGER: NumericDataType
    JSON: BasicDataType
    JSONB: BasicDataType
    MACADDR: BasicDataType
    MEDIUMINT: BasicDataType
    NOW: BasicDataType
    NUMBER: BasicDataType
    NUMERIC: BasicDataType
    RANGE: BasicDataType
    REAL: NumericDataType
    SMALLINT: NumericDataType
    STRING: StringDataType
    TEXT: BasicDataType
    TIME: BasicDataType
    TINYINT: NumericDataType
    UUID: BasicDataType
    UUIDV1: BasicDataType
    UUIDV4: BasicDataType
    VIRTUAL: BasicDataType
    Deferrable: Deferrable
  }

  class Model {
    static init: MockFunction
    static belongsToMany: MockFunction
    static belongsTo: MockFunction
    static hasMany: MockFunction
    static hasOne: MockFunction
  }

  interface CheckHookDefined {
    (instance: HookContainer): (hookName: HookName) => void
    assertHookDefined(instance: HookContainer, hookName: HookName): void
  }

  interface CheckModelName {
    (model: NamedModel): (modelName: string) => void
    assertModelName(model: NamedModel, modelName: string): void
  }

  interface CheckPropertyExists {
    (instance: object): (propertyName: string) => void
    assertPropertyExists(instance: object, propertyName: string): void
  }

  interface CheckUniqueCompoundIndex {
    (instance: IndexContainer): (indexNames: ReadonlyArray<string>) => void
    assertUniqueCompoundIndex(instance: IndexContainer, indexNames: ReadonlyArray<string>): void
  }

  const assertHookDefined: (instance: HookContainer, hookName: HookName) => void
  const assertIndex: (
    instance: IndexContainer,
    indexNameOrNames: string | ReadonlyArray<string>,
    unique?: boolean
  ) => void
  const assertModelName: (model: NamedModel, modelName: string) => void
  const assertPropertyExists: (instance: object, propertyName: string) => void
  const assertUniqueCompoundIndex: (
    instance: IndexContainer,
    indexNames: ReadonlyArray<string>
  ) => void
  const checkHookDefined: CheckHookDefined
  const checkModelName: CheckModelName
  const checkNonUniqueIndex: (
    instance: IndexContainer
  ) => (indexNameOrNames: string | ReadonlyArray<string>) => void
  const checkPropertyExists: CheckPropertyExists
  /** @deprecated Use checkUniqueIndex or checkNonUniqueIndex. */
  const checkUniqueCompoundIndex: CheckUniqueCompoundIndex
  const checkUniqueIndex: (
    instance: IndexContainer
  ) => (indexNameOrNames: string | ReadonlyArray<string>) => void
  const dataTypes: DataTypes
  const listModels: (folder?: string, suffix?: string) => string[]
  const makeMockModels: <TModels extends Record<string, unknown>>(
    models: TModels,
    folder?: string,
    suffix?: string
  ) => TModels & { '@noCallThru': true } & Record<string, unknown>
  const sequelize: SequelizeFacade
  const Sequelize: {
    Model: typeof Model
    DataTypes: DataTypes
  }
}

export = SequelizeJestKit
