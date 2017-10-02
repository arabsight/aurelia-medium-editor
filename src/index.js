import { PLATFORM } from 'aurelia-pal';

export { default } from './medium-editor';
export { MediumEditorPlugin } from './medium-editor-plugin';

export function configure(config, editorConfig) {
    if (typeof editorConfig === 'object') {
        config.container.registerInstance('editor-config', editorConfig);
    }

    config.globalResources(PLATFORM.moduleName('./medium-editor-plugin'));
}
