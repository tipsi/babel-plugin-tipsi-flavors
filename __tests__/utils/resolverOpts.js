const babel = require('babel-core')
const pluginImport = require('../../')

module.exports = filename => (
  new Promise((resolve, reject) => {
    babel.transformFile(
      filename,
      { plugins: [[pluginImport, { FLAVORS: 'custom,tipsi,whitelabel' }]] },
      ((err, { code }) => {
        if (err) {
          reject(err)
        }

        resolve(code)
      })
    )
  })
)
