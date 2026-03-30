![Horizontal Logo](logo/horizontal.svg)

A collection of utilities to help with unit-testing [Sequelize](https://sequelize.org) models and code that needs those models, using [Jest](https://jestjs.io). _This is inspired by my work originally proposed in https://github.com/davesag/sequelize-test-helpers/pull/302._

[![NPM](https://nodei.co/npm/sequelize-jest-kit.png)](https://nodei.co/npm/sequelize-jest-kit/)

## Related Projects

- [`sequelize-test-helpers`](https://github.com/davesag/sequelize-test-helpers) — Mocha/Chai utilities for testing Sequelize models; **`sequelize-jest-kit` started as a fork of this project** and targets Jest instead.
- [`sequelize-pg-utilities`](https://github.com/davesag/sequelize-pg-utilities) — Simple utilities that help you manage your Sequelize configuration.

## How to use

### Prerequisites

1. **[Jest](https://jestjs.io)** — this package wires mocks with [`jest-mock`](https://www.npmjs.com/package/jest-mock) (`jest.fn()`), and the check helpers expect Jest’s global `expect`.
2. **Optional:** [`proxyquire`](https://github.com/thlorenz/proxyquire) (or another stub loader) when you need to replace `require('../models')` in unit tests.

If you use Mocha-style `context` blocks, add a one-line setup file and register it with Jest’s [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array):

```js
global.context = global.describe
```

(This repo does the same in `test/unitTestHelper.js`.)

### Installation

Add `sequelize-jest-kit` as a `devDependency`:

```sh
npm i -D sequelize-jest-kit
```

## Examples

### Unit testing models created with `sequelize.define`

**Note**: See below for how to test models created using `Model.init`

Let's say you have a Sequelize model `User` as follows:

#### `src/models/User.js`

```js
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

  User.associate = ({ Company }) => {
    User.belongsTo(Company)
  }

  return User
}

module.exports = model
```

You can use `sequelize-jest-kit` to unit-test this with Jest as follows:

#### `test/unit/models/User.test.js`

```js
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkNonUniqueIndex,
  checkPropertyExists
} = require('sequelize-jest-kit')

const UserModel = require('../../../src/models/User')

describe('src/models/User', () => {
  const User = UserModel(sequelize, dataTypes)
  const user = new User()

  checkModelName(User)('User')

  describe('properties', () => {
    ;['age', 'firstName', 'lastName', 'email', 'token'].forEach(checkPropertyExists(user))
  })

  describe('associations', () => {
    const Company = 'some dummy company'

    beforeAll(() => {
      User.associate({ Company })
    })

    it('defined a belongsTo association with Company', () => {
      expect(User.belongsTo).toHaveBeenCalledWith(Company)
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
```

### Built-in checks

Each `check*` helper registers a Jest `it` that runs an assertion. For use inside your own `it` or for negative tests, use the matching `assert*` export (for example `assertModelName`).

| Check                 | What it does                                          |
| --------------------- | ----------------------------------------------------- |
| `checkHookDefined`    | Checks that a particular hook is defined.             |
| `checkModelName`      | Checks that the model is named correctly.             |
| `checkNonUniqueIndex` | Checks that a specific non-unique index is defined.   |
| `checkPropertyExists` | Checks that the model has defined the given property. |
| `checkUniqueIndex`    | Checks that a specific unique index is defined.       |

#### Deprecation notice

| Check                      | Note                                                   |
| -------------------------- | ------------------------------------------------------ |
| `checkUniqueCompoundIndex` | Use either `checkUniqueIndex` or `checkNonUniqueIndex` |

### Checking associations

The various association functions are Jest mocks (`jest.fn()`), so you can invoke the model’s `associate` function in a `beforeAll` / `beforeEach` block and use Jest’s matcher API to assert they were called with the correct values.

#### `hasOne`

```js
it("defined a hasOne association with Image as 'profilePic'", () => {
  expect(User.hasOne).toHaveBeenCalledWith(Image, {
    as: 'profilePic'
  })
})
```

#### `belongsTo`

```js
it('defined a belongsTo association with Company', () => {
  expect(User.belongsTo).toHaveBeenCalledWith(Company)
})
```

#### `hasMany`

```js
it("defined a hasMany association with User as 'employees'", () => {
  expect(Company.hasMany).toHaveBeenCalledWith(User, {
    as: 'employees'
  })
})
```

#### `belongsToMany`

```js
it("defined a belongsToMany association with Category through CategoriesCompanies as 'categories'", () => {
  expect(Company.belongsToMany).toHaveBeenCalledWith(Category, {
    through: CategoriesCompanies,
    as: 'categories'
  })
})
```

### Unit testing code that requires `models`

Let's say you have a utility function that takes some data and uses it to update a user record. If the user does not exist it returns `null`. (Yes I know this is a contrived example)

#### `src/utils/save.js`

```js
const { User } = require('../models')

const save = async ({ id, ...data }) => {
  const user = await User.findOne({ where: { id } })
  if (user) return await user.update(data)
  return null
}

module.exports = save
```

You want to unit-test this without invoking a database connection (so you can't `require('src/models')` in your test).

This is where `makeMockModels` and [`proxyquire`](https://github.com/thlorenz/proxyquire) come in handy (use `jest.fn()` for any methods you need to stub or spy on).

#### `test/unit/utils/save.test.js`

```js
const proxyquire = require('proxyquire')

const { makeMockModels } = require('sequelize-jest-kit')

describe('src/utils/save', () => {
  const User = { findOne: jest.fn() }
  const mockModels = makeMockModels({ User })

  const save = proxyquire('../../../src/utils/save', {
    '../models': mockModels
  })

  const id = 1
  const data = {
    firstName: 'Testy',
    lastName: 'McTestFace',
    email: 'testy.mctestface.test.tes',
    token: 'some-token'
  }
  const fakeUser = { id, ...data, update: jest.fn() }

  let result

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
```

As a convenience, `makeMockModels` will automatically populate your `mockModels` with mocks of all of the models defined in your `src/models` folder (or if you have a `.sequelizerc` file it will look for the `models-path` in that). Simply override any of the specific models you need to do stuff with.

### Testing models created with `Model.init`

Sequelize also allows you to create models by extending `Sequelize.Model` and invoking its static `init` function as follows:

**Note**: creating your models this way makes it harder to test their use.

```js
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
```

You can test this using `sequelize-jest-kit` and `proxyquire`.

```js
const proxyquire = require('proxyquire')
const { sequelize, Sequelize } = require('sequelize-jest-kit')

describe('src/models/User', () => {
  const { DataTypes } = Sequelize

  const UserFactory = proxyquire('../../../src/models/User', {
    sequelize: Sequelize
  })

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
```

### Listing your models

Assuming your `src/models/index.js` (or your equivalent) exports all your models, it's useful to be able to generate a list of their names.

```js
const { listModels } = require('sequelize-jest-kit')

console.log(listModels()) // will spit out a list of your model names.
```

Similarly to `makeMockModels` above, `listModels` will find all of the models defined in your `src/models` folder (or if you have a `.sequelizerc` file it will look for the `models-path` in that).

## Custom `models` paths and custom file suffixes

By default `makeMockModels` and `listModels` will both look for your models in files ending with `.js` in either the models path defined in `.sequelizerc`, or in `src/models`. If however your models are not `.js` files and the `models` folder is somewhere else you can pass in a custom models folder path and a custom suffix.

- `listModels(customModelsFolder, customSuffix)`

  ```js
  const modelNames = listModels('models', '.ts')
  ```

- `makeMockModels(yourCustomModels, customModelsFolder, customSuffix)`

  ```js
  const models = makeMockModels({ User: { findOne: jest.fn() } }, 'models', '.ts')
  ```

## Development

### Branches

| Branch | Status | Coverage | Audit | Notes |
| ------ | ------ | -------- | ----- | ----- |
| `develop` | [![CircleCI](https://circleci.com/gh/howard-e/sequelize-jest-kit/tree/develop.svg?style=svg)](https://circleci.com/gh/howard-e/sequelize-jest-kit/tree/develop) | [![codecov](https://codecov.io/gh/howard-e/sequelize-jest-kit/branch/develop/graph/badge.svg)](https://codecov.io/gh/howard-e/sequelize-jest-kit) | [![Vulnerabilities](https://snyk.io/test/github/howard-e/sequelize-jest-kit/develop/badge.svg)](https://snyk.io/test/github/howard-e/sequelize-jest-kit/develop) | Work in progress |
| `main` | [![CircleCI](https://circleci.com/gh/howard-e/sequelize-jest-kit/tree/main.svg?style=svg)](https://circleci.com/gh/howard-e/sequelize-jest-kit/tree/main) | [![codecov](https://codecov.io/gh/howard-e/sequelize-jest-kit/branch/main/graph/badge.svg)](https://codecov.io/gh/howard-e/sequelize-jest-kit) | [![Vulnerabilities](https://snyk.io/test/github/howard-e/sequelize-jest-kit/main/badge.svg)](https://snyk.io/test/github/howard-e/sequelize-jest-kit/main) | Latest stable release |

### Development Prerequisites

- [Node.js](https://nodejs.org) that satisfies the `engines` field in `package.json`.

### Setup

```sh
npm install
```

### Commands

- `npm test` — run the unit tests
- `npm run test:unit:cov` — run the unit tests with code coverage
- `npm run lint` — run the linters

Source repository: [github.com/howard-e/sequelize-jest-kit](https://github.com/howard-e/sequelize-jest-kit).

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).

## Thanks

- Thanks to [`reallinfo`](https://github.com/reallinfo) for the ([original](https://github.com/davesag/sequelize-test-helpers/blob/develop/logo/horizontal.svg)) logo. [Updated](https://github.com/howard-e/sequelize-jest-kit/blob/develop/logo/horizontal.svg) by myself, @howard-e.
