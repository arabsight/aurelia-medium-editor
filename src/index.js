export { MediumEditorPlugin } from './medium-editor-plugin';

export function configure(config, editorConfig) {
    if (typeof editorConfig === 'object') {
        config.container.registerInstance('editor-config', editorConfig);
    }

    config.globalResources('./medium-editor-plugin');
}
