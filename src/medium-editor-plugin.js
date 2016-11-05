import MediumEditor from './medium-editor';
import {
    customElement,
    inlineView,
    bindable,
    bindingMode
} from 'aurelia-framework';

@customElement('medium-editor')
@inlineView(`<template>
    <div class="editable" innerhtml.bind="content"></div>
</template>`)
export class MediumEditorPlugin {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) content;

    attached() {
        this.editor = new MediumEditor('medium-editor .editable');
        this.editor.subscribe('editableInput', (event, editable) => {
            this.content = editable.innerHTML;
        });
    }

    detached() {
        this.editor.distroy();
    }
}
