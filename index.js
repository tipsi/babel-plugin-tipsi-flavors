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

  var expectedPath
  for (var i = 0; i < flavors.length; i++) {
    var suffix = flavors[i]
    var correctSuffix = suffix ? '.' + suffix : ''
    var parsedSourceName = path.parse(source)
    var pathname = path.resolve(
      dirpath,
      parsedSourceName.dir,
      parsedSourceName.name + correctSuffix + '.js'
    )
    var isExist = fs.existsSync(pathname)

    if (isExist) {
      expectedPath = [path.dirname(source), path.basename(pathname)].join('/')

      // We care about file extensions
      // If source code doesn't contain '.js' extension,
      // we will not pass it through transpiled code
      if (!source.endsWith('.js')) {
        expectedPath = expectedPath.slice(0, expectedPath.length - 3)
      }

      break
    }
  }

  // If we will not return undefined while expectedPath === source
  // babel will infinitely visit updated paths
  // and transform them again and again
  return expectedPath !== source ? expectedPath : undefined
}

module.exports = function(babel) {
  var t = babel.types

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
      var flavors = resolveFlavors(state.opts)
      var modulePath = resolveImport(source.value, state.file.opts.filename, flavors)
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
