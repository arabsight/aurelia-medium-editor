'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mediumEditorPlugin = require('./medium-editor-plugin');

Object.defineProperty(exports, 'MediumEditorPlugin', {
    enumerable: true,
    get: function get() {
        return _mediumEditorPlugin.MediumEditorPlugin;
    }
});
exports.configure = configure;
function configure(config, editorConfig) {
    config.globalResources('./medium-editor-plugin');
}