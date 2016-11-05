export { MediumEditorPlugin } from './medium-editor-plugin';

export function configure(config, editorConfig) {
    config.globalResources('./medium-editor-plugin');
}
