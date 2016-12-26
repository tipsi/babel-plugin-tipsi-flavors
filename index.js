var fs = require('fs')
var path = require('path')

var flvrs = process.env.FLAVORS
flvrs = flvrs ? flvrs.split(',').concat('') : []

function resolveImport(source, file, opts) {
  var dirpath = path.dirname(file)
  flvrs = !flvrs.length && opts.FLAVORS && opts.FLAVORS.length ? opts.FLAVORS.concat('') : flvrs

  if (!flvrs.length) {
    return source
  }

  var expectedPath
  for (var i = 0; i < flvrs.length; i++) {
    var suffix = flvrs[i]
    var correctSuffix = suffix ? `.${suffix}` : ''
    var pathname = path.resolve(dirpath, `${source}${correctSuffix}.js`)
    var isExist = fs.existsSync(pathname)

    if (isExist) {
      var nextPathName = pathname.split('/')
      nextPathName = nextPathName[nextPathName.length - 1]

      var originalPathArray = source.split('/')
      expectedPath = [
        ...originalPathArray.slice(0, originalPathArray.length - 1),
        nextPathName,
      ].join('/')

      if (expectedPath.endsWith('.js')) {
        expectedPath = expectedPath.slice(0, expectedPath.length - 3)
      }

      break
    }
  }

  return expectedPath
}

module.exports = function(babel) {
  var t = babel.types

  function getModulePath(source, file, state) {
    var opts = state.opts
    var result = resolveImport(source, file, opts)
    return result !== source ? result : undefined
  }

  function checkRequire(path) {
    var callee = path.node.callee
    var isId = t.isIdentifier
    var isMember = t.isMemberExpression
    var obj = { name: 'require' }
    return !isId(callee, obj) && !(isMember(callee) && isId(callee.object, obj))
  }

  function transform(path, state, isRequireCall) {
    if (isRequireCall && checkRequire(path)) {
      return
    }

    var source = isRequireCall ? path.node.arguments[0] : path.node.source
    if (source && source.type === 'StringLiteral') {
      var modulePath = getModulePath(source.value, state.file.opts.filename, state)
      if (modulePath) {
        var specifiersValue = isRequireCall ? path.node.callee : path.node.specifiers
        var pathValue = t.stringLiteral(modulePath)
        path.replaceWith(
          t[isRequireCall ? 'callExpression' : 'importDeclaration'](
              specifiersValue,
              isRequireCall ? [pathValue] : pathValue
          )
        )
      }
    }
  }

  return {
    visitor: {
      CallExpression: {
        exit: function(path, state) {
          return transform(path, state, true)
        },
      },
      ImportDeclaration: {
        exit: function(path, state) {
          return transform(path, state)
        },
      },
    },
  }
}
