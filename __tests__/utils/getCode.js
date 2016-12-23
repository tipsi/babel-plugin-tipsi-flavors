const fs = require('fs')

module.exports = filename => (
  new Promise((resolve, reject) => (
    fs.readFile(filename, (err, data) => err ? reject(err) : resolve(data.toString()))
  ))
)
