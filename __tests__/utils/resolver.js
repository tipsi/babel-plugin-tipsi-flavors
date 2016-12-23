const babel = require('babel-core')
const pluginImport = require('../../')

module.exports = filename => (
  new Promise((resolve, reject) => {
    babel.transformFile(
      filename,
      { plugins: [pluginImport] },
      ((err, { code }) => {
        if (err) {
          reject(err)
        }

        resolve(code)
      })
    )
  })
)
