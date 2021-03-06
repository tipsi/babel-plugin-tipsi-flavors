[![image](https://travis-ci.org/tipsi/babel-plugin-tipsi-flavors.svg?branch=master)](https://travis-ci.org/tipsi/babel-plugin-tipsi-flavors)
# babel-plugin-tipsi-flavors
Support build flavors for React Native applications  

This plugin helps rewrite you imports by rules from environment variable `FLAVORS` by default  
Look into tests results while `FLAVORS=custom,tipsi,whitelabel`

```bash
# destination folder structure

❯ ls -la ./files
folder
module.custom.js
module2.tipsi.js
module3.whitelabel.js
module4.js
module5.tipsi.js
module6.custom.js
module7.js
module8.custom.js
```

```javascript
// testSuite.js

import babel from 'babel-core'
const module9 = require('./files/folder')
import module from './files/module'
import module2 from './files/module2'
import module3 from './files/module3'
import module4 from './files/module4'
import module5 from './files/module5'
const module6 = require('./files/module6')
const module7 = require('./files/module7.js')
const module8 = require('./files/module8.js')
```

```javascript
// transpiled code

import babel from 'babel-core'
const module9 = require('./files/folder')
import module from './files/module.custom'
import module2 from './files/module2.tipsi'
import module3 from './files/module3.whitelabel'
import module4 from './files/module4'
import module5 from './files/module5.tipsi'
const module6 = require('./files/module6.custom')
const module7 = require('./files/module7.js')
const module8 = require('./files/module8.custom.js')
```

### Install
```bash
❯ npm i babel-plugin-tipsi-flavors --save-dev
```

```bash
# .babelrc

{
  ...
  "plugins": ["tipsi-flavors"]
}
```

### Run tests
```bash
FLAVORS=custom,tipsi npm run ci
```

### Usage

#### React-Native while development
```bash
❯ FLAVORS=custom,tipsi,whitelabel npm start

❯ react-native run-ios (run-android)
```

#### React-Native while production
```
❯ FLAVORS=custom,tipsi,whitelabel npm run build:ios
# or
❯ FLAVORS=custom,tipsi,whitelabel npm run build:android 
```

#### Non React-Native environments as usual, just add plugin into .babelrc

#### If you want to set custom environment variable just pass it into .babelrc

```bash
# .babelrc

{
  ...
  "plugins": [["tipsi-flavors", {"env": "MY_CUSTOM_VAR"}]]
}
```

#### And run it like:

```bash
❯ MY_CUSTOM_VAR=custom,tipsi,whitelabel npm start

❯ react-native run-ios (run-android)
```

#### If you don't like environment variables, just use .babelrc to pass FLAVORS
#### But remember that environment variables has higher priority

```bash
# .babelrc

{
  ...
  "plugins": [["tipsi-flavors", {"flavors": ["custom", "tipsi"]}]]
}
```
