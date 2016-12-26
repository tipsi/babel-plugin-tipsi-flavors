[![image](https://travis-ci.org/tipsi/babel-plugin-tipsi-flavors.svg?branch=master)](https://travis-ci.org/tipsi/babel-plugin-tipsi-flavors)
# babel-plugin-tipsi-flavors
Support build flavors for React Native applications  

This plugin helps rewrite you imports by rules from environment variable `FLAVORS`  
Look into tests results while `FLAVORS=custom,tipsi,whitelabel`

```bash
# destination folder structure

❯ ls -la ./files
module.custom.js
module2.tipsi.js
module3.whitelabel.js
module4.js
module5.tipsi.js
module6.custom.js
```

```javascript
// testSuite.js

import babel from 'babel-core'
import module from './files/module'
import module2 from './files/module2'
import module3 from './files/module3'
import module4 from './files/module4'
import module5 from './files/module5'
const module6 = require('./files/module6')
```

```bash
// transpiled code

import babel from 'babel-core'
import module from './files/module.custom'
import module2 from './files/module2.tipsi'
import module3 from './files/module3.whitelabel'
import module4 from './files/module4'
import module5 from './files/module5.tipsi'
const module6 = require('./files/module6.custom')
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

#### If you don't like environment variables, just use .babelrc to pass FLAVORS

```bash
# .babelrc

{
  ...
  "plugins": [["tipsi-flavors", {"FLAVORS": ["custom", "tipsi"]}]]
}
```
