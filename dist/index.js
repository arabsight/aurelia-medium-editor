'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MediumEditorPlugin = exports.MediumEditor = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mediumEditorPlugin = require('./medium-editor-plugin');

Object.defineProperty(exports, 'MediumEditorPlugin', {
    enumerable: true,
    get: function get() {
        return _mediumEditorPlugin.MediumEditorPlugin;
    }
});
exports.configure = configure;

var _mediumEditor = require('./medium-editor');

var _mediumEditor2 = _interopRequireDefault(_mediumEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.MediumEditor = _mediumEditor2.default;
function configure(config, editorConfig) {
    if ((typeof editorConfig === 'undefined' ? 'undefined' : _typeof(editorConfig)) === 'object') {
        config.container.registerInstance('editor-config', editorConfig);
    }

    config.globalResources('./medium-editor-plugin');
}