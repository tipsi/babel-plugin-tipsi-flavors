var fs = require('fs')

module.exports = function (filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(
      filename,
      function (err, data) {
        return err ? reject(err) : resolve(data.toString())
      }
    )
  })
}
