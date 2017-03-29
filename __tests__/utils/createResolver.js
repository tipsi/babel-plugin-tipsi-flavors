var path = require('path')
var fs = require('fs')
var babel = require('babel-core')
var pluginImport = require('../../')

module.exports = function(opts) {
  return function (filename) {
    return new Promise(function (resolve, reject) {
      babel.transformFile(
        filename,
        { plugins: [[pluginImport, opts]] },
        function (err, res) {
          return err ? reject(err) : resolve(res.code)
        }
      )
    })
  }
}
