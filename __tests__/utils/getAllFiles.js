const fs = require('fs');

module.exports = folder => {
    return new Promise((resolve, reject) => {
        fs.readdir(folder, (err, files) => err ? reject(err) : resolve(files))
    });
};
