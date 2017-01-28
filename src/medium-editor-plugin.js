import MediumEditor from './medium-editor';
import {
    customElement,
    inlineView,
    bindable,
    bindingMode,
    Container
} from 'aurelia-framework';

@customElement('medium-editor')
@inlineView(`<template>
    <div ref="mediumEditor" class="editable" innerhtml.bind="content"></div>
</template>`)
export class MediumEditorPlugin {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) content;
    @bindable options;

    bind() {
        this.options = Object.assign({}, Container.instance.get('editor-config'), this.options);
    }

    attached() {
        this.options.elementsContainer = this.mediumEditor.parentNode;
        this.editor = new MediumEditor(this.mediumEditor, this.options);
        this.editor.subscribe('editableInput', (event, editable) => {
            this.content = editable.innerHTML;
        });
    }

    detached() {
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
    }
}
