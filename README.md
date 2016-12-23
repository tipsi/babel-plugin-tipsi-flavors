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
ok 2 babel-core shouldn't be changed
ok 3 ./files/module should be changed into ./files/module.custom
ok 4 ./files/module2 should be changed into ./files/module2.tipsi
ok 5 ./files/module3 should be changed into ./files/module3.whitelabel
ok 6 ./files/module4 shouldn't be changed
ok 7 ./files/module5 should be changed into ./files/module5.tipsi
ok 8 ./files/module6 should be changed into ./files/module6.custom
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
