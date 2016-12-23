const fs = require('fs');
const { resolve, dirname } = require('path');

let flavors = process.env.FLAVORS;
flavors = flavors ? [...flavors.split(','), ''] : [];

function resolveImport(source, file, opts) {
    let dirpath = file.split('/');
    dirpath = dirpath.slice(0, dirpath.length - 1).join('/');

    flavors = !flavors.length && opts.FLAVORS.length ? [...opts.FLAVORS.split(','), ''] : flavors;

    if (flavors.length) {
        let expectedPath;
        for (suffix of flavors) {
            const correctSuffix = suffix ? `.${suffix}` : '';
            const pathname = resolve(dirpath, `${source}${correctSuffix}.js`);
            const isExist = fs.existsSync(pathname);

            if (isExist) {
                let nextPathName = pathname.split('/');
                nextPathName = nextPathName[nextPathName.length - 1];

                const originalPathArray = source.split('/');
                expectedPath = [
                    ...originalPathArray.slice(0, originalPathArray.length - 1),
                    nextPathName
                ].join('/');

                if (expectedPath.endsWith('.js')) {
                    expectedPath = expectedPath.slice(0, expectedPath.length - 3);
                }

                break;
            }
        }

        return expectedPath;
    }

    return source;
}

module.exports = ({ types: t }) => {
    let cachedReplaceFunction;

    function getModulePath(source, file, { opts }) {
        const result = resolveImport(source, file, opts);
        return result !== source ? result : undefined;
    }

    function checkRequire(path) {
        const { callee } = path.node;
        const { isIdentifier: isId, isMemberExpression: isMember } = t;
        const obj = {name: 'require'};
        return !isId(callee, obj) && !(isMember(callee) && isId(callee.object, obj));
    }

    function transformCall(path, state, isRequireCall) {
        if (isRequireCall && checkRequire(path)) {
            return;
        }

        const source = isRequireCall ? path.node.arguments[0] : path.node.source;
        if (source && source.type === 'StringLiteral') {
            const modulePath = getModulePath(source.value, state.file.opts.filename, state);
            if (modulePath) {
                const specifiersValue = isRequireCall ? path.node.callee : path.node.specifiers;
                const pathValue = t.stringLiteral(modulePath)
                path.replaceWith(
                    t[isRequireCall ? 'callExpression' : 'importDeclaration'](
                        specifiersValue,
                        isRequireCall ? [pathValue] : pathValue
                    )
                );
            }
        }
    }

    return {
        visitor: {
            CallExpression: {
                exit(path, state) {
                    return transformCall(path, state, true);
                },
            },
            ImportDeclaration: {
                exit(path, state) {
                    return transformCall(path, state);
                },
            },
        },
    };
};
