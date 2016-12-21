var path = require('path');
var fs = require('fs');
var babel = require('babel-core');
var pluginImport = require('../../');

module.exports = filename => {
    return new Promise((resolve, reject) => {
        var our = babel.transformFile(
            filename,
            {plugins: [pluginImport]},
            ((err, { code }) => {
                if (err) {
                    reject(err);
                }

                resolve(code);
            })
        );
    });
};
