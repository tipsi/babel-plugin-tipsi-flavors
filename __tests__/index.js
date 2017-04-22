var path = require('path')
var test = require('tape-async')
var getCode = require('./utils/getCode')
var getAllFiles = require('./utils/getAllFiles')
var createResolver = require('./utils/createResolver')

var foldersList = ['img']
var flavorsString = 'custom,tipsi,whitelabel'

function checkResolver(t, resolver) {
  var testSuitePath = path.resolve(__dirname, './testSuite.js')
  var originalCode
  var originalImports
  var transpiledCode
  var transpiledImports
  var jsFilesPaths

  return getCode(testSuitePath)
    .then(function (data) {
      originalCode = data
      originalImports = data.split('\n').map(x => x.split('\'')[1]).filter(x => x)
      return resolver(testSuitePath)
    })
    .then(function (data) {
      transpiledCode = data
      transpiledImports = data.split('\n').filter(x => x).map(x => x.split('\'')[1]).filter(x => x)
      t.notEqual(transpiledCode, originalCode, 'Code should be successfully transpiled')

      var flavoredFilesFolderPath = path.resolve(__dirname, './files')
      return getAllFiles(flavoredFilesFolderPath)
    })
    .then(function (data) {
      jsFilesPaths = data
      var flavoredImagesFolderPath = path.resolve(__dirname, './files/img')
      return getAllFiles(flavoredImagesFolderPath)
    })
    .then(function (imagesPaths) {
      var expectedPaths = jsFilesPaths.filter(x => foldersList.indexOf(x) === -1).map((x, i) => {
        var filename = !!path.extname(originalImports[i + 1]) ? x : path.parse(x).name
        return './files/' + filename
      })
      var expectedImagesPaths = imagesPaths.map((x, i) => {
        var filename = !!path.extname(originalImports[i + expectedPaths.length])
          ? x
          : path.parse(x).name
        return './files/img/' + filename
      })
      expectedPaths = ['babel-core'].concat(expectedPaths, expectedImagesPaths)

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

function checkFlavoredResolver(t, resolver) {
  var testSuitePath = path.resolve(__dirname, './testSuite.custom.js')
  var originalCode
  var originalImports
  var transpiledCode
  var transpiledImports

  return getCode(testSuitePath)
    .then(function (data) {
      originalCode = data
      originalImports = data.split('\n').map(x => x.split('\'')[1]).filter(x => x)
      return resolver(testSuitePath)
    })
    .then(function (data) {
      transpiledCode = data
      transpiledImports = data.split('\n').filter(x => x).map(x => x.split('\'')[1]).filter(x => x)
      t.notEqual(transpiledCode, originalCode, 'Code should be successfully transpiled')

      var originalFilesFolderPath = path.resolve(__dirname, './')
      return getAllFiles(originalFilesFolderPath)
    })
    .then(function (jsFilesPaths) {
      var expectedPaths = jsFilesPaths.map(function (x, i) {
        return './' + path.parse(x).name
      })

      transpiledImports.forEach(function (x, i) {
        t.ok(
          expectedPaths.find(function (item) {
            return item === x
          }),
          originalImports[i] + ' ' + 'should not be changed'
        )
      })
    })
    .catch(function (e) {
      t.fail(e)
    })
}

test('Plugin should resolve modules correct via process.env.FLAVORS', function (t) {
  process.env.FLAVORS = flavorsString
  t.equal(process.env.FLAVORS, flavorsString, 'FLAVORS environment variable is ' + flavorsString)

  return checkResolver(t, createResolver())
})

test('Plugin should resolve modules correct via .babelrc "flavors" option', function (t) {
  delete process.env.FLAVORS
  t.equal(process.env.FLAVORS, undefined, 'FLAVORS environment variable is undefined')

  return checkResolver(t, createResolver({ flavors: flavorsString.split(',') }))
})

test('Plugin should resolve modules correct via .babelrc "env" option', function (t) {
  delete process.env.FLAVORS
  t.equal(process.env.FLAVORS, undefined, 'FLAVORS environment variable is undefined')

  process.env.APP_NAME = flavorsString
  t.equal(process.env.APP_NAME, flavorsString, 'APP_NAME environment variable is tipsi')

  return checkResolver(t, createResolver({ env: 'APP_NAME' }))
})

test('Plugin should not transform original import from flavored files', function (t) {
  delete process.env.APP_NAME
  t.equal(process.env.APP_NAME, undefined, 'APP_NAME environment variable is undefined')

  process.env.FLAVORS = flavorsString
  t.equal(process.env.FLAVORS, flavorsString, 'FLAVORS environment variable is ' + flavorsString)

  return checkFlavoredResolver(t, createResolver())
})
