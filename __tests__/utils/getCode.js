const fs = require('fs');
const path = require('path');

module.exports = filename => {
    return new Promise((resolve, reject) => {
        fs.readFile(
            filename,
            (err, data) => err ? reject(err) : resolve(data.toString())
        );
    })
};
