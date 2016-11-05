const path = require('path');
const paths = require('./paths');

exports.base = function() {
    return {
        filename: '',
        filenameRelative: '',
        sourceMap: true,
        sourceRoot: '',
        moduleRoot: path.resolve('src').replace(/\\/g, '/'),
        moduleIds: false,
        comments: false,
        compact: false,
        code: true,
        presets: ['es2015-loose', 'stage-1'],
        plugins: [
            'syntax-flow',
            'transform-decorators-legacy',
            'transform-flow-strip-types'
        ]
    };
}

exports.commonjs = function() {
    var options = exports.base();
    options.plugins.push('transform-es2015-modules-commonjs');
    return options;
};
