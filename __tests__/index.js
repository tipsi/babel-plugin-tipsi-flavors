const path = require('path')
const test = require('tape-async');
const resolver = require('./utils/resolver');
const getCode = require('./utils/getCode');
const getAllFiles = require('./utils/getAllFiles');

test('Plugin should resolve modules correct', async t => {
    try {
        const testSuitePath = path.resolve(__dirname, './testSuite.js')
        const originalCode = await getCode(testSuitePath);
        const arrayOfOriginalImports = originalCode
            .split('\n')
            .map(x => x.split('\'')[1]);

        const transpiledCode = await resolver(testSuitePath);
        const arrayOfTranspiledImports = transpiledCode
            .split('\n')
            .filter(x => x)
            .map(x => x.split('\'')[1]);

        t.notEqual(transpiledCode, originalCode, 'Code should be successfully transpiled');

        const flavoredFilesFolderPath = path.resolve(__dirname, './files')
        let expectedPaths = await getAllFiles(flavoredFilesFolderPath);
        expectedPaths = [
            'babel-core',
            ...expectedPaths.map(x => `./files/${x.slice(0, x.length - 3)}`),
        ];

        arrayOfTranspiledImports.forEach((x, i) => {
            const message = x === arrayOfOriginalImports[i] ?
                'shouldn\'t be changed' : `should be changed into ${x}`;
            t.equal(
                x,
                expectedPaths[i],
                `${arrayOfOriginalImports[i]} ${message}`
            );
        });
    } catch (e) {
        t.fail(e);
    }
});
