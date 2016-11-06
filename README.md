# aurelia-medium-editor
A wrapper around [medium-editor](https://github.com/yabwe/medium-editor) for Aurelia.

## Usage with aurelia-cli
```
npm i -S aurelia-medium-editor
```

```js
// aurelia.json

{
    "name": "aurelia-medium-editor",
    "path": "../node_modules/aurelia-medium-editor/dist",
    "main": "index",
    "resources": [
        "medium-editor.css",
        "themes/default.css"
    ]
}
```

```js
// main.js

aurelia.use
    .plugin('aurelia-medium-editor', {/* medium-editor options */});
```

```html
<template>
    <require from="aurelia-medium-editor/medium-editor.css"></require>
    <require from="aurelia-medium-editor/themes/default.css"></require>

    <medium-editor content.bind="message"></medium-editor>
    <!-- options.bind="{medium-editor options}" to override the options for a particular instance -->
</template>
```
