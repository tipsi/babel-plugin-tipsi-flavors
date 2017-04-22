var fs = require('fs')
var path = require('path')

// opts passed through .babelrc as second argument
// {
//   "plugins": [["tipsi-flavors", { "env": "APP_NAME", "flavors": ["custom", "tipsi"]}]]
// }
function resolveFlavors(opts) {
  var string = process.env[opts.env || 'FLAVORS']

  if (string) {
    return string.split(',')
  } else if (opts.flavors) {
    return opts.flavors
  }

  return []
}

function resolveImport(source, file, flavors) {
  var dirpath = path.dirname(file)

  if (!flavors.length) {
    return undefined
  }

  var parsedSourceName = path.parse(source)
  var parsedExtension = parsedSourceName.ext
  var isFlavorExtension = flavors.indexOf(parsedExtension.replace('.', '')) !== -1
  var isJSExtension = parsedExtension === '.js'
  var isEmptyExtension = !parsedExtension
  var isAnotherFileTypeExtension = !(isFlavorExtension || isJSExtension || isEmptyExtension)
  var correctExtension = isAnotherFileTypeExtension ? parsedExtension : '.js'
  var expectedPath

  if (parsedExtension !== '.') {
    for (var i = 0; i < flavors.concat('').length; i += 1) {
      var suffix = flavors[i]
      var correctSuffix = suffix ? '.' + suffix : ''

      var pathname = path.resolve(
        dirpath,
        parsedSourceName.dir,
        parsedSourceName.name + correctSuffix + correctExtension
      )

      var isExist = fs.existsSync(pathname)
      if (isExist) {
        expectedPath = [path.dirname(source), path.basename(pathname)].join('/')

        // We care about file extensions
        // If source code doesn't contain '.js' extension,
        // we will not pass it through transpiled code
        if (!isAnotherFileTypeExtension && !source.endsWith('.js')) {
          expectedPath = expectedPath.slice(0, expectedPath.length - 3)
        }

        break
      }
    }
  }

  // If we will not return undefined while expectedPath === source
  // babel will infinitely visit updated paths
  // and transform them again and again
  return expectedPath !== source ? expectedPath : undefined
}

function isFileFlavored(flavors, filename) {
  return flavors.some(flavor => path.parse(filename).base.indexOf('.' + flavor) !== -1)
}

module.exports = function(babel) {
  var t = babel.types

  function checkRequire(filePath) {
    var callee = filePath.node.callee
    var isId = t.isIdentifier
    var isMember = t.isMemberExpression
    var obj = { name: 'require' }
    return !isId(callee, obj) && !(isMember(callee) && isId(callee.object, obj))
  }

  function transform(filePath, state, isRequireCall) {
    if (isRequireCall && checkRequire(filePath)) {
      return
    }

    var source = isRequireCall ? filePath.node.arguments[0] : filePath.node.source
    if (source && source.type === 'StringLiteral') {
      var flavors = resolveFlavors(state.opts)
      var filename = state.file.opts.filename

      if (isFileFlavored(flavors, filename)) {
        return
      }

      var modulePath = resolveImport(source.value, filename, flavors)
      if (modulePath) {
        var specifiersValue = isRequireCall ? filePath.node.callee : filePath.node.specifiers
        var pathValue = t.stringLiteral(modulePath)
        filePath.replaceWith(
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
        exit: function(filePath, state) {
          return transform(filePath, state, true)
        },
      },
      ImportDeclaration: {
        exit: function(filePath, state) {
          return transform(filePath, state)
        },
      },
    },
  }
}
