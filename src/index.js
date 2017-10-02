import { PLATFORM } from 'aurelia-pal';
import MediumEditor from './medium-editor';
import { MediumEditorPlugin } from './medium-editor-plugin';

export function configure(config, editorConfig) {
    if (typeof editorConfig === 'object') {
        config.container.registerInstance('editor-config', editorConfig);
    }

    config.globalResources(PLATFORM.moduleName('./medium-editor-plugin'));
}

export { MediumEditor, MediumEditorPlugin };
