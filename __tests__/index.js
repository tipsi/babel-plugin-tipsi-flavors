var path = require('path')
var test = require('tape-async')
var getCode = require('./utils/getCode')
var getAllFiles = require('./utils/getAllFiles')
var createResolver = require('./utils/createResolver')

var flavorsString = 'custom,tipsi,whitelabel'

function checkResolver(t, resolver) {
  var testSuitePath = path.resolve(__dirname, './testSuite.js')
  var originalCode
  var originalImports
  var transpiledCode
  var transpiledImports

  return getCode(testSuitePath)
    .then(function (data) {
      originalCode = data
      originalImports = data.split('\n').map(x => x.split('\'')[1])
      return resolver(testSuitePath)
    })
    .then(function (data) {
      transpiledCode = data
      transpiledImports = data.split('\n').filter(x => x).map(x => x.split('\'')[1])
      t.notEqual(transpiledCode, originalCode, 'Code should be successfully transpiled')

      var flavoredFilesFolderPath = path.resolve(__dirname, './files')
      return getAllFiles(flavoredFilesFolderPath)
    })
    .then(function (data) {
      var expectedPaths = data.map((x, i) => {
        const filename = !!path.extname(originalImports[i + 1]) ? x : path.parse(x).name
        return './files/' + filename
      })
      expectedPaths = ['babel-core'].concat(expectedPaths)

      transpiledImports.forEach((x, i) => {
        var message = x === originalImports[i] ?
          'should not be changed' : 'should be changed into ' + x
        t.equal(x, expectedPaths[i], originalImports[i] + ' ' + message)
      })
    })
    .catch(function (e) {
      t.fail(e)
    })
}

test('Plugin should resolve modules correct via process.env.FLAVORS', function (t) {
  process.env.FLAVORS = flavorsString

  t.equal(process.env.FLAVORS, flavorsString, 'FLAVORS environment variable is tipsi')

  var resolver = createResolver()

  return checkResolver(t, resolver)
})

test('Plugin should resolve modules correct via .babelrc "flavors" option', function (t) {
  delete process.env.FLAVORS

  t.equal(process.env.FLAVORS, undefined, 'FLAVORS environment variable is undefined')

  var resolver = createResolver({ flavors: flavorsString.split(',') })

  return checkResolver(t, resolver)
})

test('Plugin should resolve modules correct via .babelrc "env" option', function (t) {
  delete process.env.FLAVORS

  t.equal(process.env.FLAVORS, undefined, 'FLAVORS environment variable is undefined')

  process.env.APP_NAME = flavorsString

  t.equal(process.env.APP_NAME, flavorsString, 'APP_NAME environment variable is tipsi')

  var resolver = createResolver({ env: 'APP_NAME' })

  return checkResolver(t, resolver)
})
