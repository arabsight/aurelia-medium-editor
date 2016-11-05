'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MediumEditorPlugin = undefined;

var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

var _mediumEditor = require('./medium-editor');

var _mediumEditor2 = _interopRequireDefault(_mediumEditor);

var _aureliaFramework = require('aurelia-framework');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var MediumEditorPlugin = exports.MediumEditorPlugin = (_dec = (0, _aureliaFramework.customElement)('medium-editor'), _dec2 = (0, _aureliaFramework.inlineView)('<template>\n    <div class="editable" innerhtml.bind="content"></div>\n</template>'), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = _dec2(_class = (_class2 = function () {
    function MediumEditorPlugin() {
        _classCallCheck(this, MediumEditorPlugin);

        _initDefineProp(this, 'content', _descriptor, this);
    }

    MediumEditorPlugin.prototype.attached = function attached() {
        var _this = this;

        this.editor = new _mediumEditor2.default('medium-editor .editable');
        this.editor.subscribe('editableInput', function (event, editable) {
            _this.content = editable.innerHTML;
        });
    };

    MediumEditorPlugin.prototype.detached = function detached() {
        this.editor.distroy();
    };

    return MediumEditorPlugin;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'content', [_dec3], {
    enumerable: true,
    initializer: null
})), _class2)) || _class) || _class);