var path = require('path')
var test = require('tape-async')
var resolver = require('./utils/resolver')
var resolverOpts = require('./utils/resolverOpts')
var getCode = require('./utils/getCode')
var getAllFiles = require('./utils/getAllFiles')

test('Plugin should resolve modules correct via process.env.FLAVORS', function (t) {
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
})

test('Plugin should resolve modules correct via .babelrc options', function (t) {
  process.env.FLAVORS = undefined

  t.equal(process.env.FLAVORS, 'undefined', 'FLAVORS environment variable is undefined')

  var testSuitePath = path.resolve(__dirname, './testSuite.js')
  var originalCode
  var originalImports
  var transpiledCode
  var transpiledImports

  return getCode(testSuitePath)
    .then(function (data) {
      originalCode = data
      originalImports = data.split('\n').map(x => x.split('\'')[1])

      return resolverOpts(testSuitePath)
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
})
