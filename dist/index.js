'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mediumEditorPlugin = require('./medium-editor-plugin');

Object.defineProperty(exports, 'MediumEditorPlugin', {
    enumerable: true,
    get: function get() {
        return _mediumEditorPlugin.MediumEditorPlugin;
    }
});
exports.configure = configure;
function configure(config, editorConfig) {
    if ((typeof editorConfig === 'undefined' ? 'undefined' : _typeof(editorConfig)) === 'object') {
        config.container.registerInstance('editor-config', editorConfig);
    }

    config.globalResources('./medium-editor-plugin');
}