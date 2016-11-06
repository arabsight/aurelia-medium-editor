import MediumEditor from './medium-editor';
import {
    customElement,
    inlineView,
    bindable,
    bindingMode,
    inject,
    Container
} from 'aurelia-framework';

@customElement('medium-editor')
@inlineView(`<template>
    <div class="editable" innerhtml.bind="content"></div>
</template>`)
@inject(Container)
export class MediumEditorPlugin {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) content;
    @bindable options;

    constructor(container) {
        this.options = container.get('editor-config');
    }

    attached() {
        this.editor = new MediumEditor('medium-editor .editable', this.options);
        this.editor.subscribe('editableInput', (event, editable) => {
            this.content = editable.innerHTML;
        });
    }

    detached() {
        this.editor.distroy();
    }
}
