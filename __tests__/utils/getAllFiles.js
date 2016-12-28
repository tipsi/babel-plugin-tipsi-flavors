var fs = require('fs')

module.exports = function (folder) {
  return new Promise(function (resolve, reject) {
    fs.readdir(folder, function(err, files) {
      return err ? reject(err) : resolve(files)
    })
  })
}
