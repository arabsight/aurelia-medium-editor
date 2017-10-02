'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MediumEditorPlugin = exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mediumEditor = require('./medium-editor');

Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_mediumEditor).default;
    }
});

var _mediumEditorPlugin = require('./medium-editor-plugin');

Object.defineProperty(exports, 'MediumEditorPlugin', {
    enumerable: true,
    get: function get() {
        return _mediumEditorPlugin.MediumEditorPlugin;
    }
});
exports.configure = configure;

var _aureliaPal = require('aurelia-pal');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configure(config, editorConfig) {
    if ((typeof editorConfig === 'undefined' ? 'undefined' : _typeof(editorConfig)) === 'object') {
        config.container.registerInstance('editor-config', editorConfig);
    }

    config.globalResources(_aureliaPal.PLATFORM.moduleName('./medium-editor-plugin'));
}