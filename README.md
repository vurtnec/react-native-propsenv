## Overview
This is base on the https://www.npmjs.com/package/react-native-dotenv, and match to propsenv.

## Install

```bash
# with npm 
npm install react-native-propsenv
 
# or with Yarn 
yarn add react-native-propsenv
```

## Usage

As early as possible in your application, require and configure propsenv.

```
{
  "plugins": [
    ["module:react-native-propsenv"]
  ]
}
```

```
{
  "plugins": [
    ["module:react-native-propsenv", {
        moduleName: '@env',
        path: './env/',
        whitelist: ['TEST'],
        blacklist: ['TOKEN'],
        allowUndefined: true,
        debug: true,
        profile: development,
    }]
  ]
}
```

Create a `env_<env>.properties` file in the root/env/ directory of your project. Add environment-specific variables on new lines in the form of `NAME=VALUE`. For example:

```
HOST=localhost.local
USER=root
PASS=pass
```

You can also create multiple `env_<env>.properties` file in the directory.

```
# <root>/env

env_dev.properties
env_test.properties
env_prod.properties
```

Then execute your start script before with NODE_ENV=<env>, you will get the configured variables in to env_<env>.properties file by process.env.HOST, process.env.USER, process.env.PASS

```
RN_PROPS_ENV=test node your_script.js
```

Use in your code

```
import {HOST, USER} from '@env'

console.log('HOST', HOST)
console.log('USER', USER)
```

## Troubleshooting

if you are meet the babel production cannot use issue, please configure the babel file as below:

```
module.exports = {
  "presets": [
    "module:metro-react-native-babel-preset"
  ],
  "plugins": [
    ["module:react-native-propsenv", {
      debug: false,
      path: './env/',
      moduleName: '@env',
      profile: "production"
    }]
  ],
  "env": {
    "development": {
      "plugins": [
        ["module:react-native-propsenv", {
          debug: false,
          path: './env/',
          moduleName: '@env',
          profile: "development"
        }]
      ]
    }
  }
}
```
