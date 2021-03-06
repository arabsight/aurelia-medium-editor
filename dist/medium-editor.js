"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (!("classList" in document.createElement("_"))) {
    (function (view) {

        "use strict";

        if (!('Element' in view)) return;

        var classListProp = "classList",
            protoProp = "prototype",
            elemCtrProto = view.Element[protoProp],
            objCtr = Object,
            strTrim = String[protoProp].trim || function () {
            return this.replace(/^\s+|\s+$/g, "");
        },
            arrIndexOf = Array[protoProp].indexOf || function (item) {
            var i = 0,
                len = this.length;
            for (; i < len; i++) {
                if (i in this && this[i] === item) {
                    return i;
                }
            }
            return -1;
        },
            DOMEx = function DOMEx(type, message) {
            this.name = type;
            this.code = DOMException[type];
            this.message = message;
        },
            checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
            if (token === "") {
                throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
            }
            if (/\s/.test(token)) {
                throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
            }
            return arrIndexOf.call(classList, token);
        },
            ClassList = function ClassList(elem) {
            var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                i = 0,
                len = classes.length;
            for (; i < len; i++) {
                this.push(classes[i]);
            }
            this._updateClassName = function () {
                elem.setAttribute("class", this.toString());
            };
        },
            classListProto = ClassList[protoProp] = [],
            classListGetter = function classListGetter() {
            return new ClassList(this);
        };

        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function (i) {
            return this[i] || null;
        };
        classListProto.contains = function (token) {
            token += "";
            return checkTokenAndGetIndex(this, token) !== -1;
        };
        classListProto.add = function () {
            var tokens = arguments,
                i = 0,
                l = tokens.length,
                token,
                updated = false;
            do {
                token = tokens[i] + "";
                if (checkTokenAndGetIndex(this, token) === -1) {
                    this.push(token);
                    updated = true;
                }
            } while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.remove = function () {
            var tokens = arguments,
                i = 0,
                l = tokens.length,
                token,
                updated = false,
                index;
            do {
                token = tokens[i] + "";
                index = checkTokenAndGetIndex(this, token);
                while (index !== -1) {
                    this.splice(index, 1);
                    updated = true;
                    index = checkTokenAndGetIndex(this, token);
                }
            } while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.toggle = function (token, force) {
            token += "";

            var result = this.contains(token),
                method = result ? force !== true && "remove" : force !== false && "add";

            if (method) {
                this[method](token);
            }

            if (force === true || force === false) {
                return force;
            } else {
                return !result;
            }
        };
        classListProto.toString = function () {
            return this.join(" ");
        };

        if (objCtr.defineProperty) {
            var classListPropDesc = {
                get: classListGetter,
                enumerable: true,
                configurable: true
            };
            try {
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            } catch (ex) {
                if (ex.number === -0x7FF5EC54) {
                    classListPropDesc.enumerable = false;
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                }
            }
        } else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }
    })(self);
}

(function (view) {
    "use strict";

    view.URL = view.URL || view.webkitURL;

    if (view.Blob && view.URL) {
        try {
            new Blob();
            return;
        } catch (e) {}
    }

    var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || function (view) {
        var get_class = function get_class(object) {
            return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
        },
            FakeBlobBuilder = function BlobBuilder() {
            this.data = [];
        },
            FakeBlob = function Blob(data, type, encoding) {
            this.data = data;
            this.size = data.length;
            this.type = type;
            this.encoding = encoding;
        },
            FBB_proto = FakeBlobBuilder.prototype,
            FB_proto = FakeBlob.prototype,
            FileReaderSync = view.FileReaderSync,
            FileException = function FileException(type) {
            this.code = this[this.name = type];
        },
            file_ex_codes = ("NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR " + "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR").split(" "),
            file_ex_code = file_ex_codes.length,
            real_URL = view.URL || view.webkitURL || view,
            real_create_object_URL = real_URL.createObjectURL,
            real_revoke_object_URL = real_URL.revokeObjectURL,
            URL = real_URL,
            btoa = view.btoa,
            atob = view.atob,
            ArrayBuffer = view.ArrayBuffer,
            Uint8Array = view.Uint8Array,
            origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;
        FakeBlob.fake = FB_proto.fake = true;
        while (file_ex_code--) {
            FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
        }

        if (!real_URL.createObjectURL) {
            URL = view.URL = function (uri) {
                var uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a"),
                    uri_origin;
                uri_info.href = uri;
                if (!("origin" in uri_info)) {
                    if (uri_info.protocol.toLowerCase() === "data:") {
                        uri_info.origin = null;
                    } else {
                        uri_origin = uri.match(origin);
                        uri_info.origin = uri_origin && uri_origin[1];
                    }
                }
                return uri_info;
            };
        }
        URL.createObjectURL = function (blob) {
            var type = blob.type,
                data_URI_header;
            if (type === null) {
                type = "application/octet-stream";
            }
            if (blob instanceof FakeBlob) {
                data_URI_header = "data:" + type;
                if (blob.encoding === "base64") {
                    return data_URI_header + ";base64," + blob.data;
                } else if (blob.encoding === "URI") {
                    return data_URI_header + "," + decodeURIComponent(blob.data);
                }if (btoa) {
                    return data_URI_header + ";base64," + btoa(blob.data);
                } else {
                    return data_URI_header + "," + encodeURIComponent(blob.data);
                }
            } else if (real_create_object_URL) {
                return real_create_object_URL.call(real_URL, blob);
            }
        };
        URL.revokeObjectURL = function (object_URL) {
            if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
                real_revoke_object_URL.call(real_URL, object_URL);
            }
        };
        FBB_proto.append = function (data) {
            var bb = this.data;

            if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
                var str = "",
                    buf = new Uint8Array(data),
                    i = 0,
                    buf_len = buf.length;
                for (; i < buf_len; i++) {
                    str += String.fromCharCode(buf[i]);
                }
                bb.push(str);
            } else if (get_class(data) === "Blob" || get_class(data) === "File") {
                if (FileReaderSync) {
                    var fr = new FileReaderSync();
                    bb.push(fr.readAsBinaryString(data));
                } else {
                    throw new FileException("NOT_READABLE_ERR");
                }
            } else if (data instanceof FakeBlob) {
                if (data.encoding === "base64" && atob) {
                    bb.push(atob(data.data));
                } else if (data.encoding === "URI") {
                    bb.push(decodeURIComponent(data.data));
                } else if (data.encoding === "raw") {
                    bb.push(data.data);
                }
            } else {
                if (typeof data !== "string") {
                    data += "";
                }

                bb.push(unescape(encodeURIComponent(data)));
            }
        };
        FBB_proto.getBlob = function (type) {
            if (!arguments.length) {
                type = null;
            }
            return new FakeBlob(this.data.join(""), type, "raw");
        };
        FBB_proto.toString = function () {
            return "[object BlobBuilder]";
        };
        FB_proto.slice = function (start, end, type) {
            var args = arguments.length;
            if (args < 3) {
                type = null;
            }
            return new FakeBlob(this.data.slice(start, args > 1 ? end : this.data.length), type, this.encoding);
        };
        FB_proto.toString = function () {
            return "[object Blob]";
        };
        FB_proto.close = function () {
            this.size = 0;
            delete this.data;
        };
        return FakeBlobBuilder;
    }(view);

    view.Blob = function (blobParts, options) {
        var type = options ? options.type || "" : "";
        var builder = new BlobBuilder();
        if (blobParts) {
            for (var i = 0, len = blobParts.length; i < len; i++) {
                if (Uint8Array && blobParts[i] instanceof Uint8Array) {
                    builder.append(blobParts[i].buffer);
                } else {
                    builder.append(blobParts[i]);
                }
            }
        }
        var blob = builder.getBlob(type);
        if (!blob.slice && blob.webkitSlice) {
            blob.slice = blob.webkitSlice;
        }
        return blob;
    };

    var getPrototypeOf = Object.getPrototypeOf || function (object) {
        return object.__proto__;
    };
    view.Blob.prototype = getPrototypeOf(new view.Blob());
})(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined.content || undefined);

(function (root, factory) {
    'use strict';

    var isElectron = (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && typeof process !== 'undefined' && process && process.versions && process.versions.electron;
    if (!isElectron && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') {
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory;
        });
    } else {
        root.MediumEditor = factory;
    }
})(undefined, function () {

    'use strict';

    function MediumEditor(elements, options) {
        'use strict';

        return this.init(elements, options);
    }

    MediumEditor.extensions = {};

    (function (window) {
        'use strict';

        function copyInto(overwrite, dest) {
            var prop,
                sources = Array.prototype.slice.call(arguments, 2);
            dest = dest || {};
            for (var i = 0; i < sources.length; i++) {
                var source = sources[i];
                if (source) {
                    for (prop in source) {
                        if (source.hasOwnProperty(prop) && typeof source[prop] !== 'undefined' && (overwrite || dest.hasOwnProperty(prop) === false)) {
                            dest[prop] = source[prop];
                        }
                    }
                }
            }
            return dest;
        }

        var nodeContainsWorksWithTextNodes = false;
        try {
            var testParent = document.createElement('div'),
                testText = document.createTextNode(' ');
            testParent.appendChild(testText);
            nodeContainsWorksWithTextNodes = testParent.contains(testText);
        } catch (exc) {}

        var Util = {
            isIE: navigator.appName === 'Microsoft Internet Explorer' || navigator.appName === 'Netscape' && new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null,

            isEdge: /Edge\/\d+/.exec(navigator.userAgent) !== null,

            isFF: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,

            isMac: window.navigator.platform.toUpperCase().indexOf('MAC') >= 0,

            keyCode: {
                BACKSPACE: 8,
                TAB: 9,
                ENTER: 13,
                ESCAPE: 27,
                SPACE: 32,
                DELETE: 46,
                K: 75,
                M: 77,
                V: 86
            },

            isMetaCtrlKey: function isMetaCtrlKey(event) {
                if (Util.isMac && event.metaKey || !Util.isMac && event.ctrlKey) {
                    return true;
                }

                return false;
            },

            isKey: function isKey(event, keys) {
                var keyCode = Util.getKeyCode(event);

                if (false === Array.isArray(keys)) {
                    return keyCode === keys;
                }

                if (-1 === keys.indexOf(keyCode)) {
                    return false;
                }

                return true;
            },

            getKeyCode: function getKeyCode(event) {
                var keyCode = event.which;

                if (null === keyCode) {
                    keyCode = event.charCode !== null ? event.charCode : event.keyCode;
                }

                return keyCode;
            },

            blockContainerElementNames: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'ul', 'li', 'ol', 'address', 'article', 'aside', 'audio', 'canvas', 'dd', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'header', 'hgroup', 'main', 'nav', 'noscript', 'output', 'section', 'video', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'],

            emptyElementNames: ['br', 'col', 'colgroup', 'hr', 'img', 'input', 'source', 'wbr'],

            extend: function extend() {
                var args = [true].concat(Array.prototype.slice.call(arguments));
                return copyInto.apply(this, args);
            },

            defaults: function defaults() {
                var args = [false].concat(Array.prototype.slice.call(arguments));
                return copyInto.apply(this, args);
            },

            createLink: function createLink(document, textNodes, href, target) {
                var anchor = document.createElement('a');
                Util.moveTextRangeIntoElement(textNodes[0], textNodes[textNodes.length - 1], anchor);
                anchor.setAttribute('href', href);
                if (target) {
                    if (target === '_blank') {
                        anchor.setAttribute('rel', 'noopener noreferrer');
                    }
                    anchor.setAttribute('target', target);
                }
                return anchor;
            },

            findOrCreateMatchingTextNodes: function findOrCreateMatchingTextNodes(document, element, match) {
                var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ALL, null, false),
                    matchedNodes = [],
                    currentTextIndex = 0,
                    startReached = false,
                    currentNode = null,
                    newNode = null;

                while ((currentNode = treeWalker.nextNode()) !== null) {
                    if (currentNode.nodeType > 3) {
                        continue;
                    } else if (currentNode.nodeType === 3) {
                        if (!startReached && match.start < currentTextIndex + currentNode.nodeValue.length) {
                            startReached = true;
                            newNode = Util.splitStartNodeIfNeeded(currentNode, match.start, currentTextIndex);
                        }
                        if (startReached) {
                            Util.splitEndNodeIfNeeded(currentNode, newNode, match.end, currentTextIndex);
                        }
                        if (startReached && currentTextIndex === match.end) {
                            break;
                        } else if (startReached && currentTextIndex > match.end + 1) {
                            throw new Error('PerformLinking overshot the target!');
                        }

                        if (startReached) {
                            matchedNodes.push(newNode || currentNode);
                        }

                        currentTextIndex += currentNode.nodeValue.length;
                        if (newNode !== null) {
                            currentTextIndex += newNode.nodeValue.length;

                            treeWalker.nextNode();
                        }
                        newNode = null;
                    } else if (currentNode.tagName.toLowerCase() === 'img') {
                        if (!startReached && match.start <= currentTextIndex) {
                            startReached = true;
                        }
                        if (startReached) {
                            matchedNodes.push(currentNode);
                        }
                    }
                }
                return matchedNodes;
            },

            splitStartNodeIfNeeded: function splitStartNodeIfNeeded(currentNode, matchStartIndex, currentTextIndex) {
                if (matchStartIndex !== currentTextIndex) {
                    return currentNode.splitText(matchStartIndex - currentTextIndex);
                }
                return null;
            },

            splitEndNodeIfNeeded: function splitEndNodeIfNeeded(currentNode, newNode, matchEndIndex, currentTextIndex) {
                var textIndexOfEndOfFarthestNode, endSplitPoint;
                textIndexOfEndOfFarthestNode = currentTextIndex + currentNode.nodeValue.length + (newNode ? newNode.nodeValue.length : 0) - 1;
                endSplitPoint = matchEndIndex - currentTextIndex - (newNode ? currentNode.nodeValue.length : 0);
                if (textIndexOfEndOfFarthestNode >= matchEndIndex && currentTextIndex !== textIndexOfEndOfFarthestNode && endSplitPoint !== 0) {
                    (newNode || currentNode).splitText(endSplitPoint);
                }
            },

            splitByBlockElements: function splitByBlockElements(element) {
                if (element.nodeType !== 3 && element.nodeType !== 1) {
                    return [];
                }

                var toRet = [],
                    blockElementQuery = MediumEditor.util.blockContainerElementNames.join(',');

                if (element.nodeType === 3 || element.querySelectorAll(blockElementQuery).length === 0) {
                    return [element];
                }

                for (var i = 0; i < element.childNodes.length; i++) {
                    var child = element.childNodes[i];
                    if (child.nodeType === 3) {
                        toRet.push(child);
                    } else if (child.nodeType === 1) {
                        var blockElements = child.querySelectorAll(blockElementQuery);
                        if (blockElements.length === 0) {
                            toRet.push(child);
                        } else {
                            toRet = toRet.concat(MediumEditor.util.splitByBlockElements(child));
                        }
                    }
                }

                return toRet;
            },

            findAdjacentTextNodeWithContent: function findAdjacentTextNodeWithContent(rootNode, targetNode, ownerDocument) {
                var pastTarget = false,
                    nextNode,
                    nodeIterator = ownerDocument.createNodeIterator(rootNode, NodeFilter.SHOW_TEXT, null, false);

                nextNode = nodeIterator.nextNode();
                while (nextNode) {
                    if (nextNode === targetNode) {
                        pastTarget = true;
                    } else if (pastTarget) {
                        if (nextNode.nodeType === 3 && nextNode.nodeValue && nextNode.nodeValue.trim().length > 0) {
                            break;
                        }
                    }
                    nextNode = nodeIterator.nextNode();
                }

                return nextNode;
            },

            findPreviousSibling: function findPreviousSibling(node) {
                if (!node || Util.isMediumEditorElement(node)) {
                    return false;
                }

                var previousSibling = node.previousSibling;
                while (!previousSibling && !Util.isMediumEditorElement(node.parentNode)) {
                    node = node.parentNode;
                    previousSibling = node.previousSibling;
                }

                return previousSibling;
            },

            isDescendant: function isDescendant(parent, child, checkEquality) {
                if (!parent || !child) {
                    return false;
                }
                if (parent === child) {
                    return !!checkEquality;
                }

                if (parent.nodeType !== 1) {
                    return false;
                }
                if (nodeContainsWorksWithTextNodes || child.nodeType !== 3) {
                    return parent.contains(child);
                }
                var node = child.parentNode;
                while (node !== null) {
                    if (node === parent) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            },

            isElement: function isElement(obj) {
                return !!(obj && obj.nodeType === 1);
            },

            throttle: function throttle(func, wait) {
                var THROTTLE_INTERVAL = 50,
                    context,
                    args,
                    result,
                    timeout = null,
                    previous = 0,
                    later = function later() {
                    previous = Date.now();
                    timeout = null;
                    result = func.apply(context, args);
                    if (!timeout) {
                        context = args = null;
                    }
                };

                if (!wait && wait !== 0) {
                    wait = THROTTLE_INTERVAL;
                }

                return function () {
                    var now = Date.now(),
                        remaining = wait - (now - previous);

                    context = this;
                    args = arguments;
                    if (remaining <= 0 || remaining > wait) {
                        if (timeout) {
                            clearTimeout(timeout);
                            timeout = null;
                        }
                        previous = now;
                        result = func.apply(context, args);
                        if (!timeout) {
                            context = args = null;
                        }
                    } else if (!timeout) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },

            traverseUp: function traverseUp(current, testElementFunction) {
                if (!current) {
                    return false;
                }

                do {
                    if (current.nodeType === 1) {
                        if (testElementFunction(current)) {
                            return current;
                        }

                        if (Util.isMediumEditorElement(current)) {
                            return false;
                        }
                    }

                    current = current.parentNode;
                } while (current);

                return false;
            },

            htmlEntities: function htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            },

            insertHTMLCommand: function insertHTMLCommand(doc, html) {
                var selection,
                    range,
                    el,
                    fragment,
                    node,
                    lastNode,
                    toReplace,
                    res = false,
                    ecArgs = ['insertHTML', false, html];

                if (!MediumEditor.util.isEdge && doc.queryCommandSupported('insertHTML')) {
                    try {
                        return doc.execCommand.apply(doc, ecArgs);
                    } catch (ignore) {}
                }

                selection = doc.getSelection();
                if (selection.rangeCount) {
                    range = selection.getRangeAt(0);
                    toReplace = range.commonAncestorContainer;

                    if (Util.isMediumEditorElement(toReplace) && !toReplace.firstChild) {
                        range.selectNode(toReplace.appendChild(doc.createTextNode('')));
                    } else if (toReplace.nodeType === 3 && range.startOffset === 0 && range.endOffset === toReplace.nodeValue.length || toReplace.nodeType !== 3 && toReplace.innerHTML === range.toString()) {
                        while (!Util.isMediumEditorElement(toReplace) && toReplace.parentNode && toReplace.parentNode.childNodes.length === 1 && !Util.isMediumEditorElement(toReplace.parentNode)) {
                            toReplace = toReplace.parentNode;
                        }
                        range.selectNode(toReplace);
                    }
                    range.deleteContents();

                    el = doc.createElement('div');
                    el.innerHTML = html;
                    fragment = doc.createDocumentFragment();
                    while (el.firstChild) {
                        node = el.firstChild;
                        lastNode = fragment.appendChild(node);
                    }
                    range.insertNode(fragment);

                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        MediumEditor.selection.selectRange(doc, range);
                    }
                    res = true;
                }

                if (doc.execCommand.callListeners) {
                    doc.execCommand.callListeners(ecArgs, res);
                }
                return res;
            },

            execFormatBlock: function execFormatBlock(doc, tagName) {
                var blockContainer = Util.getTopBlockContainer(MediumEditor.selection.getSelectionStart(doc)),
                    childNodes;

                if (tagName === 'blockquote') {
                    if (blockContainer) {
                        childNodes = Array.prototype.slice.call(blockContainer.childNodes);

                        if (childNodes.some(function (childNode) {
                            return Util.isBlockContainer(childNode);
                        })) {
                            return doc.execCommand('outdent', false, null);
                        }
                    }

                    if (Util.isIE) {
                        return doc.execCommand('indent', false, tagName);
                    }
                }

                if (blockContainer && tagName === blockContainer.nodeName.toLowerCase()) {
                    tagName = 'p';
                }

                if (Util.isIE) {
                    tagName = '<' + tagName + '>';
                }

                if (blockContainer && blockContainer.nodeName.toLowerCase() === 'blockquote') {
                    if (Util.isIE && tagName === '<p>') {
                        return doc.execCommand('outdent', false, tagName);
                    }

                    if ((Util.isFF || Util.isEdge) && tagName === 'p') {
                        childNodes = Array.prototype.slice.call(blockContainer.childNodes);

                        if (childNodes.some(function (childNode) {
                            return !Util.isBlockContainer(childNode);
                        })) {
                            doc.execCommand('formatBlock', false, tagName);
                        }
                        return doc.execCommand('outdent', false, tagName);
                    }
                }

                return doc.execCommand('formatBlock', false, tagName);
            },

            setTargetBlank: function setTargetBlank(el, anchorUrl) {
                var i,
                    url = anchorUrl || false;
                if (el.nodeName.toLowerCase() === 'a') {
                    el.target = '_blank';
                    el.rel = 'noopener noreferrer';
                } else {
                    el = el.getElementsByTagName('a');

                    for (i = 0; i < el.length; i += 1) {
                        if (false === url || url === el[i].attributes.href.value) {
                            el[i].target = '_blank';
                            el[i].rel = 'noopener noreferrer';
                        }
                    }
                }
            },

            removeTargetBlank: function removeTargetBlank(el, anchorUrl) {
                var i;
                if (el.nodeName.toLowerCase() === 'a') {
                    el.removeAttribute('target');
                    el.removeAttribute('rel');
                } else {
                    el = el.getElementsByTagName('a');

                    for (i = 0; i < el.length; i += 1) {
                        if (anchorUrl === el[i].attributes.href.value) {
                            el[i].removeAttribute('target');
                            el[i].removeAttribute('rel');
                        }
                    }
                }
            },

            addClassToAnchors: function addClassToAnchors(el, buttonClass) {
                var classes = buttonClass.split(' '),
                    i,
                    j;
                if (el.nodeName.toLowerCase() === 'a') {
                    for (j = 0; j < classes.length; j += 1) {
                        el.classList.add(classes[j]);
                    }
                } else {
                    var aChildren = el.getElementsByTagName('a');
                    if (aChildren.length === 0) {
                        var parentAnchor = Util.getClosestTag(el, 'a');
                        el = parentAnchor ? [parentAnchor] : [];
                    } else {
                        el = aChildren;
                    }
                    for (i = 0; i < el.length; i += 1) {
                        for (j = 0; j < classes.length; j += 1) {
                            el[i].classList.add(classes[j]);
                        }
                    }
                }
            },

            isListItem: function isListItem(node) {
                if (!node) {
                    return false;
                }
                if (node.nodeName.toLowerCase() === 'li') {
                    return true;
                }

                var parentNode = node.parentNode,
                    tagName = parentNode.nodeName.toLowerCase();
                while (tagName === 'li' || !Util.isBlockContainer(parentNode) && tagName !== 'div') {
                    if (tagName === 'li') {
                        return true;
                    }
                    parentNode = parentNode.parentNode;
                    if (parentNode) {
                        tagName = parentNode.nodeName.toLowerCase();
                    } else {
                        return false;
                    }
                }
                return false;
            },

            cleanListDOM: function cleanListDOM(ownerDocument, element) {
                if (element.nodeName.toLowerCase() !== 'li') {
                    return;
                }

                var list = element.parentElement;

                if (list.parentElement.nodeName.toLowerCase() === 'p') {
                    Util.unwrap(list.parentElement, ownerDocument);

                    MediumEditor.selection.moveCursor(ownerDocument, element.firstChild, element.firstChild.textContent.length);
                }
            },

            splitOffDOMTree: function splitOffDOMTree(rootNode, leafNode, splitLeft) {
                var splitOnNode = leafNode,
                    createdNode = null,
                    splitRight = !splitLeft;

                while (splitOnNode !== rootNode) {
                    var currParent = splitOnNode.parentNode,
                        newParent = currParent.cloneNode(false),
                        targetNode = splitRight ? splitOnNode : currParent.firstChild,
                        appendLast;

                    if (createdNode) {
                        if (splitRight) {
                            newParent.appendChild(createdNode);
                        } else {
                            appendLast = createdNode;
                        }
                    }
                    createdNode = newParent;

                    while (targetNode) {
                        var sibling = targetNode.nextSibling;

                        if (targetNode === splitOnNode) {
                            if (!targetNode.hasChildNodes()) {
                                targetNode.parentNode.removeChild(targetNode);
                            } else {
                                targetNode = targetNode.cloneNode(false);
                            }

                            if (targetNode.textContent) {
                                createdNode.appendChild(targetNode);
                            }

                            targetNode = splitRight ? sibling : null;
                        } else {
                            targetNode.parentNode.removeChild(targetNode);
                            if (targetNode.hasChildNodes() || targetNode.textContent) {
                                createdNode.appendChild(targetNode);
                            }

                            targetNode = sibling;
                        }
                    }

                    if (appendLast) {
                        createdNode.appendChild(appendLast);
                    }

                    splitOnNode = currParent;
                }

                return createdNode;
            },

            moveTextRangeIntoElement: function moveTextRangeIntoElement(startNode, endNode, newElement) {
                if (!startNode || !endNode) {
                    return false;
                }

                var rootNode = Util.findCommonRoot(startNode, endNode);
                if (!rootNode) {
                    return false;
                }

                if (endNode === startNode) {
                    var temp = startNode.parentNode,
                        sibling = startNode.nextSibling;
                    temp.removeChild(startNode);
                    newElement.appendChild(startNode);
                    if (sibling) {
                        temp.insertBefore(newElement, sibling);
                    } else {
                        temp.appendChild(newElement);
                    }
                    return newElement.hasChildNodes();
                }

                var rootChildren = [],
                    firstChild,
                    lastChild,
                    nextNode;
                for (var i = 0; i < rootNode.childNodes.length; i++) {
                    nextNode = rootNode.childNodes[i];
                    if (!firstChild) {
                        if (Util.isDescendant(nextNode, startNode, true)) {
                            firstChild = nextNode;
                        }
                    } else {
                        if (Util.isDescendant(nextNode, endNode, true)) {
                            lastChild = nextNode;
                            break;
                        } else {
                            rootChildren.push(nextNode);
                        }
                    }
                }

                var afterLast = lastChild.nextSibling,
                    fragment = rootNode.ownerDocument.createDocumentFragment();

                if (firstChild === startNode) {
                    firstChild.parentNode.removeChild(firstChild);
                    fragment.appendChild(firstChild);
                } else {
                    fragment.appendChild(Util.splitOffDOMTree(firstChild, startNode));
                }

                rootChildren.forEach(function (element) {
                    element.parentNode.removeChild(element);
                    fragment.appendChild(element);
                });

                if (lastChild === endNode) {
                    lastChild.parentNode.removeChild(lastChild);
                    fragment.appendChild(lastChild);
                } else {
                    fragment.appendChild(Util.splitOffDOMTree(lastChild, endNode, true));
                }

                newElement.appendChild(fragment);

                if (lastChild.parentNode === rootNode) {
                    rootNode.insertBefore(newElement, lastChild);
                } else if (afterLast) {
                    rootNode.insertBefore(newElement, afterLast);
                } else {
                    rootNode.appendChild(newElement);
                }

                return newElement.hasChildNodes();
            },

            depthOfNode: function depthOfNode(inNode) {
                var theDepth = 0,
                    node = inNode;
                while (node.parentNode !== null) {
                    node = node.parentNode;
                    theDepth++;
                }
                return theDepth;
            },

            findCommonRoot: function findCommonRoot(inNode1, inNode2) {
                var depth1 = Util.depthOfNode(inNode1),
                    depth2 = Util.depthOfNode(inNode2),
                    node1 = inNode1,
                    node2 = inNode2;

                while (depth1 !== depth2) {
                    if (depth1 > depth2) {
                        node1 = node1.parentNode;
                        depth1 -= 1;
                    } else {
                        node2 = node2.parentNode;
                        depth2 -= 1;
                    }
                }

                while (node1 !== node2) {
                    node1 = node1.parentNode;
                    node2 = node2.parentNode;
                }

                return node1;
            },


            isElementAtBeginningOfBlock: function isElementAtBeginningOfBlock(node) {
                var textVal, sibling;
                while (!Util.isBlockContainer(node) && !Util.isMediumEditorElement(node)) {
                    sibling = node;
                    while (sibling = sibling.previousSibling) {
                        textVal = sibling.nodeType === 3 ? sibling.nodeValue : sibling.textContent;
                        if (textVal.length > 0) {
                            return false;
                        }
                    }
                    node = node.parentNode;
                }
                return true;
            },

            isMediumEditorElement: function isMediumEditorElement(element) {
                return element && element.getAttribute && !!element.getAttribute('data-medium-editor-element');
            },

            getContainerEditorElement: function getContainerEditorElement(element) {
                return Util.traverseUp(element, function (node) {
                    return Util.isMediumEditorElement(node);
                });
            },

            isBlockContainer: function isBlockContainer(element) {
                return element && element.nodeType !== 3 && Util.blockContainerElementNames.indexOf(element.nodeName.toLowerCase()) !== -1;
            },

            getClosestBlockContainer: function getClosestBlockContainer(node) {
                return Util.traverseUp(node, function (node) {
                    return Util.isBlockContainer(node) || Util.isMediumEditorElement(node);
                });
            },

            getTopBlockContainer: function getTopBlockContainer(element) {
                var topBlock = Util.isBlockContainer(element) ? element : false;
                Util.traverseUp(element, function (el) {
                    if (Util.isBlockContainer(el)) {
                        topBlock = el;
                    }
                    if (!topBlock && Util.isMediumEditorElement(el)) {
                        topBlock = el;
                        return true;
                    }
                    return false;
                });
                return topBlock;
            },

            getFirstSelectableLeafNode: function getFirstSelectableLeafNode(element) {
                while (element && element.firstChild) {
                    element = element.firstChild;
                }

                element = Util.traverseUp(element, function (el) {
                    return Util.emptyElementNames.indexOf(el.nodeName.toLowerCase()) === -1;
                });

                if (element.nodeName.toLowerCase() === 'table') {
                    var firstCell = element.querySelector('th, td');
                    if (firstCell) {
                        element = firstCell;
                    }
                }
                return element;
            },

            getFirstTextNode: function getFirstTextNode(element) {
                Util.warn('getFirstTextNode is deprecated and will be removed in version 6.0.0');
                return Util._getFirstTextNode(element);
            },

            _getFirstTextNode: function _getFirstTextNode(element) {
                if (element.nodeType === 3) {
                    return element;
                }

                for (var i = 0; i < element.childNodes.length; i++) {
                    var textNode = Util._getFirstTextNode(element.childNodes[i]);
                    if (textNode !== null) {
                        return textNode;
                    }
                }
                return null;
            },

            ensureUrlHasProtocol: function ensureUrlHasProtocol(url) {
                if (url.indexOf('://') === -1) {
                    return 'http://' + url;
                }
                return url;
            },

            warn: function warn() {
                if (window.console !== undefined && typeof window.console.warn === 'function') {
                    window.console.warn.apply(window.console, arguments);
                }
            },

            deprecated: function deprecated(oldName, newName, version) {
                var m = oldName + ' is deprecated, please use ' + newName + ' instead.';
                if (version) {
                    m += ' Will be removed in ' + version;
                }
                Util.warn(m);
            },

            deprecatedMethod: function deprecatedMethod(oldName, newName, args, version) {
                Util.deprecated(oldName, newName, version);
                if (typeof this[newName] === 'function') {
                    this[newName].apply(this, args);
                }
            },

            cleanupAttrs: function cleanupAttrs(el, attrs) {
                attrs.forEach(function (attr) {
                    el.removeAttribute(attr);
                });
            },

            cleanupTags: function cleanupTags(el, tags) {
                if (tags.indexOf(el.nodeName.toLowerCase()) !== -1) {
                    el.parentNode.removeChild(el);
                }
            },

            unwrapTags: function unwrapTags(el, tags) {
                if (tags.indexOf(el.nodeName.toLowerCase()) !== -1) {
                    MediumEditor.util.unwrap(el, document);
                }
            },

            getClosestTag: function getClosestTag(el, tag) {
                return Util.traverseUp(el, function (element) {
                    return element.nodeName.toLowerCase() === tag.toLowerCase();
                });
            },

            unwrap: function unwrap(el, doc) {
                var fragment = doc.createDocumentFragment(),
                    nodes = Array.prototype.slice.call(el.childNodes);

                for (var i = 0; i < nodes.length; i++) {
                    fragment.appendChild(nodes[i]);
                }

                if (fragment.childNodes.length) {
                    el.parentNode.replaceChild(fragment, el);
                } else {
                    el.parentNode.removeChild(el);
                }
            },

            guid: function guid() {
                function _s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                }

                return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4() + _s4();
            }
        };

        MediumEditor.util = Util;
    })(window);

    (function () {
        'use strict';

        var Extension = function Extension(options) {
            MediumEditor.util.extend(this, options);
        };

        Extension.extend = function (protoProps) {

            var parent = this,
                child;

            if (protoProps && protoProps.hasOwnProperty('constructor')) {
                child = protoProps.constructor;
            } else {
                child = function child() {
                    return parent.apply(this, arguments);
                };
            }

            MediumEditor.util.extend(child, parent);

            var Surrogate = function Surrogate() {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate();

            if (protoProps) {
                MediumEditor.util.extend(child.prototype, protoProps);
            }

            return child;
        };

        Extension.prototype = {
            init: function init() {},

            base: undefined,

            name: undefined,

            checkState: undefined,

            destroy: undefined,

            queryCommandState: undefined,

            isActive: undefined,

            isAlreadyApplied: undefined,

            setActive: undefined,

            setInactive: undefined,

            getInteractionElements: undefined,

            'window': undefined,

            'document': undefined,

            getEditorElements: function getEditorElements() {
                return this.base.elements;
            },

            getEditorId: function getEditorId() {
                return this.base.id;
            },

            getEditorOption: function getEditorOption(option) {
                return this.base.options[option];
            }
        };

        ['execAction', 'on', 'off', 'subscribe', 'trigger'].forEach(function (helper) {
            Extension.prototype[helper] = function () {
                return this.base[helper].apply(this.base, arguments);
            };
        });

        MediumEditor.Extension = Extension;
    })();

    (function () {
        'use strict';

        function filterOnlyParentElements(node) {
            if (MediumEditor.util.isBlockContainer(node)) {
                return NodeFilter.FILTER_ACCEPT;
            } else {
                return NodeFilter.FILTER_SKIP;
            }
        }

        var Selection = {
            findMatchingSelectionParent: function findMatchingSelectionParent(testElementFunction, contentWindow) {
                var selection = contentWindow.getSelection(),
                    range,
                    current;

                if (selection.rangeCount === 0) {
                    return false;
                }

                range = selection.getRangeAt(0);
                current = range.commonAncestorContainer;

                return MediumEditor.util.traverseUp(current, testElementFunction);
            },

            getSelectionElement: function getSelectionElement(contentWindow) {
                return this.findMatchingSelectionParent(function (el) {
                    return MediumEditor.util.isMediumEditorElement(el);
                }, contentWindow);
            },

            exportSelection: function exportSelection(root, doc) {
                if (!root) {
                    return null;
                }

                var selectionState = null,
                    selection = doc.getSelection();

                if (selection.rangeCount > 0) {
                    var range = selection.getRangeAt(0),
                        preSelectionRange = range.cloneRange(),
                        start;

                    preSelectionRange.selectNodeContents(root);
                    preSelectionRange.setEnd(range.startContainer, range.startOffset);
                    start = preSelectionRange.toString().length;

                    selectionState = {
                        start: start,
                        end: start + range.toString().length
                    };

                    if (this.doesRangeStartWithImages(range, doc)) {
                        selectionState.startsWithImage = true;
                    }

                    var trailingImageCount = this.getTrailingImageCount(root, selectionState, range.endContainer, range.endOffset);
                    if (trailingImageCount) {
                        selectionState.trailingImageCount = trailingImageCount;
                    }

                    if (start !== 0) {
                        var emptyBlocksIndex = this.getIndexRelativeToAdjacentEmptyBlocks(doc, root, range.startContainer, range.startOffset);
                        if (emptyBlocksIndex !== -1) {
                            selectionState.emptyBlocksIndex = emptyBlocksIndex;
                        }
                    }
                }

                return selectionState;
            },

            importSelection: function importSelection(selectionState, root, doc, favorLaterSelectionAnchor) {
                if (!selectionState || !root) {
                    return;
                }

                var range = doc.createRange();
                range.setStart(root, 0);
                range.collapse(true);

                var node = root,
                    nodeStack = [],
                    charIndex = 0,
                    foundStart = false,
                    foundEnd = false,
                    trailingImageCount = 0,
                    stop = false,
                    nextCharIndex,
                    allowRangeToStartAtEndOfNode = false,
                    lastTextNode = null;

                if (favorLaterSelectionAnchor || selectionState.startsWithImage || typeof selectionState.emptyBlocksIndex !== 'undefined') {
                    allowRangeToStartAtEndOfNode = true;
                }

                while (!stop && node) {
                    if (node.nodeType > 3) {
                        node = nodeStack.pop();
                        continue;
                    }

                    if (node.nodeType === 3 && !foundEnd) {
                        nextCharIndex = charIndex + node.length;

                        if (!foundStart && selectionState.start >= charIndex && selectionState.start <= nextCharIndex) {
                            if (allowRangeToStartAtEndOfNode || selectionState.start < nextCharIndex) {
                                range.setStart(node, selectionState.start - charIndex);
                                foundStart = true;
                            } else {
                                    lastTextNode = node;
                                }
                        }

                        if (foundStart && selectionState.end >= charIndex && selectionState.end <= nextCharIndex) {
                            if (!selectionState.trailingImageCount) {
                                range.setEnd(node, selectionState.end - charIndex);
                                stop = true;
                            } else {
                                foundEnd = true;
                            }
                        }
                        charIndex = nextCharIndex;
                    } else {
                        if (selectionState.trailingImageCount && foundEnd) {
                            if (node.nodeName.toLowerCase() === 'img') {
                                trailingImageCount++;
                            }
                            if (trailingImageCount === selectionState.trailingImageCount) {
                                var endIndex = 0;
                                while (node.parentNode.childNodes[endIndex] !== node) {
                                    endIndex++;
                                }
                                range.setEnd(node.parentNode, endIndex + 1);
                                stop = true;
                            }
                        }

                        if (!stop && node.nodeType === 1) {
                            var i = node.childNodes.length - 1;
                            while (i >= 0) {
                                nodeStack.push(node.childNodes[i]);
                                i -= 1;
                            }
                        }
                    }

                    if (!stop) {
                        node = nodeStack.pop();
                    }
                }

                if (!foundStart && lastTextNode) {
                    range.setStart(lastTextNode, lastTextNode.length);
                    range.setEnd(lastTextNode, lastTextNode.length);
                }

                if (typeof selectionState.emptyBlocksIndex !== 'undefined') {
                    range = this.importSelectionMoveCursorPastBlocks(doc, root, selectionState.emptyBlocksIndex, range);
                }

                if (favorLaterSelectionAnchor) {
                    range = this.importSelectionMoveCursorPastAnchor(selectionState, range);
                }

                this.selectRange(doc, range);
            },

            importSelectionMoveCursorPastAnchor: function importSelectionMoveCursorPastAnchor(selectionState, range) {
                var nodeInsideAnchorTagFunction = function nodeInsideAnchorTagFunction(node) {
                    return node.nodeName.toLowerCase() === 'a';
                };
                if (selectionState.start === selectionState.end && range.startContainer.nodeType === 3 && range.startOffset === range.startContainer.nodeValue.length && MediumEditor.util.traverseUp(range.startContainer, nodeInsideAnchorTagFunction)) {
                    var prevNode = range.startContainer,
                        currentNode = range.startContainer.parentNode;
                    while (currentNode !== null && currentNode.nodeName.toLowerCase() !== 'a') {
                        if (currentNode.childNodes[currentNode.childNodes.length - 1] !== prevNode) {
                            currentNode = null;
                        } else {
                            prevNode = currentNode;
                            currentNode = currentNode.parentNode;
                        }
                    }
                    if (currentNode !== null && currentNode.nodeName.toLowerCase() === 'a') {
                        var currentNodeIndex = null;
                        for (var i = 0; currentNodeIndex === null && i < currentNode.parentNode.childNodes.length; i++) {
                            if (currentNode.parentNode.childNodes[i] === currentNode) {
                                currentNodeIndex = i;
                            }
                        }
                        range.setStart(currentNode.parentNode, currentNodeIndex + 1);
                        range.collapse(true);
                    }
                }
                return range;
            },

            importSelectionMoveCursorPastBlocks: function importSelectionMoveCursorPastBlocks(doc, root, index, range) {
                var treeWalker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filterOnlyParentElements, false),
                    startContainer = range.startContainer,
                    startBlock,
                    targetNode,
                    currIndex = 0;
                index = index || 1;
                if (startContainer.nodeType === 3 && MediumEditor.util.isBlockContainer(startContainer.previousSibling)) {
                    startBlock = startContainer.previousSibling;
                } else {
                    startBlock = MediumEditor.util.getClosestBlockContainer(startContainer);
                }

                while (treeWalker.nextNode()) {
                    if (!targetNode) {
                        if (startBlock === treeWalker.currentNode) {
                            targetNode = treeWalker.currentNode;
                        }
                    } else {
                        targetNode = treeWalker.currentNode;
                        currIndex++;

                        if (currIndex === index) {
                            break;
                        }

                        if (targetNode.textContent.length > 0) {
                            break;
                        }
                    }
                }

                if (!targetNode) {
                    targetNode = startBlock;
                }

                range.setStart(MediumEditor.util.getFirstSelectableLeafNode(targetNode), 0);

                return range;
            },

            getIndexRelativeToAdjacentEmptyBlocks: function getIndexRelativeToAdjacentEmptyBlocks(doc, root, cursorContainer, cursorOffset) {
                if (cursorContainer.textContent.length > 0 && cursorOffset > 0) {
                    return -1;
                }

                var node = cursorContainer;
                if (node.nodeType !== 3) {
                    node = cursorContainer.childNodes[cursorOffset];
                }
                if (node) {
                    if (!MediumEditor.util.isElementAtBeginningOfBlock(node)) {
                        return -1;
                    }

                    var previousSibling = MediumEditor.util.findPreviousSibling(node);

                    if (!previousSibling) {
                        return -1;
                    } else if (previousSibling.nodeValue) {
                            return -1;
                        }
                }

                var closestBlock = MediumEditor.util.getClosestBlockContainer(cursorContainer),
                    treeWalker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filterOnlyParentElements, false),
                    emptyBlocksCount = 0;
                while (treeWalker.nextNode()) {
                    var blockIsEmpty = treeWalker.currentNode.textContent === '';
                    if (blockIsEmpty || emptyBlocksCount > 0) {
                        emptyBlocksCount += 1;
                    }
                    if (treeWalker.currentNode === closestBlock) {
                        return emptyBlocksCount;
                    }
                    if (!blockIsEmpty) {
                        emptyBlocksCount = 0;
                    }
                }

                return emptyBlocksCount;
            },

            doesRangeStartWithImages: function doesRangeStartWithImages(range, doc) {
                if (range.startOffset !== 0 || range.startContainer.nodeType !== 1) {
                    return false;
                }

                if (range.startContainer.nodeName.toLowerCase() === 'img') {
                    return true;
                }

                var img = range.startContainer.querySelector('img');
                if (!img) {
                    return false;
                }

                var treeWalker = doc.createTreeWalker(range.startContainer, NodeFilter.SHOW_ALL, null, false);
                while (treeWalker.nextNode()) {
                    var next = treeWalker.currentNode;

                    if (next === img) {
                        break;
                    }

                    if (next.nodeValue) {
                        return false;
                    }
                }

                return true;
            },

            getTrailingImageCount: function getTrailingImageCount(root, selectionState, endContainer, endOffset) {
                if (endOffset === 0 || endContainer.nodeType !== 1) {
                    return 0;
                }

                if (endContainer.nodeName.toLowerCase() !== 'img' && !endContainer.querySelector('img')) {
                    return 0;
                }

                var lastNode = endContainer.childNodes[endOffset - 1];
                while (lastNode.hasChildNodes()) {
                    lastNode = lastNode.lastChild;
                }

                var node = root,
                    nodeStack = [],
                    charIndex = 0,
                    foundStart = false,
                    foundEnd = false,
                    stop = false,
                    nextCharIndex,
                    trailingImages = 0;

                while (!stop && node) {
                    if (node.nodeType > 3) {
                        node = nodeStack.pop();
                        continue;
                    }

                    if (node.nodeType === 3 && !foundEnd) {
                        trailingImages = 0;
                        nextCharIndex = charIndex + node.length;
                        if (!foundStart && selectionState.start >= charIndex && selectionState.start <= nextCharIndex) {
                            foundStart = true;
                        }
                        if (foundStart && selectionState.end >= charIndex && selectionState.end <= nextCharIndex) {
                            foundEnd = true;
                        }
                        charIndex = nextCharIndex;
                    } else {
                        if (node.nodeName.toLowerCase() === 'img') {
                            trailingImages++;
                        }

                        if (node === lastNode) {
                            stop = true;
                        } else if (node.nodeType === 1) {
                            var i = node.childNodes.length - 1;
                            while (i >= 0) {
                                nodeStack.push(node.childNodes[i]);
                                i -= 1;
                            }
                        }
                    }

                    if (!stop) {
                        node = nodeStack.pop();
                    }
                }

                return trailingImages;
            },

            selectionContainsContent: function selectionContainsContent(doc) {
                var sel = doc.getSelection();

                if (!sel || sel.isCollapsed || !sel.rangeCount) {
                    return false;
                }

                if (sel.toString().trim() !== '') {
                    return true;
                }

                var selectionNode = this.getSelectedParentElement(sel.getRangeAt(0));
                if (selectionNode) {
                    if (selectionNode.nodeName.toLowerCase() === 'img' || selectionNode.nodeType === 1 && selectionNode.querySelector('img')) {
                        return true;
                    }
                }

                return false;
            },

            selectionInContentEditableFalse: function selectionInContentEditableFalse(contentWindow) {
                var sawtrue,
                    sawfalse = this.findMatchingSelectionParent(function (el) {
                    var ce = el && el.getAttribute('contenteditable');
                    if (ce === 'true') {
                        sawtrue = true;
                    }
                    return el.nodeName !== '#text' && ce === 'false';
                }, contentWindow);

                return !sawtrue && sawfalse;
            },

            getSelectionHtml: function getSelectionHtml(doc) {
                var i,
                    html = '',
                    sel = doc.getSelection(),
                    len,
                    container;
                if (sel.rangeCount) {
                    container = doc.createElement('div');
                    for (i = 0, len = sel.rangeCount; i < len; i += 1) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
                return html;
            },

            getCaretOffsets: function getCaretOffsets(element, range) {
                var preCaretRange, postCaretRange;

                if (!range) {
                    range = window.getSelection().getRangeAt(0);
                }

                preCaretRange = range.cloneRange();
                postCaretRange = range.cloneRange();

                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);

                postCaretRange.selectNodeContents(element);
                postCaretRange.setStart(range.endContainer, range.endOffset);

                return {
                    left: preCaretRange.toString().length,
                    right: postCaretRange.toString().length
                };
            },

            rangeSelectsSingleNode: function rangeSelectsSingleNode(range) {
                var startNode = range.startContainer;
                return startNode === range.endContainer && startNode.hasChildNodes() && range.endOffset === range.startOffset + 1;
            },

            getSelectedParentElement: function getSelectedParentElement(range) {
                if (!range) {
                    return null;
                }

                if (this.rangeSelectsSingleNode(range) && range.startContainer.childNodes[range.startOffset].nodeType !== 3) {
                    return range.startContainer.childNodes[range.startOffset];
                }

                if (range.startContainer.nodeType === 3) {
                    return range.startContainer.parentNode;
                }

                return range.startContainer;
            },

            getSelectedElements: function getSelectedElements(doc) {
                var selection = doc.getSelection(),
                    range,
                    toRet,
                    currNode;

                if (!selection.rangeCount || selection.isCollapsed || !selection.getRangeAt(0).commonAncestorContainer) {
                    return [];
                }

                range = selection.getRangeAt(0);

                if (range.commonAncestorContainer.nodeType === 3) {
                    toRet = [];
                    currNode = range.commonAncestorContainer;
                    while (currNode.parentNode && currNode.parentNode.childNodes.length === 1) {
                        toRet.push(currNode.parentNode);
                        currNode = currNode.parentNode;
                    }

                    return toRet;
                }

                return [].filter.call(range.commonAncestorContainer.getElementsByTagName('*'), function (el) {
                    return typeof selection.containsNode === 'function' ? selection.containsNode(el, true) : true;
                });
            },

            selectNode: function selectNode(node, doc) {
                var range = doc.createRange();
                range.selectNodeContents(node);
                this.selectRange(doc, range);
            },

            select: function select(doc, startNode, startOffset, endNode, endOffset) {
                var range = doc.createRange();
                range.setStart(startNode, startOffset);
                if (endNode) {
                    range.setEnd(endNode, endOffset);
                } else {
                    range.collapse(true);
                }
                this.selectRange(doc, range);
                return range;
            },

            clearSelection: function clearSelection(doc, moveCursorToStart) {
                if (moveCursorToStart) {
                    doc.getSelection().collapseToStart();
                } else {
                    doc.getSelection().collapseToEnd();
                }
            },

            moveCursor: function moveCursor(doc, node, offset) {
                this.select(doc, node, offset);
            },

            getSelectionRange: function getSelectionRange(ownerDocument) {
                var selection = ownerDocument.getSelection();
                if (selection.rangeCount === 0) {
                    return null;
                }
                return selection.getRangeAt(0);
            },

            selectRange: function selectRange(ownerDocument, range) {
                var selection = ownerDocument.getSelection();

                selection.removeAllRanges();
                selection.addRange(range);
            },

            getSelectionStart: function getSelectionStart(ownerDocument) {
                var node = ownerDocument.getSelection().anchorNode,
                    startNode = node && node.nodeType === 3 ? node.parentNode : node;

                return startNode;
            }
        };

        MediumEditor.selection = Selection;
    })();

    (function () {
        'use strict';

        function isElementDescendantOfExtension(extensions, element) {
            return extensions.some(function (extension) {
                if (typeof extension.getInteractionElements !== 'function') {
                    return false;
                }

                var extensionElements = extension.getInteractionElements();
                if (!extensionElements) {
                    return false;
                }

                if (!Array.isArray(extensionElements)) {
                    extensionElements = [extensionElements];
                }
                return extensionElements.some(function (el) {
                    return MediumEditor.util.isDescendant(el, element, true);
                });
            });
        }

        var Events = function Events(instance) {
            this.base = instance;
            this.options = this.base.options;
            this.events = [];
            this.disabledEvents = {};
            this.customEvents = {};
            this.listeners = {};
        };

        Events.prototype = {
            InputEventOnContenteditableSupported: !MediumEditor.util.isIE && !MediumEditor.util.isEdge,

            attachDOMEvent: function attachDOMEvent(targets, event, listener, useCapture) {
                var win = this.base.options.contentWindow,
                    doc = this.base.options.ownerDocument;

                targets = MediumEditor.util.isElement(targets) || [win, doc].indexOf(targets) > -1 ? [targets] : targets;

                Array.prototype.forEach.call(targets, function (target) {
                    target.addEventListener(event, listener, useCapture);
                    this.events.push([target, event, listener, useCapture]);
                }.bind(this));
            },

            detachDOMEvent: function detachDOMEvent(targets, event, listener, useCapture) {
                var index,
                    e,
                    win = this.base.options.contentWindow,
                    doc = this.base.options.ownerDocument;

                if (targets !== null) {
                    targets = MediumEditor.util.isElement(targets) || [win, doc].indexOf(targets) > -1 ? [targets] : targets;

                    Array.prototype.forEach.call(targets, function (target) {
                        index = this.indexOfListener(target, event, listener, useCapture);
                        if (index !== -1) {
                            e = this.events.splice(index, 1)[0];
                            e[0].removeEventListener(e[1], e[2], e[3]);
                        }
                    }.bind(this));
                }
            },

            indexOfListener: function indexOfListener(target, event, listener, useCapture) {
                var i, n, item;
                for (i = 0, n = this.events.length; i < n; i = i + 1) {
                    item = this.events[i];
                    if (item[0] === target && item[1] === event && item[2] === listener && item[3] === useCapture) {
                        return i;
                    }
                }
                return -1;
            },

            detachAllDOMEvents: function detachAllDOMEvents() {
                var e = this.events.pop();
                while (e) {
                    e[0].removeEventListener(e[1], e[2], e[3]);
                    e = this.events.pop();
                }
            },

            detachAllEventsFromElement: function detachAllEventsFromElement(element) {
                var filtered = this.events.filter(function (e) {
                    return e && e[0].getAttribute && e[0].getAttribute('medium-editor-index') === element.getAttribute('medium-editor-index');
                });

                for (var i = 0, len = filtered.length; i < len; i++) {
                    var e = filtered[i];
                    this.detachDOMEvent(e[0], e[1], e[2], e[3]);
                }
            },

            attachAllEventsToElement: function attachAllEventsToElement(element) {
                if (this.listeners['editableInput']) {
                    this.contentCache[element.getAttribute('medium-editor-index')] = element.innerHTML;
                }

                if (this.eventsCache) {
                    this.eventsCache.forEach(function (e) {
                        this.attachDOMEvent(element, e['name'], e['handler'].bind(this));
                    }, this);
                }
            },

            enableCustomEvent: function enableCustomEvent(event) {
                if (this.disabledEvents[event] !== undefined) {
                    delete this.disabledEvents[event];
                }
            },

            disableCustomEvent: function disableCustomEvent(event) {
                this.disabledEvents[event] = true;
            },

            attachCustomEvent: function attachCustomEvent(event, listener) {
                this.setupListener(event);
                if (!this.customEvents[event]) {
                    this.customEvents[event] = [];
                }
                this.customEvents[event].push(listener);
            },

            detachCustomEvent: function detachCustomEvent(event, listener) {
                var index = this.indexOfCustomListener(event, listener);
                if (index !== -1) {
                    this.customEvents[event].splice(index, 1);
                }
            },

            indexOfCustomListener: function indexOfCustomListener(event, listener) {
                if (!this.customEvents[event] || !this.customEvents[event].length) {
                    return -1;
                }

                return this.customEvents[event].indexOf(listener);
            },

            detachAllCustomEvents: function detachAllCustomEvents() {
                this.customEvents = {};
            },

            triggerCustomEvent: function triggerCustomEvent(name, data, editable) {
                if (this.customEvents[name] && !this.disabledEvents[name]) {
                    this.customEvents[name].forEach(function (listener) {
                        listener(data, editable);
                    });
                }
            },

            destroy: function destroy() {
                this.detachAllDOMEvents();
                this.detachAllCustomEvents();
                this.detachExecCommand();

                if (this.base.elements) {
                    this.base.elements.forEach(function (element) {
                        element.removeAttribute('data-medium-focused');
                    });
                }
            },

            attachToExecCommand: function attachToExecCommand() {
                if (this.execCommandListener) {
                    return;
                }

                this.execCommandListener = function (execInfo) {
                    this.handleDocumentExecCommand(execInfo);
                }.bind(this);

                this.wrapExecCommand();

                this.options.ownerDocument.execCommand.listeners.push(this.execCommandListener);
            },

            detachExecCommand: function detachExecCommand() {
                var doc = this.options.ownerDocument;
                if (!this.execCommandListener || !doc.execCommand.listeners) {
                    return;
                }

                var index = doc.execCommand.listeners.indexOf(this.execCommandListener);
                if (index !== -1) {
                    doc.execCommand.listeners.splice(index, 1);
                }

                if (!doc.execCommand.listeners.length) {
                    this.unwrapExecCommand();
                }
            },

            wrapExecCommand: function wrapExecCommand() {
                var doc = this.options.ownerDocument;

                if (doc.execCommand.listeners) {
                    return;
                }

                var callListeners = function callListeners(args, result) {
                    if (doc.execCommand.listeners) {
                        doc.execCommand.listeners.forEach(function (listener) {
                            listener({
                                command: args[0],
                                value: args[2],
                                args: args,
                                result: result
                            });
                        });
                    }
                },
                    wrapper = function wrapper() {
                    var result = doc.execCommand.orig.apply(this, arguments);

                    if (!doc.execCommand.listeners) {
                        return result;
                    }

                    var args = Array.prototype.slice.call(arguments);
                    callListeners(args, result);

                    return result;
                };

                wrapper.orig = doc.execCommand;

                wrapper.listeners = [];

                wrapper.callListeners = callListeners;

                doc.execCommand = wrapper;
            },

            unwrapExecCommand: function unwrapExecCommand() {
                var doc = this.options.ownerDocument;
                if (!doc.execCommand.orig) {
                    return;
                }

                doc.execCommand = doc.execCommand.orig;
            },

            setupListener: function setupListener(name) {
                if (this.listeners[name]) {
                    return;
                }

                switch (name) {
                    case 'externalInteraction':
                        this.attachDOMEvent(this.options.ownerDocument.body, 'mousedown', this.handleBodyMousedown.bind(this), true);
                        this.attachDOMEvent(this.options.ownerDocument.body, 'click', this.handleBodyClick.bind(this), true);
                        this.attachDOMEvent(this.options.ownerDocument.body, 'focus', this.handleBodyFocus.bind(this), true);
                        break;
                    case 'blur':
                        this.setupListener('externalInteraction');
                        break;
                    case 'focus':
                        this.setupListener('externalInteraction');
                        break;
                    case 'editableInput':
                        this.contentCache = {};
                        this.base.elements.forEach(function (element) {
                            this.contentCache[element.getAttribute('medium-editor-index')] = element.innerHTML;
                        }, this);

                        if (this.InputEventOnContenteditableSupported) {
                            this.attachToEachElement('input', this.handleInput);
                        }

                        if (!this.InputEventOnContenteditableSupported) {
                            this.setupListener('editableKeypress');
                            this.keypressUpdateInput = true;
                            this.attachDOMEvent(document, 'selectionchange', this.handleDocumentSelectionChange.bind(this));

                            this.attachToExecCommand();
                        }
                        break;
                    case 'editableClick':
                        this.attachToEachElement('click', this.handleClick);
                        break;
                    case 'editableBlur':
                        this.attachToEachElement('blur', this.handleBlur);
                        break;
                    case 'editableKeypress':
                        this.attachToEachElement('keypress', this.handleKeypress);
                        break;
                    case 'editableKeyup':
                        this.attachToEachElement('keyup', this.handleKeyup);
                        break;
                    case 'editableKeydown':
                        this.attachToEachElement('keydown', this.handleKeydown);
                        break;
                    case 'editableKeydownSpace':
                        this.setupListener('editableKeydown');
                        break;
                    case 'editableKeydownEnter':
                        this.setupListener('editableKeydown');
                        break;
                    case 'editableKeydownTab':
                        this.setupListener('editableKeydown');
                        break;
                    case 'editableKeydownDelete':
                        this.setupListener('editableKeydown');
                        break;
                    case 'editableMouseover':
                        this.attachToEachElement('mouseover', this.handleMouseover);
                        break;
                    case 'editableDrag':
                        this.attachToEachElement('dragover', this.handleDragging);
                        this.attachToEachElement('dragleave', this.handleDragging);
                        break;
                    case 'editableDrop':
                        this.attachToEachElement('drop', this.handleDrop);
                        break;

                    case 'editablePaste':
                        this.attachToEachElement('paste', this.handlePaste);
                        break;
                }
                this.listeners[name] = true;
            },

            attachToEachElement: function attachToEachElement(name, handler) {
                if (!this.eventsCache) {
                    this.eventsCache = [];
                }

                this.base.elements.forEach(function (element) {
                    this.attachDOMEvent(element, name, handler.bind(this));
                }, this);

                this.eventsCache.push({ 'name': name, 'handler': handler });
            },

            cleanupElement: function cleanupElement(element) {
                var index = element.getAttribute('medium-editor-index');
                if (index) {
                    this.detachAllEventsFromElement(element);
                    if (this.contentCache) {
                        delete this.contentCache[index];
                    }
                }
            },

            focusElement: function focusElement(element) {
                element.focus();
                this.updateFocus(element, { target: element, type: 'focus' });
            },

            updateFocus: function updateFocus(target, eventObj) {
                var hadFocus = this.base.getFocusedElement(),
                    toFocus;

                if (hadFocus && eventObj.type === 'click' && this.lastMousedownTarget && (MediumEditor.util.isDescendant(hadFocus, this.lastMousedownTarget, true) || isElementDescendantOfExtension(this.base.extensions, this.lastMousedownTarget))) {
                    toFocus = hadFocus;
                }

                if (!toFocus) {
                    this.base.elements.some(function (element) {
                        if (!toFocus && MediumEditor.util.isDescendant(element, target, true)) {
                            toFocus = element;
                        }

                        return !!toFocus;
                    }, this);
                }

                var externalEvent = !MediumEditor.util.isDescendant(hadFocus, target, true) && !isElementDescendantOfExtension(this.base.extensions, target);

                if (toFocus !== hadFocus) {
                    if (hadFocus && externalEvent) {
                        hadFocus.removeAttribute('data-medium-focused');
                        this.triggerCustomEvent('blur', eventObj, hadFocus);
                    }

                    if (toFocus) {
                        toFocus.setAttribute('data-medium-focused', true);
                        this.triggerCustomEvent('focus', eventObj, toFocus);
                    }
                }

                if (externalEvent) {
                    this.triggerCustomEvent('externalInteraction', eventObj);
                }
            },

            updateInput: function updateInput(target, eventObj) {
                if (!this.contentCache) {
                    return;
                }

                var index = target.getAttribute('medium-editor-index'),
                    html = target.innerHTML;

                if (html !== this.contentCache[index]) {
                    this.triggerCustomEvent('editableInput', eventObj, target);
                }
                this.contentCache[index] = html;
            },

            handleDocumentSelectionChange: function handleDocumentSelectionChange(event) {
                if (event.currentTarget && event.currentTarget.activeElement) {
                    var activeElement = event.currentTarget.activeElement,
                        currentTarget;

                    this.base.elements.some(function (element) {
                        if (MediumEditor.util.isDescendant(element, activeElement, true)) {
                            currentTarget = element;
                            return true;
                        }
                        return false;
                    }, this);

                    if (currentTarget) {
                        this.updateInput(currentTarget, { target: activeElement, currentTarget: currentTarget });
                    }
                }
            },

            handleDocumentExecCommand: function handleDocumentExecCommand() {
                var target = this.base.getFocusedElement();
                if (target) {
                    this.updateInput(target, { target: target, currentTarget: target });
                }
            },

            handleBodyClick: function handleBodyClick(event) {
                this.updateFocus(event.target, event);
            },

            handleBodyFocus: function handleBodyFocus(event) {
                this.updateFocus(event.target, event);
            },

            handleBodyMousedown: function handleBodyMousedown(event) {
                this.lastMousedownTarget = event.target;
            },

            handleInput: function handleInput(event) {
                this.updateInput(event.currentTarget, event);
            },

            handleClick: function handleClick(event) {
                this.triggerCustomEvent('editableClick', event, event.currentTarget);
            },

            handleBlur: function handleBlur(event) {
                this.triggerCustomEvent('editableBlur', event, event.currentTarget);
            },

            handleKeypress: function handleKeypress(event) {
                this.triggerCustomEvent('editableKeypress', event, event.currentTarget);

                if (this.keypressUpdateInput) {
                    var eventObj = { target: event.target, currentTarget: event.currentTarget };

                    setTimeout(function () {
                        this.updateInput(eventObj.currentTarget, eventObj);
                    }.bind(this), 0);
                }
            },

            handleKeyup: function handleKeyup(event) {
                this.triggerCustomEvent('editableKeyup', event, event.currentTarget);
            },

            handleMouseover: function handleMouseover(event) {
                this.triggerCustomEvent('editableMouseover', event, event.currentTarget);
            },

            handleDragging: function handleDragging(event) {
                this.triggerCustomEvent('editableDrag', event, event.currentTarget);
            },

            handleDrop: function handleDrop(event) {
                this.triggerCustomEvent('editableDrop', event, event.currentTarget);
            },

            handlePaste: function handlePaste(event) {
                this.triggerCustomEvent('editablePaste', event, event.currentTarget);
            },

            handleKeydown: function handleKeydown(event) {

                this.triggerCustomEvent('editableKeydown', event, event.currentTarget);

                if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.SPACE)) {
                    return this.triggerCustomEvent('editableKeydownSpace', event, event.currentTarget);
                }

                if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.ENTER) || event.ctrlKey && MediumEditor.util.isKey(event, MediumEditor.util.keyCode.M)) {
                    return this.triggerCustomEvent('editableKeydownEnter', event, event.currentTarget);
                }

                if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.TAB)) {
                    return this.triggerCustomEvent('editableKeydownTab', event, event.currentTarget);
                }

                if (MediumEditor.util.isKey(event, [MediumEditor.util.keyCode.DELETE, MediumEditor.util.keyCode.BACKSPACE])) {
                    return this.triggerCustomEvent('editableKeydownDelete', event, event.currentTarget);
                }
            }
        };

        MediumEditor.Events = Events;
    })();

    (function () {
        'use strict';

        var Button = MediumEditor.Extension.extend({
            action: undefined,

            aria: undefined,

            tagNames: undefined,

            style: undefined,

            useQueryState: undefined,

            contentDefault: undefined,

            contentFA: undefined,

            classList: undefined,

            attrs: undefined,

            constructor: function constructor(options) {
                if (Button.isBuiltInButton(options)) {
                    MediumEditor.Extension.call(this, this.defaults[options]);
                } else {
                    MediumEditor.Extension.call(this, options);
                }
            },

            init: function init() {
                MediumEditor.Extension.prototype.init.apply(this, arguments);

                this.button = this.createButton();
                this.on(this.button, 'click', this.handleClick.bind(this));
            },

            getButton: function getButton() {
                return this.button;
            },

            getAction: function getAction() {
                return typeof this.action === 'function' ? this.action(this.base.options) : this.action;
            },

            getAria: function getAria() {
                return typeof this.aria === 'function' ? this.aria(this.base.options) : this.aria;
            },

            getTagNames: function getTagNames() {
                return typeof this.tagNames === 'function' ? this.tagNames(this.base.options) : this.tagNames;
            },

            createButton: function createButton() {
                var button = this.document.createElement('button'),
                    content = this.contentDefault,
                    ariaLabel = this.getAria(),
                    buttonLabels = this.getEditorOption('buttonLabels');

                button.classList.add('medium-editor-action');
                button.classList.add('medium-editor-action-' + this.name);
                if (this.classList) {
                    this.classList.forEach(function (className) {
                        button.classList.add(className);
                    });
                }

                button.setAttribute('data-action', this.getAction());
                if (ariaLabel) {
                    button.setAttribute('title', ariaLabel);
                    button.setAttribute('aria-label', ariaLabel);
                }
                if (this.attrs) {
                    Object.keys(this.attrs).forEach(function (attr) {
                        button.setAttribute(attr, this.attrs[attr]);
                    }, this);
                }

                if (buttonLabels === 'fontawesome' && this.contentFA) {
                    content = this.contentFA;
                }
                button.innerHTML = content;
                return button;
            },

            handleClick: function handleClick(event) {
                event.preventDefault();
                event.stopPropagation();

                var action = this.getAction();

                if (action) {
                    this.execAction(action);
                }
            },

            isActive: function isActive() {
                return this.button.classList.contains(this.getEditorOption('activeButtonClass'));
            },

            setInactive: function setInactive() {
                this.button.classList.remove(this.getEditorOption('activeButtonClass'));
                delete this.knownState;
            },

            setActive: function setActive() {
                this.button.classList.add(this.getEditorOption('activeButtonClass'));
                delete this.knownState;
            },

            queryCommandState: function queryCommandState() {
                var queryState = null;
                if (this.useQueryState) {
                    queryState = this.base.queryCommandState(this.getAction());
                }
                return queryState;
            },

            isAlreadyApplied: function isAlreadyApplied(node) {
                var isMatch = false,
                    tagNames = this.getTagNames(),
                    styleVals,
                    computedStyle;

                if (this.knownState === false || this.knownState === true) {
                    return this.knownState;
                }

                if (tagNames && tagNames.length > 0) {
                    isMatch = tagNames.indexOf(node.nodeName.toLowerCase()) !== -1;
                }

                if (!isMatch && this.style) {
                    styleVals = this.style.value.split('|');
                    computedStyle = this.window.getComputedStyle(node, null).getPropertyValue(this.style.prop);
                    styleVals.forEach(function (val) {
                        if (!this.knownState) {
                            isMatch = computedStyle.indexOf(val) !== -1;

                            if (isMatch || this.style.prop !== 'text-decoration') {
                                this.knownState = isMatch;
                            }
                        }
                    }, this);
                }

                return isMatch;
            }
        });

        Button.isBuiltInButton = function (name) {
            return typeof name === 'string' && MediumEditor.extensions.button.prototype.defaults.hasOwnProperty(name);
        };

        MediumEditor.extensions.button = Button;
    })();

    (function () {
        'use strict';

        MediumEditor.extensions.button.prototype.defaults = {
            'bold': {
                name: 'bold',
                action: 'bold',
                aria: 'bold',
                tagNames: ['b', 'strong'],
                style: {
                    prop: 'font-weight',
                    value: '700|bold'
                },
                useQueryState: true,
                contentDefault: '<b>B</b>',
                contentFA: '<i class="fa fa-bold"></i>'
            },
            'italic': {
                name: 'italic',
                action: 'italic',
                aria: 'italic',
                tagNames: ['i', 'em'],
                style: {
                    prop: 'font-style',
                    value: 'italic'
                },
                useQueryState: true,
                contentDefault: '<b><i>I</i></b>',
                contentFA: '<i class="fa fa-italic"></i>'
            },
            'underline': {
                name: 'underline',
                action: 'underline',
                aria: 'underline',
                tagNames: ['u'],
                style: {
                    prop: 'text-decoration',
                    value: 'underline'
                },
                useQueryState: true,
                contentDefault: '<b><u>U</u></b>',
                contentFA: '<i class="fa fa-underline"></i>'
            },
            'strikethrough': {
                name: 'strikethrough',
                action: 'strikethrough',
                aria: 'strike through',
                tagNames: ['strike'],
                style: {
                    prop: 'text-decoration',
                    value: 'line-through'
                },
                useQueryState: true,
                contentDefault: '<s>A</s>',
                contentFA: '<i class="fa fa-strikethrough"></i>'
            },
            'superscript': {
                name: 'superscript',
                action: 'superscript',
                aria: 'superscript',
                tagNames: ['sup'],

                contentDefault: '<b>x<sup>1</sup></b>',
                contentFA: '<i class="fa fa-superscript"></i>'
            },
            'subscript': {
                name: 'subscript',
                action: 'subscript',
                aria: 'subscript',
                tagNames: ['sub'],

                contentDefault: '<b>x<sub>1</sub></b>',
                contentFA: '<i class="fa fa-subscript"></i>'
            },
            'image': {
                name: 'image',
                action: 'image',
                aria: 'image',
                tagNames: ['img'],
                contentDefault: '<b>image</b>',
                contentFA: '<i class="fa fa-picture-o"></i>'
            },
            'html': {
                name: 'html',
                action: 'html',
                aria: 'evaluate html',
                tagNames: ['iframe', 'object'],
                contentDefault: '<b>html</b>',
                contentFA: '<i class="fa fa-code"></i>'
            },
            'orderedlist': {
                name: 'orderedlist',
                action: 'insertorderedlist',
                aria: 'ordered list',
                tagNames: ['ol'],
                useQueryState: true,
                contentDefault: '<b>1.</b>',
                contentFA: '<i class="fa fa-list-ol"></i>'
            },
            'unorderedlist': {
                name: 'unorderedlist',
                action: 'insertunorderedlist',
                aria: 'unordered list',
                tagNames: ['ul'],
                useQueryState: true,
                contentDefault: '<b>&bull;</b>',
                contentFA: '<i class="fa fa-list-ul"></i>'
            },
            'indent': {
                name: 'indent',
                action: 'indent',
                aria: 'indent',
                tagNames: [],
                contentDefault: '<b>&rarr;</b>',
                contentFA: '<i class="fa fa-indent"></i>'
            },
            'outdent': {
                name: 'outdent',
                action: 'outdent',
                aria: 'outdent',
                tagNames: [],
                contentDefault: '<b>&larr;</b>',
                contentFA: '<i class="fa fa-outdent"></i>'
            },
            'justifyCenter': {
                name: 'justifyCenter',
                action: 'justifyCenter',
                aria: 'center justify',
                tagNames: [],
                style: {
                    prop: 'text-align',
                    value: 'center'
                },
                contentDefault: '<b>C</b>',
                contentFA: '<i class="fa fa-align-center"></i>'
            },
            'justifyFull': {
                name: 'justifyFull',
                action: 'justifyFull',
                aria: 'full justify',
                tagNames: [],
                style: {
                    prop: 'text-align',
                    value: 'justify'
                },
                contentDefault: '<b>J</b>',
                contentFA: '<i class="fa fa-align-justify"></i>'
            },
            'justifyLeft': {
                name: 'justifyLeft',
                action: 'justifyLeft',
                aria: 'left justify',
                tagNames: [],
                style: {
                    prop: 'text-align',
                    value: 'left'
                },
                contentDefault: '<b>L</b>',
                contentFA: '<i class="fa fa-align-left"></i>'
            },
            'justifyRight': {
                name: 'justifyRight',
                action: 'justifyRight',
                aria: 'right justify',
                tagNames: [],
                style: {
                    prop: 'text-align',
                    value: 'right'
                },
                contentDefault: '<b>R</b>',
                contentFA: '<i class="fa fa-align-right"></i>'
            },

            'removeFormat': {
                name: 'removeFormat',
                aria: 'remove formatting',
                action: 'removeFormat',
                contentDefault: '<b>X</b>',
                contentFA: '<i class="fa fa-eraser"></i>'
            },

            'quote': {
                name: 'quote',
                action: 'append-blockquote',
                aria: 'blockquote',
                tagNames: ['blockquote'],
                contentDefault: '<b>&ldquo;</b>',
                contentFA: '<i class="fa fa-quote-right"></i>'
            },
            'pre': {
                name: 'pre',
                action: 'append-pre',
                aria: 'preformatted text',
                tagNames: ['pre'],
                contentDefault: '<b>0101</b>',
                contentFA: '<i class="fa fa-code fa-lg"></i>'
            },
            'h1': {
                name: 'h1',
                action: 'append-h1',
                aria: 'header type one',
                tagNames: ['h1'],
                contentDefault: '<b>H1</b>',
                contentFA: '<i class="fa fa-header"><sup>1</sup>'
            },
            'h2': {
                name: 'h2',
                action: 'append-h2',
                aria: 'header type two',
                tagNames: ['h2'],
                contentDefault: '<b>H2</b>',
                contentFA: '<i class="fa fa-header"><sup>2</sup>'
            },
            'h3': {
                name: 'h3',
                action: 'append-h3',
                aria: 'header type three',
                tagNames: ['h3'],
                contentDefault: '<b>H3</b>',
                contentFA: '<i class="fa fa-header"><sup>3</sup>'
            },
            'h4': {
                name: 'h4',
                action: 'append-h4',
                aria: 'header type four',
                tagNames: ['h4'],
                contentDefault: '<b>H4</b>',
                contentFA: '<i class="fa fa-header"><sup>4</sup>'
            },
            'h5': {
                name: 'h5',
                action: 'append-h5',
                aria: 'header type five',
                tagNames: ['h5'],
                contentDefault: '<b>H5</b>',
                contentFA: '<i class="fa fa-header"><sup>5</sup>'
            },
            'h6': {
                name: 'h6',
                action: 'append-h6',
                aria: 'header type six',
                tagNames: ['h6'],
                contentDefault: '<b>H6</b>',
                contentFA: '<i class="fa fa-header"><sup>6</sup>'
            }
        };
    })();

    (function () {
        'use strict';

        var FormExtension = MediumEditor.extensions.button.extend({

            init: function init() {
                MediumEditor.extensions.button.prototype.init.apply(this, arguments);
            },

            formSaveLabel: '&#10003;',
            formCloseLabel: '&times;',

            activeClass: 'medium-editor-toolbar-form-active',

            hasForm: true,

            getForm: function getForm() {},

            isDisplayed: function isDisplayed() {
                if (this.hasForm) {
                    return this.getForm().classList.contains(this.activeClass);
                }
                return false;
            },

            showForm: function showForm() {
                if (this.hasForm) {
                    this.getForm().classList.add(this.activeClass);
                }
            },

            hideForm: function hideForm() {
                if (this.hasForm) {
                    this.getForm().classList.remove(this.activeClass);
                }
            },

            showToolbarDefaultActions: function showToolbarDefaultActions() {
                var toolbar = this.base.getExtensionByName('toolbar');
                if (toolbar) {
                    toolbar.showToolbarDefaultActions();
                }
            },

            hideToolbarDefaultActions: function hideToolbarDefaultActions() {
                var toolbar = this.base.getExtensionByName('toolbar');
                if (toolbar) {
                    toolbar.hideToolbarDefaultActions();
                }
            },

            setToolbarPosition: function setToolbarPosition() {
                var toolbar = this.base.getExtensionByName('toolbar');
                if (toolbar) {
                    toolbar.setToolbarPosition();
                }
            }
        });

        MediumEditor.extensions.form = FormExtension;
    })();
    (function () {
        'use strict';

        var AnchorForm = MediumEditor.extensions.form.extend({
            customClassOption: null,

            customClassOptionText: 'Button',

            linkValidation: false,

            placeholderText: 'Paste or type a link',

            targetCheckbox: false,

            targetCheckboxText: 'Open in new window',

            name: 'anchor',
            action: 'createLink',
            aria: 'link',
            tagNames: ['a'],
            contentDefault: '<b>#</b>',
            contentFA: '<i class="fa fa-link"></i>',

            init: function init() {
                MediumEditor.extensions.form.prototype.init.apply(this, arguments);

                this.subscribe('editableKeydown', this.handleKeydown.bind(this));
            },

            handleClick: function handleClick(event) {
                event.preventDefault();
                event.stopPropagation();

                var range = MediumEditor.selection.getSelectionRange(this.document);

                if (range.startContainer.nodeName.toLowerCase() === 'a' || range.endContainer.nodeName.toLowerCase() === 'a' || MediumEditor.util.getClosestTag(MediumEditor.selection.getSelectedParentElement(range), 'a')) {
                    return this.execAction('unlink');
                }

                if (!this.isDisplayed()) {
                    this.showForm();
                }

                return false;
            },

            handleKeydown: function handleKeydown(event) {
                if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.K) && MediumEditor.util.isMetaCtrlKey(event) && !event.shiftKey) {
                    this.handleClick(event);
                }
            },

            getForm: function getForm() {
                if (!this.form) {
                    this.form = this.createForm();
                }
                return this.form;
            },

            getTemplate: function getTemplate() {
                var template = ['<input type="text" class="medium-editor-toolbar-input" placeholder="', this.placeholderText, '">'];

                template.push('<a href="#" class="medium-editor-toolbar-save">', this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel, '</a>');

                template.push('<a href="#" class="medium-editor-toolbar-close">', this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel, '</a>');

                if (this.targetCheckbox) {
                    template.push('<div class="medium-editor-toolbar-form-row">', '<input type="checkbox" class="medium-editor-toolbar-anchor-target" id="medium-editor-toolbar-anchor-target-field-' + this.getEditorId() + '">', '<label for="medium-editor-toolbar-anchor-target-field-' + this.getEditorId() + '">', this.targetCheckboxText, '</label>', '</div>');
                }

                if (this.customClassOption) {
                    template.push('<div class="medium-editor-toolbar-form-row">', '<input type="checkbox" class="medium-editor-toolbar-anchor-button">', '<label>', this.customClassOptionText, '</label>', '</div>');
                }

                return template.join('');
            },

            isDisplayed: function isDisplayed() {
                return MediumEditor.extensions.form.prototype.isDisplayed.apply(this);
            },

            hideForm: function hideForm() {
                MediumEditor.extensions.form.prototype.hideForm.apply(this);
                this.getInput().value = '';
            },

            showForm: function showForm(opts) {
                var input = this.getInput(),
                    targetCheckbox = this.getAnchorTargetCheckbox(),
                    buttonCheckbox = this.getAnchorButtonCheckbox();

                opts = opts || { value: '' };

                if (typeof opts === 'string') {
                    opts = {
                        value: opts
                    };
                }

                this.base.saveSelection();
                this.hideToolbarDefaultActions();
                MediumEditor.extensions.form.prototype.showForm.apply(this);
                this.setToolbarPosition();

                input.value = opts.value;
                input.focus();

                if (targetCheckbox) {
                    targetCheckbox.checked = opts.target === '_blank';
                }

                if (buttonCheckbox) {
                    var classList = opts.buttonClass ? opts.buttonClass.split(' ') : [];
                    buttonCheckbox.checked = classList.indexOf(this.customClassOption) !== -1;
                }
            },

            destroy: function destroy() {
                if (!this.form) {
                    return false;
                }

                if (this.form.parentNode) {
                    this.form.parentNode.removeChild(this.form);
                }

                delete this.form;
            },

            getFormOpts: function getFormOpts() {
                var targetCheckbox = this.getAnchorTargetCheckbox(),
                    buttonCheckbox = this.getAnchorButtonCheckbox(),
                    opts = {
                    value: this.getInput().value.trim()
                };

                if (this.linkValidation) {
                    opts.value = this.checkLinkFormat(opts.value);
                }

                opts.target = '_self';
                if (targetCheckbox && targetCheckbox.checked) {
                    opts.target = '_blank';
                }

                if (buttonCheckbox && buttonCheckbox.checked) {
                    opts.buttonClass = this.customClassOption;
                }

                return opts;
            },

            doFormSave: function doFormSave() {
                var opts = this.getFormOpts();
                this.completeFormSave(opts);
            },

            completeFormSave: function completeFormSave(opts) {
                this.base.restoreSelection();
                this.execAction(this.action, opts);
                this.base.checkSelection();
            },

            ensureEncodedUri: function ensureEncodedUri(str) {
                return str === decodeURI(str) ? encodeURI(str) : str;
            },

            ensureEncodedUriComponent: function ensureEncodedUriComponent(str) {
                return str === decodeURIComponent(str) ? encodeURIComponent(str) : str;
            },

            ensureEncodedParam: function ensureEncodedParam(param) {
                var split = param.split('='),
                    key = split[0],
                    val = split[1];

                return key + (val === undefined ? '' : '=' + this.ensureEncodedUriComponent(val));
            },

            ensureEncodedQuery: function ensureEncodedQuery(queryString) {
                return queryString.split('&').map(this.ensureEncodedParam.bind(this)).join('&');
            },

            checkLinkFormat: function checkLinkFormat(value) {
                var urlSchemeRegex = /^([a-z]+:)?\/\/|^(mailto|tel|maps):|^\#/i,
                    hasScheme = urlSchemeRegex.test(value),
                    scheme = '',
                    telRegex = /^\+?\s?\(?(?:\d\s?\-?\)?){3,20}$/,
                    urlParts = value.match(/^(.*?)(?:\?(.*?))?(?:#(.*))?$/),
                    path = urlParts[1],
                    query = urlParts[2],
                    fragment = urlParts[3];

                if (telRegex.test(value)) {
                    return 'tel:' + value;
                }

                if (!hasScheme) {
                    var host = path.split('/')[0];

                    if (host.match(/.+(\.|:).+/) || host === 'localhost') {
                        scheme = 'http://';
                    }
                }

                return scheme + this.ensureEncodedUri(path) + (query === undefined ? '' : '?' + this.ensureEncodedQuery(query)) + (fragment === undefined ? '' : '#' + fragment);
            },

            doFormCancel: function doFormCancel() {
                this.base.restoreSelection();
                this.base.checkSelection();
            },

            attachFormEvents: function attachFormEvents(form) {
                var close = form.querySelector('.medium-editor-toolbar-close'),
                    save = form.querySelector('.medium-editor-toolbar-save'),
                    input = form.querySelector('.medium-editor-toolbar-input');

                this.on(form, 'click', this.handleFormClick.bind(this));

                this.on(input, 'keyup', this.handleTextboxKeyup.bind(this));

                this.on(close, 'click', this.handleCloseClick.bind(this));

                this.on(save, 'click', this.handleSaveClick.bind(this), true);
            },

            createForm: function createForm() {
                var doc = this.document,
                    form = doc.createElement('div');

                form.className = 'medium-editor-toolbar-form';
                form.id = 'medium-editor-toolbar-form-anchor-' + this.getEditorId();
                form.innerHTML = this.getTemplate();
                this.attachFormEvents(form);

                return form;
            },

            getInput: function getInput() {
                return this.getForm().querySelector('input.medium-editor-toolbar-input');
            },

            getAnchorTargetCheckbox: function getAnchorTargetCheckbox() {
                return this.getForm().querySelector('.medium-editor-toolbar-anchor-target');
            },

            getAnchorButtonCheckbox: function getAnchorButtonCheckbox() {
                return this.getForm().querySelector('.medium-editor-toolbar-anchor-button');
            },

            handleTextboxKeyup: function handleTextboxKeyup(event) {
                if (event.keyCode === MediumEditor.util.keyCode.ENTER) {
                    event.preventDefault();
                    this.doFormSave();
                    return;
                }

                if (event.keyCode === MediumEditor.util.keyCode.ESCAPE) {
                    event.preventDefault();
                    this.doFormCancel();
                }
            },

            handleFormClick: function handleFormClick(event) {
                event.stopPropagation();
            },

            handleSaveClick: function handleSaveClick(event) {
                event.preventDefault();
                this.doFormSave();
            },

            handleCloseClick: function handleCloseClick(event) {
                event.preventDefault();
                this.doFormCancel();
            }
        });

        MediumEditor.extensions.anchor = AnchorForm;
    })();

    (function () {
        'use strict';

        var AnchorPreview = MediumEditor.Extension.extend({
            name: 'anchor-preview',

            hideDelay: 500,

            previewValueSelector: 'a',

            showWhenToolbarIsVisible: false,

            showOnEmptyLinks: true,

            init: function init() {
                this.anchorPreview = this.createPreview();

                this.getEditorOption('elementsContainer').appendChild(this.anchorPreview);

                this.attachToEditables();
            },

            getInteractionElements: function getInteractionElements() {
                return this.getPreviewElement();
            },

            getPreviewElement: function getPreviewElement() {
                return this.anchorPreview;
            },

            createPreview: function createPreview() {
                var el = this.document.createElement('div');

                el.id = 'medium-editor-anchor-preview-' + this.getEditorId();
                el.className = 'medium-editor-anchor-preview';
                el.innerHTML = this.getTemplate();

                this.on(el, 'click', this.handleClick.bind(this));

                return el;
            },

            getTemplate: function getTemplate() {
                return '<div class="medium-editor-toolbar-anchor-preview" id="medium-editor-toolbar-anchor-preview">' + '    <a class="medium-editor-toolbar-anchor-preview-inner"></a>' + '</div>';
            },

            destroy: function destroy() {
                if (this.anchorPreview) {
                    if (this.anchorPreview.parentNode) {
                        this.anchorPreview.parentNode.removeChild(this.anchorPreview);
                    }
                    delete this.anchorPreview;
                }
            },

            hidePreview: function hidePreview() {
                if (this.anchorPreview) {
                    this.anchorPreview.classList.remove('medium-editor-anchor-preview-active');
                }
                this.activeAnchor = null;
            },

            showPreview: function showPreview(anchorEl) {
                if (this.anchorPreview.classList.contains('medium-editor-anchor-preview-active') || anchorEl.getAttribute('data-disable-preview')) {
                    return true;
                }

                if (this.previewValueSelector) {
                    this.anchorPreview.querySelector(this.previewValueSelector).textContent = anchorEl.attributes.href.value;
                    this.anchorPreview.querySelector(this.previewValueSelector).href = anchorEl.attributes.href.value;
                }

                this.anchorPreview.classList.add('medium-toolbar-arrow-over');
                this.anchorPreview.classList.remove('medium-toolbar-arrow-under');

                if (!this.anchorPreview.classList.contains('medium-editor-anchor-preview-active')) {
                    this.anchorPreview.classList.add('medium-editor-anchor-preview-active');
                }

                this.activeAnchor = anchorEl;

                this.positionPreview();
                this.attachPreviewHandlers();

                return this;
            },

            positionPreview: function positionPreview(activeAnchor) {
                activeAnchor = activeAnchor || this.activeAnchor;
                var containerWidth = this.window.innerWidth,
                    buttonHeight = this.anchorPreview.offsetHeight,
                    boundary = activeAnchor.getBoundingClientRect(),
                    diffLeft = this.diffLeft,
                    diffTop = this.diffTop,
                    elementsContainer = this.getEditorOption('elementsContainer'),
                    elementsContainerAbsolute = ['absolute', 'fixed'].indexOf(window.getComputedStyle(elementsContainer).getPropertyValue('position')) > -1,
                    relativeBoundary = {},
                    halfOffsetWidth,
                    defaultLeft,
                    middleBoundary,
                    elementsContainerBoundary,
                    top;

                halfOffsetWidth = this.anchorPreview.offsetWidth / 2;
                var toolbarExtension = this.base.getExtensionByName('toolbar');
                if (toolbarExtension) {
                    diffLeft = toolbarExtension.diffLeft;
                    diffTop = toolbarExtension.diffTop;
                }
                defaultLeft = diffLeft - halfOffsetWidth;

                if (elementsContainerAbsolute) {
                    elementsContainerBoundary = elementsContainer.getBoundingClientRect();
                    ['top', 'left'].forEach(function (key) {
                        relativeBoundary[key] = boundary[key] - elementsContainerBoundary[key];
                    });

                    relativeBoundary.width = boundary.width;
                    relativeBoundary.height = boundary.height;
                    boundary = relativeBoundary;

                    containerWidth = elementsContainerBoundary.width;

                    top = elementsContainer.scrollTop;
                } else {
                    top = this.window.pageYOffset;
                }

                middleBoundary = boundary.left + boundary.width / 2;
                top += buttonHeight + boundary.top + boundary.height - diffTop - this.anchorPreview.offsetHeight;

                this.anchorPreview.style.top = Math.round(top) + 'px';
                this.anchorPreview.style.right = 'initial';
                if (middleBoundary < halfOffsetWidth) {
                    this.anchorPreview.style.left = defaultLeft + halfOffsetWidth + 'px';
                    this.anchorPreview.style.right = 'initial';
                } else if (containerWidth - middleBoundary < halfOffsetWidth) {
                    this.anchorPreview.style.left = 'auto';
                    this.anchorPreview.style.right = 0;
                } else {
                    this.anchorPreview.style.left = defaultLeft + middleBoundary + 'px';
                    this.anchorPreview.style.right = 'initial';
                }
            },

            attachToEditables: function attachToEditables() {
                this.subscribe('editableMouseover', this.handleEditableMouseover.bind(this));
                this.subscribe('positionedToolbar', this.handlePositionedToolbar.bind(this));
            },

            handlePositionedToolbar: function handlePositionedToolbar() {
                if (!this.showWhenToolbarIsVisible) {
                    this.hidePreview();
                }
            },

            handleClick: function handleClick(event) {
                var anchorExtension = this.base.getExtensionByName('anchor'),
                    activeAnchor = this.activeAnchor;

                if (anchorExtension && activeAnchor) {
                    event.preventDefault();

                    this.base.selectElement(this.activeAnchor);

                    this.base.delay(function () {
                        if (activeAnchor) {
                            var opts = {
                                value: activeAnchor.attributes.href.value,
                                target: activeAnchor.getAttribute('target'),
                                buttonClass: activeAnchor.getAttribute('class')
                            };
                            anchorExtension.showForm(opts);
                            activeAnchor = null;
                        }
                    }.bind(this));
                }

                this.hidePreview();
            },

            handleAnchorMouseout: function handleAnchorMouseout() {
                this.anchorToPreview = null;
                this.off(this.activeAnchor, 'mouseout', this.instanceHandleAnchorMouseout);
                this.instanceHandleAnchorMouseout = null;
            },

            handleEditableMouseover: function handleEditableMouseover(event) {
                var target = MediumEditor.util.getClosestTag(event.target, 'a');

                if (false === target) {
                    return;
                }

                if (!this.showOnEmptyLinks && (!/href=["']\S+["']/.test(target.outerHTML) || /href=["']#\S+["']/.test(target.outerHTML))) {
                    return true;
                }

                var toolbar = this.base.getExtensionByName('toolbar');
                if (!this.showWhenToolbarIsVisible && toolbar && toolbar.isDisplayed && toolbar.isDisplayed()) {
                    return true;
                }

                if (this.activeAnchor && this.activeAnchor !== target) {
                    this.detachPreviewHandlers();
                }

                this.anchorToPreview = target;

                this.instanceHandleAnchorMouseout = this.handleAnchorMouseout.bind(this);
                this.on(this.anchorToPreview, 'mouseout', this.instanceHandleAnchorMouseout);

                this.base.delay(function () {
                    if (this.anchorToPreview) {
                        this.showPreview(this.anchorToPreview);
                    }
                }.bind(this));
            },

            handlePreviewMouseover: function handlePreviewMouseover() {
                this.lastOver = new Date().getTime();
                this.hovering = true;
            },

            handlePreviewMouseout: function handlePreviewMouseout(event) {
                if (!event.relatedTarget || !/anchor-preview/.test(event.relatedTarget.className)) {
                    this.hovering = false;
                }
            },

            updatePreview: function updatePreview() {
                if (this.hovering) {
                    return true;
                }
                var durr = new Date().getTime() - this.lastOver;
                if (durr > this.hideDelay) {
                    this.detachPreviewHandlers();
                }
            },

            detachPreviewHandlers: function detachPreviewHandlers() {
                clearInterval(this.intervalTimer);
                if (this.instanceHandlePreviewMouseover) {
                    this.off(this.anchorPreview, 'mouseover', this.instanceHandlePreviewMouseover);
                    this.off(this.anchorPreview, 'mouseout', this.instanceHandlePreviewMouseout);
                    if (this.activeAnchor) {
                        this.off(this.activeAnchor, 'mouseover', this.instanceHandlePreviewMouseover);
                        this.off(this.activeAnchor, 'mouseout', this.instanceHandlePreviewMouseout);
                    }
                }

                this.hidePreview();

                this.hovering = this.instanceHandlePreviewMouseover = this.instanceHandlePreviewMouseout = null;
            },

            attachPreviewHandlers: function attachPreviewHandlers() {
                this.lastOver = new Date().getTime();
                this.hovering = true;

                this.instanceHandlePreviewMouseover = this.handlePreviewMouseover.bind(this);
                this.instanceHandlePreviewMouseout = this.handlePreviewMouseout.bind(this);

                this.intervalTimer = setInterval(this.updatePreview.bind(this), 200);

                this.on(this.anchorPreview, 'mouseover', this.instanceHandlePreviewMouseover);
                this.on(this.anchorPreview, 'mouseout', this.instanceHandlePreviewMouseout);
                this.on(this.activeAnchor, 'mouseover', this.instanceHandlePreviewMouseover);
                this.on(this.activeAnchor, 'mouseout', this.instanceHandlePreviewMouseout);
            }
        });

        MediumEditor.extensions.anchorPreview = AnchorPreview;
    })();

    (function () {
        'use strict';

        var WHITESPACE_CHARS, KNOWN_TLDS_FRAGMENT, LINK_REGEXP_TEXT, KNOWN_TLDS_REGEXP, LINK_REGEXP;

        WHITESPACE_CHARS = [' ', '\t', '\n', '\r', "\xA0", "\u2000", "\u2001", "\u2002", "\u2003", "\u2028", "\u2029"];
        KNOWN_TLDS_FRAGMENT = 'com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|' + 'xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|' + 'bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|' + 'fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|' + 'is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|' + 'mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|' + 'pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|' + 'tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw';

        LINK_REGEXP_TEXT = '(' + '((?:(https?://|ftps?://|nntp://)|www\\d{0,3}[.]|[a-z0-9.\\-]+[.](' + KNOWN_TLDS_FRAGMENT + ")\\/)\\S+(?:[^\\s`!\\[\\]{};:'\".,?\xAB\xBB\u201C\u201D\u2018\u2019]))" + ')|(([a-z0-9\\-]+\\.)?[a-z0-9\\-]+\\.(' + KNOWN_TLDS_FRAGMENT + '))';

        KNOWN_TLDS_REGEXP = new RegExp('^(' + KNOWN_TLDS_FRAGMENT + ')$', 'i');

        LINK_REGEXP = new RegExp(LINK_REGEXP_TEXT, 'gi');

        function nodeIsNotInsideAnchorTag(node) {
            return !MediumEditor.util.getClosestTag(node, 'a');
        }

        var AutoLink = MediumEditor.Extension.extend({
            init: function init() {
                MediumEditor.Extension.prototype.init.apply(this, arguments);

                this.disableEventHandling = false;
                this.subscribe('editableKeypress', this.onKeypress.bind(this));
                this.subscribe('editableBlur', this.onBlur.bind(this));

                this.document.execCommand('AutoUrlDetect', false, false);
            },

            isLastInstance: function isLastInstance() {
                var activeInstances = 0;
                for (var i = 0; i < this.window._mediumEditors.length; i++) {
                    var editor = this.window._mediumEditors[i];
                    if (editor !== null && editor.getExtensionByName('autoLink') !== undefined) {
                        activeInstances++;
                    }
                }
                return activeInstances === 1;
            },

            destroy: function destroy() {
                if (this.document.queryCommandSupported('AutoUrlDetect') && this.isLastInstance()) {
                    this.document.execCommand('AutoUrlDetect', false, true);
                }
            },

            onBlur: function onBlur(blurEvent, editable) {
                this.performLinking(editable);
            },

            onKeypress: function onKeypress(keyPressEvent) {
                if (this.disableEventHandling) {
                    return;
                }

                if (MediumEditor.util.isKey(keyPressEvent, [MediumEditor.util.keyCode.SPACE, MediumEditor.util.keyCode.ENTER])) {
                    clearTimeout(this.performLinkingTimeout);

                    this.performLinkingTimeout = setTimeout(function () {
                        try {
                            var sel = this.base.exportSelection();
                            if (this.performLinking(keyPressEvent.target)) {
                                this.base.importSelection(sel, true);
                            }
                        } catch (e) {
                            if (window.console) {
                                window.console.error('Failed to perform linking', e);
                            }
                            this.disableEventHandling = true;
                        }
                    }.bind(this), 0);
                }
            },

            performLinking: function performLinking(contenteditable) {
                var blockElements = MediumEditor.util.splitByBlockElements(contenteditable),
                    documentModified = false;
                if (blockElements.length === 0) {
                    blockElements = [contenteditable];
                }
                for (var i = 0; i < blockElements.length; i++) {
                    documentModified = this.removeObsoleteAutoLinkSpans(blockElements[i]) || documentModified;
                    documentModified = this.performLinkingWithinElement(blockElements[i]) || documentModified;
                }
                this.base.events.updateInput(contenteditable, { target: contenteditable, currentTarget: contenteditable });
                return documentModified;
            },

            removeObsoleteAutoLinkSpans: function removeObsoleteAutoLinkSpans(element) {
                if (!element || element.nodeType === 3) {
                    return false;
                }

                var spans = element.querySelectorAll('span[data-auto-link="true"]'),
                    documentModified = false;

                for (var i = 0; i < spans.length; i++) {
                    var textContent = spans[i].textContent;
                    if (textContent.indexOf('://') === -1) {
                        textContent = MediumEditor.util.ensureUrlHasProtocol(textContent);
                    }
                    if (spans[i].getAttribute('data-href') !== textContent && nodeIsNotInsideAnchorTag(spans[i])) {
                        documentModified = true;
                        var trimmedTextContent = textContent.replace(/\s+$/, '');
                        if (spans[i].getAttribute('data-href') === trimmedTextContent) {
                            var charactersTrimmed = textContent.length - trimmedTextContent.length,
                                subtree = MediumEditor.util.splitOffDOMTree(spans[i], this.splitTextBeforeEnd(spans[i], charactersTrimmed));
                            spans[i].parentNode.insertBefore(subtree, spans[i].nextSibling);
                        } else {
                            MediumEditor.util.unwrap(spans[i], this.document);
                        }
                    }
                }
                return documentModified;
            },

            splitTextBeforeEnd: function splitTextBeforeEnd(element, characterCount) {
                var treeWalker = this.document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false),
                    lastChildNotExhausted = true;

                while (lastChildNotExhausted) {
                    lastChildNotExhausted = treeWalker.lastChild() !== null;
                }

                var currentNode, currentNodeValue, previousNode;
                while (characterCount > 0 && previousNode !== null) {
                    currentNode = treeWalker.currentNode;
                    currentNodeValue = currentNode.nodeValue;
                    if (currentNodeValue.length > characterCount) {
                        previousNode = currentNode.splitText(currentNodeValue.length - characterCount);
                        characterCount = 0;
                    } else {
                        previousNode = treeWalker.previousNode();
                        characterCount -= currentNodeValue.length;
                    }
                }
                return previousNode;
            },

            performLinkingWithinElement: function performLinkingWithinElement(element) {
                var matches = this.findLinkableText(element),
                    linkCreated = false;

                for (var matchIndex = 0; matchIndex < matches.length; matchIndex++) {
                    var matchingTextNodes = MediumEditor.util.findOrCreateMatchingTextNodes(this.document, element, matches[matchIndex]);
                    if (this.shouldNotLink(matchingTextNodes)) {
                        continue;
                    }
                    this.createAutoLink(matchingTextNodes, matches[matchIndex].href);
                }
                return linkCreated;
            },

            shouldNotLink: function shouldNotLink(textNodes) {
                var shouldNotLink = false;
                for (var i = 0; i < textNodes.length && shouldNotLink === false; i++) {
                    shouldNotLink = !!MediumEditor.util.traverseUp(textNodes[i], function (node) {
                        return node.nodeName.toLowerCase() === 'a' || node.getAttribute && node.getAttribute('data-auto-link') === 'true';
                    });
                }
                return shouldNotLink;
            },

            findLinkableText: function findLinkableText(contenteditable) {
                var textContent = contenteditable.textContent,
                    match = null,
                    matches = [];

                while ((match = LINK_REGEXP.exec(textContent)) !== null) {
                    var matchOk = true,
                        matchEnd = match.index + match[0].length;

                    matchOk = (match.index === 0 || WHITESPACE_CHARS.indexOf(textContent[match.index - 1]) !== -1) && (matchEnd === textContent.length || WHITESPACE_CHARS.indexOf(textContent[matchEnd]) !== -1);

                    matchOk = matchOk && (match[0].indexOf('/') !== -1 || KNOWN_TLDS_REGEXP.test(match[0].split('.').pop().split('?').shift()));

                    if (matchOk) {
                        matches.push({
                            href: match[0],
                            start: match.index,
                            end: matchEnd
                        });
                    }
                }
                return matches;
            },

            createAutoLink: function createAutoLink(textNodes, href) {
                href = MediumEditor.util.ensureUrlHasProtocol(href);
                var anchor = MediumEditor.util.createLink(this.document, textNodes, href, this.getEditorOption('targetBlank') ? '_blank' : null),
                    span = this.document.createElement('span');
                span.setAttribute('data-auto-link', 'true');
                span.setAttribute('data-href', href);
                anchor.insertBefore(span, anchor.firstChild);
                while (anchor.childNodes.length > 1) {
                    span.appendChild(anchor.childNodes[1]);
                }
            }

        });

        MediumEditor.extensions.autoLink = AutoLink;
    })();

    (function () {
        'use strict';

        var CLASS_DRAG_OVER = 'medium-editor-dragover';

        function clearClassNames(element) {
            var editable = MediumEditor.util.getContainerEditorElement(element),
                existing = Array.prototype.slice.call(editable.parentElement.querySelectorAll('.' + CLASS_DRAG_OVER));

            existing.forEach(function (el) {
                el.classList.remove(CLASS_DRAG_OVER);
            });
        }

        var FileDragging = MediumEditor.Extension.extend({
            name: 'fileDragging',

            allowedTypes: ['image'],

            init: function init() {
                MediumEditor.Extension.prototype.init.apply(this, arguments);

                this.subscribe('editableDrag', this.handleDrag.bind(this));
                this.subscribe('editableDrop', this.handleDrop.bind(this));
            },

            handleDrag: function handleDrag(event) {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';

                var target = event.target.classList ? event.target : event.target.parentElement;

                clearClassNames(target);

                if (event.type === 'dragover') {
                    target.classList.add(CLASS_DRAG_OVER);
                }
            },

            handleDrop: function handleDrop(event) {
                event.preventDefault();
                event.stopPropagation();

                this.base.selectElement(event.target);
                var selection = this.base.exportSelection();
                selection.start = selection.end;
                this.base.importSelection(selection);

                if (event.dataTransfer.files) {
                    Array.prototype.slice.call(event.dataTransfer.files).forEach(function (file) {
                        if (this.isAllowedFile(file)) {
                            if (file.type.match('image')) {
                                this.insertImageFile(file);
                            }
                        }
                    }, this);
                }

                clearClassNames(event.target);
            },

            isAllowedFile: function isAllowedFile(file) {
                return this.allowedTypes.some(function (fileType) {
                    return !!file.type.match(fileType);
                });
            },

            insertImageFile: function insertImageFile(file) {
                if (typeof FileReader !== 'function') {
                    return;
                }
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                fileReader.addEventListener('load', function (e) {
                    var addImageElement = this.document.createElement('img');
                    addImageElement.src = e.target.result;
                    MediumEditor.util.insertHTMLCommand(this.document, addImageElement.outerHTML);
                }.bind(this));
            }
        });

        MediumEditor.extensions.fileDragging = FileDragging;
    })();

    (function () {
        'use strict';

        var KeyboardCommands = MediumEditor.Extension.extend({
            name: 'keyboard-commands',

            commands: [{
                command: 'bold',
                key: 'B',
                meta: true,
                shift: false,
                alt: false
            }, {
                command: 'italic',
                key: 'I',
                meta: true,
                shift: false,
                alt: false
            }, {
                command: 'underline',
                key: 'U',
                meta: true,
                shift: false,
                alt: false
            }],

            init: function init() {
                MediumEditor.Extension.prototype.init.apply(this, arguments);

                this.subscribe('editableKeydown', this.handleKeydown.bind(this));
                this.keys = {};
                this.commands.forEach(function (command) {
                    var keyCode = command.key.charCodeAt(0);
                    if (!this.keys[keyCode]) {
                        this.keys[keyCode] = [];
                    }
                    this.keys[keyCode].push(command);
                }, this);
            },

            handleKeydown: function handleKeydown(event) {
                var keyCode = MediumEditor.util.getKeyCode(event);
                if (!this.keys[keyCode]) {
                    return;
                }

                var isMeta = MediumEditor.util.isMetaCtrlKey(event),
                    isShift = !!event.shiftKey,
                    isAlt = !!event.altKey;

                this.keys[keyCode].forEach(function (data) {
                    if (data.meta === isMeta && data.shift === isShift && (data.alt === isAlt || undefined === data.alt)) {
                        event.preventDefault();
                        event.stopPropagation();

                        if (typeof data.command === 'function') {
                            data.command.apply(this);
                        } else if (false !== data.command) {
                                this.execAction(data.command);
                            }
                    }
                }, this);
            }
        });

        MediumEditor.extensions.keyboardCommands = KeyboardCommands;
    })();

    (function () {
        'use strict';

        var FontNameForm = MediumEditor.extensions.form.extend({

            name: 'fontname',
            action: 'fontName',
            aria: 'change font name',
            contentDefault: '&#xB1;',
            contentFA: '<i class="fa fa-font"></i>',

            fonts: ['', 'Arial', 'Verdana', 'Times New Roman'],

            init: function init() {
                MediumEditor.extensions.form.prototype.init.apply(this, arguments);
            },

            handleClick: function handleClick(event) {
                event.preventDefault();
                event.stopPropagation();

                if (!this.isDisplayed()) {
                    var fontName = this.document.queryCommandValue('fontName') + '';
                    this.showForm(fontName);
                }

                return false;
            },

            getForm: function getForm() {
                if (!this.form) {
                    this.form = this.createForm();
                }
                return this.form;
            },

            isDisplayed: function isDisplayed() {
                return this.getForm().style.display === 'block';
            },

            hideForm: function hideForm() {
                this.getForm().style.display = 'none';
                this.getSelect().value = '';
            },

            showForm: function showForm(fontName) {
                var select = this.getSelect();

                this.base.saveSelection();
                this.hideToolbarDefaultActions();
                this.getForm().style.display = 'block';
                this.setToolbarPosition();

                select.value = fontName || '';
                select.focus();
            },

            destroy: function destroy() {
                if (!this.form) {
                    return false;
                }

                if (this.form.parentNode) {
                    this.form.parentNode.removeChild(this.form);
                }

                delete this.form;
            },

            doFormSave: function doFormSave() {
                this.base.restoreSelection();
                this.base.checkSelection();
            },

            doFormCancel: function doFormCancel() {
                this.base.restoreSelection();
                this.clearFontName();
                this.base.checkSelection();
            },

            createForm: function createForm() {
                var doc = this.document,
                    form = doc.createElement('div'),
                    select = doc.createElement('select'),
                    close = doc.createElement('a'),
                    save = doc.createElement('a'),
                    option;

                form.className = 'medium-editor-toolbar-form';
                form.id = 'medium-editor-toolbar-form-fontname-' + this.getEditorId();

                this.on(form, 'click', this.handleFormClick.bind(this));

                for (var i = 0; i < this.fonts.length; i++) {
                    option = doc.createElement('option');
                    option.innerHTML = this.fonts[i];
                    option.value = this.fonts[i];
                    select.appendChild(option);
                }

                select.className = 'medium-editor-toolbar-select';
                form.appendChild(select);

                this.on(select, 'change', this.handleFontChange.bind(this));

                save.setAttribute('href', '#');
                save.className = 'medium-editor-toobar-save';
                save.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : '&#10003;';
                form.appendChild(save);

                this.on(save, 'click', this.handleSaveClick.bind(this), true);

                close.setAttribute('href', '#');
                close.className = 'medium-editor-toobar-close';
                close.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : '&times;';
                form.appendChild(close);

                this.on(close, 'click', this.handleCloseClick.bind(this));

                return form;
            },

            getSelect: function getSelect() {
                return this.getForm().querySelector('select.medium-editor-toolbar-select');
            },

            clearFontName: function clearFontName() {
                MediumEditor.selection.getSelectedElements(this.document).forEach(function (el) {
                    if (el.nodeName.toLowerCase() === 'font' && el.hasAttribute('face')) {
                        el.removeAttribute('face');
                    }
                });
            },

            handleFontChange: function handleFontChange() {
                var font = this.getSelect().value;
                if (font === '') {
                    this.clearFontName();
                } else {
                    this.execAction('fontName', { value: font });
                }
            },

            handleFormClick: function handleFormClick(event) {
                event.stopPropagation();
            },

            handleSaveClick: function handleSaveClick(event) {
                event.preventDefault();
                this.doFormSave();
            },

            handleCloseClick: function handleCloseClick(event) {
                event.preventDefault();
                this.doFormCancel();
            }
        });

        MediumEditor.extensions.fontName = FontNameForm;
    })();

    (function () {
        'use strict';

        var FontSizeForm = MediumEditor.extensions.form.extend({

            name: 'fontsize',
            action: 'fontSize',
            aria: 'increase/decrease font size',
            contentDefault: '&#xB1;',
            contentFA: '<i class="fa fa-text-height"></i>',

            init: function init() {
                MediumEditor.extensions.form.prototype.init.apply(this, arguments);
            },

            handleClick: function handleClick(event) {
                event.preventDefault();
                event.stopPropagation();

                if (!this.isDisplayed()) {
                    var fontSize = this.document.queryCommandValue('fontSize') + '';
                    this.showForm(fontSize);
                }

                return false;
            },

            getForm: function getForm() {
                if (!this.form) {
                    this.form = this.createForm();
                }
                return this.form;
            },

            isDisplayed: function isDisplayed() {
                return this.getForm().style.display === 'block';
            },

            hideForm: function hideForm() {
                this.getForm().style.display = 'none';
                this.getInput().value = '';
            },

            showForm: function showForm(fontSize) {
                var input = this.getInput();

                this.base.saveSelection();
                this.hideToolbarDefaultActions();
                this.getForm().style.display = 'block';
                this.setToolbarPosition();

                input.value = fontSize || '';
                input.focus();
            },

            destroy: function destroy() {
                if (!this.form) {
                    return false;
                }

                if (this.form.parentNode) {
                    this.form.parentNode.removeChild(this.form);
                }

                delete this.form;
            },

            doFormSave: function doFormSave() {
                this.base.restoreSelection();
                this.base.checkSelection();
            },

            doFormCancel: function doFormCancel() {
                this.base.restoreSelection();
                this.clearFontSize();
                this.base.checkSelection();
            },

            createForm: function createForm() {
                var doc = this.document,
                    form = doc.createElement('div'),
                    input = doc.createElement('input'),
                    close = doc.createElement('a'),
                    save = doc.createElement('a');

                form.className = 'medium-editor-toolbar-form';
                form.id = 'medium-editor-toolbar-form-fontsize-' + this.getEditorId();

                this.on(form, 'click', this.handleFormClick.bind(this));

                input.setAttribute('type', 'range');
                input.setAttribute('min', '1');
                input.setAttribute('max', '7');
                input.className = 'medium-editor-toolbar-input';
                form.appendChild(input);

                this.on(input, 'change', this.handleSliderChange.bind(this));

                save.setAttribute('href', '#');
                save.className = 'medium-editor-toobar-save';
                save.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : '&#10003;';
                form.appendChild(save);

                this.on(save, 'click', this.handleSaveClick.bind(this), true);

                close.setAttribute('href', '#');
                close.className = 'medium-editor-toobar-close';
                close.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : '&times;';
                form.appendChild(close);

                this.on(close, 'click', this.handleCloseClick.bind(this));

                return form;
            },

            getInput: function getInput() {
                return this.getForm().querySelector('input.medium-editor-toolbar-input');
            },

            clearFontSize: function clearFontSize() {
                MediumEditor.selection.getSelectedElements(this.document).forEach(function (el) {
                    if (el.nodeName.toLowerCase() === 'font' && el.hasAttribute('size')) {
                        el.removeAttribute('size');
                    }
                });
            },

            handleSliderChange: function handleSliderChange() {
                var size = this.getInput().value;
                if (size === '4') {
                    this.clearFontSize();
                } else {
                    this.execAction('fontSize', { value: size });
                }
            },

            handleFormClick: function handleFormClick(event) {
                event.stopPropagation();
            },

            handleSaveClick: function handleSaveClick(event) {
                event.preventDefault();
                this.doFormSave();
            },

            handleCloseClick: function handleCloseClick(event) {
                event.preventDefault();
                this.doFormCancel();
            }
        });

        MediumEditor.extensions.fontSize = FontSizeForm;
    })();
    (function () {
        'use strict';

        var pasteBinDefaultContent = '%ME_PASTEBIN%',
            lastRange = null,
            keyboardPasteEditable = null,
            stopProp = function stopProp(event) {
            event.stopPropagation();
        };

        function createReplacements() {
            return [[new RegExp(/^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/g), ''], [new RegExp(/<!--StartFragment-->|<!--EndFragment-->/g), ''], [new RegExp(/<br>$/i), ''], [new RegExp(/<[^>]*docs-internal-guid[^>]*>/gi), ''], [new RegExp(/<\/b>(<br[^>]*>)?$/gi), ''], [new RegExp(/<span class="Apple-converted-space">\s+<\/span>/g), ' '], [new RegExp(/<br class="Apple-interchange-newline">/g), '<br>'], [new RegExp(/<span[^>]*(font-style:italic;font-weight:(bold|700)|font-weight:(bold|700);font-style:italic)[^>]*>/gi), '<span class="replace-with italic bold">'], [new RegExp(/<span[^>]*font-style:italic[^>]*>/gi), '<span class="replace-with italic">'], [new RegExp(/<span[^>]*font-weight:(bold|700)[^>]*>/gi), '<span class="replace-with bold">'], [new RegExp(/&lt;(\/?)(i|b|a)&gt;/gi), '<$1$2>'], [new RegExp(/&lt;a(?:(?!href).)+href=(?:&quot;|&rdquo;|&ldquo;|"|“|”)(((?!&quot;|&rdquo;|&ldquo;|"|“|”).)*)(?:&quot;|&rdquo;|&ldquo;|"|“|”)(?:(?!&gt;).)*&gt;/gi), '<a href="$1">'], [new RegExp(/<\/p>\n+/gi), '</p>'], [new RegExp(/\n+<p/gi), '<p'], [new RegExp(/<\/?o:[a-z]*>/gi), ''], [new RegExp(/<!\[if !supportLists\]>(((?!<!).)*)<!\[endif]\>/gi), '$1']];
        }

        function getClipboardContent(event, win, doc) {
            var dataTransfer = event.clipboardData || win.clipboardData || doc.dataTransfer,
                data = {};

            if (!dataTransfer) {
                return data;
            }

            if (dataTransfer.getData) {
                var legacyText = dataTransfer.getData('Text');
                if (legacyText && legacyText.length > 0) {
                    data['text/plain'] = legacyText;
                }
            }

            if (dataTransfer.types) {
                for (var i = 0; i < dataTransfer.types.length; i++) {
                    var contentType = dataTransfer.types[i];
                    data[contentType] = dataTransfer.getData(contentType);
                }
            }

            return data;
        }

        var PasteHandler = MediumEditor.Extension.extend({
            forcePlainText: true,

            cleanPastedHTML: false,

            preCleanReplacements: [],

            cleanReplacements: [],

            cleanAttrs: ['class', 'style', 'dir'],

            cleanTags: ['meta'],

            unwrapTags: [],

            init: function init() {
                MediumEditor.Extension.prototype.init.apply(this, arguments);

                if (this.forcePlainText || this.cleanPastedHTML) {
                    this.subscribe('editableKeydown', this.handleKeydown.bind(this));

                    this.getEditorElements().forEach(function (element) {
                        this.on(element, 'paste', this.handlePaste.bind(this));
                    }, this);
                    this.subscribe('addElement', this.handleAddElement.bind(this));
                }
            },

            handleAddElement: function handleAddElement(event, editable) {
                this.on(editable, 'paste', this.handlePaste.bind(this));
            },

            destroy: function destroy() {
                if (this.forcePlainText || this.cleanPastedHTML) {
                    this.removePasteBin();
                }
            },

            handlePaste: function handlePaste(event, editable) {
                if (event.defaultPrevented) {
                    return;
                }

                var clipboardContent = getClipboardContent(event, this.window, this.document),
                    pastedHTML = clipboardContent['text/html'],
                    pastedPlain = clipboardContent['text/plain'];

                if (this.window.clipboardData && event.clipboardData === undefined && !pastedHTML) {
                    pastedHTML = pastedPlain;
                }

                if (pastedHTML || pastedPlain) {
                    event.preventDefault();

                    this.doPaste(pastedHTML, pastedPlain, editable);
                }
            },

            doPaste: function doPaste(pastedHTML, pastedPlain, editable) {
                var paragraphs,
                    html = '',
                    p;

                if (this.cleanPastedHTML && pastedHTML) {
                    return this.cleanPaste(pastedHTML);
                }

                if (!(this.getEditorOption('disableReturn') || editable && editable.getAttribute('data-disable-return'))) {
                    paragraphs = pastedPlain.split(/[\r\n]+/g);

                    if (paragraphs.length > 1) {
                        for (p = 0; p < paragraphs.length; p += 1) {
                            if (paragraphs[p] !== '') {
                                html += '<p>' + MediumEditor.util.htmlEntities(paragraphs[p]) + '</p>';
                            }
                        }
                    } else {
                        html = MediumEditor.util.htmlEntities(paragraphs[0]);
                    }
                } else {
                    html = MediumEditor.util.htmlEntities(pastedPlain);
                }
                MediumEditor.util.insertHTMLCommand(this.document, html);
            },

            handlePasteBinPaste: function handlePasteBinPaste(event) {
                if (event.defaultPrevented) {
                    this.removePasteBin();
                    return;
                }

                var clipboardContent = getClipboardContent(event, this.window, this.document),
                    pastedHTML = clipboardContent['text/html'],
                    pastedPlain = clipboardContent['text/plain'],
                    editable = keyboardPasteEditable;

                if (!this.cleanPastedHTML || pastedHTML) {
                    event.preventDefault();
                    this.removePasteBin();
                    this.doPaste(pastedHTML, pastedPlain, editable);

                    this.trigger('editablePaste', { currentTarget: editable, target: editable }, editable);
                    return;
                }

                setTimeout(function () {
                    if (this.cleanPastedHTML) {
                        pastedHTML = this.getPasteBinHtml();
                    }

                    this.removePasteBin();

                    this.doPaste(pastedHTML, pastedPlain, editable);

                    this.trigger('editablePaste', { currentTarget: editable, target: editable }, editable);
                }.bind(this), 0);
            },

            handleKeydown: function handleKeydown(event, editable) {
                if (!(MediumEditor.util.isKey(event, MediumEditor.util.keyCode.V) && MediumEditor.util.isMetaCtrlKey(event))) {
                    return;
                }

                event.stopImmediatePropagation();

                this.removePasteBin();
                this.createPasteBin(editable);
            },

            createPasteBin: function createPasteBin(editable) {
                var rects,
                    range = MediumEditor.selection.getSelectionRange(this.document),
                    top = this.window.pageYOffset;

                keyboardPasteEditable = editable;

                if (range) {
                    rects = range.getClientRects();

                    if (rects.length) {
                        top += rects[0].top;
                    } else if (range.startContainer.getBoundingClientRect !== undefined) {
                        top += range.startContainer.getBoundingClientRect().top;
                    } else {
                        top += range.getBoundingClientRect().top;
                    }
                }

                lastRange = range;

                var pasteBinElm = this.document.createElement('div');
                pasteBinElm.id = this.pasteBinId = 'medium-editor-pastebin-' + +Date.now();
                pasteBinElm.setAttribute('style', 'border: 1px red solid; position: absolute; top: ' + top + 'px; width: 10px; height: 10px; overflow: hidden; opacity: 0');
                pasteBinElm.setAttribute('contentEditable', true);
                pasteBinElm.innerHTML = pasteBinDefaultContent;

                this.document.body.appendChild(pasteBinElm);

                this.on(pasteBinElm, 'focus', stopProp);
                this.on(pasteBinElm, 'focusin', stopProp);
                this.on(pasteBinElm, 'focusout', stopProp);

                pasteBinElm.focus();

                MediumEditor.selection.selectNode(pasteBinElm, this.document);

                if (!this.boundHandlePaste) {
                    this.boundHandlePaste = this.handlePasteBinPaste.bind(this);
                }

                this.on(pasteBinElm, 'paste', this.boundHandlePaste);
            },

            removePasteBin: function removePasteBin() {
                if (null !== lastRange) {
                    MediumEditor.selection.selectRange(this.document, lastRange);
                    lastRange = null;
                }

                if (null !== keyboardPasteEditable) {
                    keyboardPasteEditable = null;
                }

                var pasteBinElm = this.getPasteBin();
                if (!pasteBinElm) {
                    return;
                }

                if (pasteBinElm) {
                    this.off(pasteBinElm, 'focus', stopProp);
                    this.off(pasteBinElm, 'focusin', stopProp);
                    this.off(pasteBinElm, 'focusout', stopProp);
                    this.off(pasteBinElm, 'paste', this.boundHandlePaste);
                    pasteBinElm.parentElement.removeChild(pasteBinElm);
                }
            },

            getPasteBin: function getPasteBin() {
                return this.document.getElementById(this.pasteBinId);
            },

            getPasteBinHtml: function getPasteBinHtml() {
                var pasteBinElm = this.getPasteBin();

                if (!pasteBinElm) {
                    return false;
                }

                if (pasteBinElm.firstChild && pasteBinElm.firstChild.id === 'mcepastebin') {
                    return false;
                }

                var pasteBinHtml = pasteBinElm.innerHTML;

                if (!pasteBinHtml || pasteBinHtml === pasteBinDefaultContent) {
                    return false;
                }

                return pasteBinHtml;
            },

            cleanPaste: function cleanPaste(text) {
                var i,
                    elList,
                    tmp,
                    workEl,
                    multiline = /<p|<br|<div/.test(text),
                    replacements = [].concat(this.preCleanReplacements || [], createReplacements(), this.cleanReplacements || []);

                for (i = 0; i < replacements.length; i += 1) {
                    text = text.replace(replacements[i][0], replacements[i][1]);
                }

                if (!multiline) {
                    return this.pasteHTML(text);
                }

                tmp = this.document.createElement('div');

                tmp.innerHTML = '<p>' + text.split('<br><br>').join('</p><p>') + '</p>';

                elList = tmp.querySelectorAll('a,p,div,br');
                for (i = 0; i < elList.length; i += 1) {
                    workEl = elList[i];

                    workEl.innerHTML = workEl.innerHTML.replace(/\n/gi, ' ');

                    switch (workEl.nodeName.toLowerCase()) {
                        case 'p':
                        case 'div':
                            this.filterCommonBlocks(workEl);
                            break;
                        case 'br':
                            this.filterLineBreak(workEl);
                            break;
                    }
                }

                this.pasteHTML(tmp.innerHTML);
            },

            pasteHTML: function pasteHTML(html, options) {
                options = MediumEditor.util.defaults({}, options, {
                    cleanAttrs: this.cleanAttrs,
                    cleanTags: this.cleanTags,
                    unwrapTags: this.unwrapTags
                });

                var elList,
                    workEl,
                    i,
                    fragmentBody,
                    pasteBlock = this.document.createDocumentFragment();

                pasteBlock.appendChild(this.document.createElement('body'));

                fragmentBody = pasteBlock.querySelector('body');
                fragmentBody.innerHTML = html;

                this.cleanupSpans(fragmentBody);

                elList = fragmentBody.querySelectorAll('*');
                for (i = 0; i < elList.length; i += 1) {
                    workEl = elList[i];

                    if ('a' === workEl.nodeName.toLowerCase() && this.getEditorOption('targetBlank')) {
                        MediumEditor.util.setTargetBlank(workEl);
                    }

                    MediumEditor.util.cleanupAttrs(workEl, options.cleanAttrs);
                    MediumEditor.util.cleanupTags(workEl, options.cleanTags);
                    MediumEditor.util.unwrapTags(workEl, options.unwrapTags);
                }

                MediumEditor.util.insertHTMLCommand(this.document, fragmentBody.innerHTML.replace(/&nbsp;/g, ' '));
            },

            isCommonBlock: function isCommonBlock(el) {
                return el && (el.nodeName.toLowerCase() === 'p' || el.nodeName.toLowerCase() === 'div');
            },

            filterCommonBlocks: function filterCommonBlocks(el) {
                if (/^\s*$/.test(el.textContent) && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            },

            filterLineBreak: function filterLineBreak(el) {
                if (this.isCommonBlock(el.previousElementSibling)) {
                    this.removeWithParent(el);
                } else if (this.isCommonBlock(el.parentNode) && (el.parentNode.firstChild === el || el.parentNode.lastChild === el)) {
                    this.removeWithParent(el);
                } else if (el.parentNode && el.parentNode.childElementCount === 1 && el.parentNode.textContent === '') {
                    this.removeWithParent(el);
                }
            },

            removeWithParent: function removeWithParent(el) {
                if (el && el.parentNode) {
                    if (el.parentNode.parentNode && el.parentNode.childElementCount === 1) {
                        el.parentNode.parentNode.removeChild(el.parentNode);
                    } else {
                        el.parentNode.removeChild(el);
                    }
                }
            },

            cleanupSpans: function cleanupSpans(containerEl) {
                var i,
                    el,
                    newEl,
                    spans = containerEl.querySelectorAll('.replace-with'),
                    isCEF = function isCEF(el) {
                    return el && el.nodeName !== '#text' && el.getAttribute('contenteditable') === 'false';
                };

                for (i = 0; i < spans.length; i += 1) {
                    el = spans[i];
                    newEl = this.document.createElement(el.classList.contains('bold') ? 'b' : 'i');

                    if (el.classList.contains('bold') && el.classList.contains('italic')) {
                        newEl.innerHTML = '<i>' + el.innerHTML + '</i>';
                    } else {
                        newEl.innerHTML = el.innerHTML;
                    }
                    el.parentNode.replaceChild(newEl, el);
                }

                spans = containerEl.querySelectorAll('span');
                for (i = 0; i < spans.length; i += 1) {
                    el = spans[i];

                    if (MediumEditor.util.traverseUp(el, isCEF)) {
                        return false;
                    }

                    MediumEditor.util.unwrap(el, this.document);
                }
            }
        });

        MediumEditor.extensions.paste = PasteHandler;
    })();

    (function () {
        'use strict';

        var Placeholder = MediumEditor.Extension.extend({
            name: 'placeholder',

            text: 'Type your text',

            hideOnClick: true,

            init: function init() {
                MediumEditor.Extension.prototype.init.apply(this, arguments);

                this.initPlaceholders();
                this.attachEventHandlers();
            },

            initPlaceholders: function initPlaceholders() {
                this.getEditorElements().forEach(this.initElement, this);
            },

            handleAddElement: function handleAddElement(event, editable) {
                this.initElement(editable);
            },

            initElement: function initElement(el) {
                if (!el.getAttribute('data-placeholder')) {
                    el.setAttribute('data-placeholder', this.text);
                }
                this.updatePlaceholder(el);
            },

            destroy: function destroy() {
                this.getEditorElements().forEach(this.cleanupElement, this);
            },

            handleRemoveElement: function handleRemoveElement(event, editable) {
                this.cleanupElement(editable);
            },

            cleanupElement: function cleanupElement(el) {
                if (el.getAttribute('data-placeholder') === this.text) {
                    el.removeAttribute('data-placeholder');
                }
            },

            showPlaceholder: function showPlaceholder(el) {
                if (el) {
                    if (MediumEditor.util.isFF && el.childNodes.length === 0) {
                        el.classList.add('medium-editor-placeholder-relative');
                        el.classList.remove('medium-editor-placeholder');
                    } else {
                        el.classList.add('medium-editor-placeholder');
                        el.classList.remove('medium-editor-placeholder-relative');
                    }
                }
            },

            hidePlaceholder: function hidePlaceholder(el) {
                if (el) {
                    el.classList.remove('medium-editor-placeholder');
                    el.classList.remove('medium-editor-placeholder-relative');
                }
            },

            updatePlaceholder: function updatePlaceholder(el, dontShow) {
                if (el.querySelector('img, blockquote, ul, ol, table') || el.textContent.replace(/^\s+|\s+$/g, '') !== '') {
                    return this.hidePlaceholder(el);
                }

                if (!dontShow) {
                    this.showPlaceholder(el);
                }
            },

            attachEventHandlers: function attachEventHandlers() {
                if (this.hideOnClick) {
                    this.subscribe('focus', this.handleFocus.bind(this));
                }

                this.subscribe('editableInput', this.handleInput.bind(this));

                this.subscribe('blur', this.handleBlur.bind(this));

                this.subscribe('addElement', this.handleAddElement.bind(this));
                this.subscribe('removeElement', this.handleRemoveElement.bind(this));
            },

            handleInput: function handleInput(event, element) {
                var dontShow = this.hideOnClick && element === this.base.getFocusedElement();

                this.updatePlaceholder(element, dontShow);
            },

            handleFocus: function handleFocus(event, element) {
                this.hidePlaceholder(element);
            },

            handleBlur: function handleBlur(event, element) {
                this.updatePlaceholder(element);
            }
        });

        MediumEditor.extensions.placeholder = Placeholder;
    })();

    (function () {
        'use strict';

        var Toolbar = MediumEditor.Extension.extend({
            name: 'toolbar',

            align: 'center',

            allowMultiParagraphSelection: true,

            buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],

            diffLeft: 0,

            diffTop: -10,

            firstButtonClass: 'medium-editor-button-first',

            lastButtonClass: 'medium-editor-button-last',

            standardizeSelectionStart: false,

            static: false,

            sticky: false,

            stickyTopOffset: 0,

            updateOnEmptySelection: false,

            relativeContainer: null,

            init: function init() {
                MediumEditor.Extension.prototype.init.apply(this, arguments);

                this.initThrottledMethods();

                if (!this.relativeContainer) {
                    this.getEditorOption('elementsContainer').appendChild(this.getToolbarElement());
                } else {
                    this.relativeContainer.appendChild(this.getToolbarElement());
                }
            },

            forEachExtension: function forEachExtension(iterator, context) {
                return this.base.extensions.forEach(function (command) {
                    if (command === this) {
                        return;
                    }
                    return iterator.apply(context || this, arguments);
                }, this);
            },

            createToolbar: function createToolbar() {
                var toolbar = this.document.createElement('div');

                toolbar.id = 'medium-editor-toolbar-' + this.getEditorId();
                toolbar.className = 'medium-editor-toolbar';

                if (this.static) {
                    toolbar.className += ' static-toolbar';
                } else if (this.relativeContainer) {
                    toolbar.className += ' medium-editor-relative-toolbar';
                } else {
                    toolbar.className += ' medium-editor-stalker-toolbar';
                }

                toolbar.appendChild(this.createToolbarButtons());

                this.forEachExtension(function (extension) {
                    if (extension.hasForm) {
                        toolbar.appendChild(extension.getForm());
                    }
                });

                this.attachEventHandlers();

                return toolbar;
            },

            createToolbarButtons: function createToolbarButtons() {
                var ul = this.document.createElement('ul'),
                    li,
                    btn,
                    buttons,
                    extension,
                    buttonName,
                    buttonOpts;

                ul.id = 'medium-editor-toolbar-actions' + this.getEditorId();
                ul.className = 'medium-editor-toolbar-actions';
                ul.style.display = 'block';

                this.buttons.forEach(function (button) {
                    if (typeof button === 'string') {
                        buttonName = button;
                        buttonOpts = null;
                    } else {
                        buttonName = button.name;
                        buttonOpts = button;
                    }

                    extension = this.base.addBuiltInExtension(buttonName, buttonOpts);

                    if (extension && typeof extension.getButton === 'function') {
                        btn = extension.getButton(this.base);
                        li = this.document.createElement('li');
                        if (MediumEditor.util.isElement(btn)) {
                            li.appendChild(btn);
                        } else {
                            li.innerHTML = btn;
                        }
                        ul.appendChild(li);
                    }
                }, this);

                buttons = ul.querySelectorAll('button');
                if (buttons.length > 0) {
                    buttons[0].classList.add(this.firstButtonClass);
                    buttons[buttons.length - 1].classList.add(this.lastButtonClass);
                }

                return ul;
            },

            destroy: function destroy() {
                if (this.toolbar) {
                    if (this.toolbar.parentNode) {
                        this.toolbar.parentNode.removeChild(this.toolbar);
                    }
                    delete this.toolbar;
                }
            },

            getInteractionElements: function getInteractionElements() {
                return this.getToolbarElement();
            },

            getToolbarElement: function getToolbarElement() {
                if (!this.toolbar) {
                    this.toolbar = this.createToolbar();
                }

                return this.toolbar;
            },

            getToolbarActionsElement: function getToolbarActionsElement() {
                return this.getToolbarElement().querySelector('.medium-editor-toolbar-actions');
            },

            initThrottledMethods: function initThrottledMethods() {
                this.throttledPositionToolbar = MediumEditor.util.throttle(function () {
                    if (this.base.isActive) {
                        this.positionToolbarIfShown();
                    }
                }.bind(this));
            },

            attachEventHandlers: function attachEventHandlers() {
                this.subscribe('blur', this.handleBlur.bind(this));
                this.subscribe('focus', this.handleFocus.bind(this));

                this.subscribe('editableClick', this.handleEditableClick.bind(this));
                this.subscribe('editableKeyup', this.handleEditableKeyup.bind(this));

                this.on(this.document.documentElement, 'mouseup', this.handleDocumentMouseup.bind(this));

                if (this.static && this.sticky) {
                    this.on(this.window, 'scroll', this.handleWindowScroll.bind(this), true);
                }

                this.on(this.window, 'resize', this.handleWindowResize.bind(this));
            },

            handleWindowScroll: function handleWindowScroll() {
                this.positionToolbarIfShown();
            },

            handleWindowResize: function handleWindowResize() {
                this.throttledPositionToolbar();
            },

            handleDocumentMouseup: function handleDocumentMouseup(event) {
                if (event && event.target && MediumEditor.util.isDescendant(this.getToolbarElement(), event.target)) {
                    return false;
                }
                this.checkState();
            },

            handleEditableClick: function handleEditableClick() {
                setTimeout(function () {
                    this.checkState();
                }.bind(this), 0);
            },

            handleEditableKeyup: function handleEditableKeyup() {
                this.checkState();
            },

            handleBlur: function handleBlur() {
                clearTimeout(this.hideTimeout);

                clearTimeout(this.delayShowTimeout);

                this.hideTimeout = setTimeout(function () {
                    this.hideToolbar();
                }.bind(this), 1);
            },

            handleFocus: function handleFocus() {
                this.checkState();
            },

            isDisplayed: function isDisplayed() {
                return this.getToolbarElement().classList.contains('medium-editor-toolbar-active');
            },

            showToolbar: function showToolbar() {
                clearTimeout(this.hideTimeout);
                if (!this.isDisplayed()) {
                    this.getToolbarElement().classList.add('medium-editor-toolbar-active');
                    this.trigger('showToolbar', {}, this.base.getFocusedElement());
                }
            },

            hideToolbar: function hideToolbar() {
                if (this.isDisplayed()) {
                    this.getToolbarElement().classList.remove('medium-editor-toolbar-active');
                    this.trigger('hideToolbar', {}, this.base.getFocusedElement());
                }
            },

            isToolbarDefaultActionsDisplayed: function isToolbarDefaultActionsDisplayed() {
                return this.getToolbarActionsElement().style.display === 'block';
            },

            hideToolbarDefaultActions: function hideToolbarDefaultActions() {
                if (this.isToolbarDefaultActionsDisplayed()) {
                    this.getToolbarActionsElement().style.display = 'none';
                }
            },

            showToolbarDefaultActions: function showToolbarDefaultActions() {
                this.hideExtensionForms();

                if (!this.isToolbarDefaultActionsDisplayed()) {
                    this.getToolbarActionsElement().style.display = 'block';
                }

                this.delayShowTimeout = this.base.delay(function () {
                    this.showToolbar();
                }.bind(this));
            },

            hideExtensionForms: function hideExtensionForms() {
                this.forEachExtension(function (extension) {
                    if (extension.hasForm && extension.isDisplayed()) {
                        extension.hideForm();
                    }
                });
            },

            multipleBlockElementsSelected: function multipleBlockElementsSelected() {
                var regexEmptyHTMLTags = /<[^\/>][^>]*><\/[^>]+>/gim,
                    regexBlockElements = new RegExp('<(' + MediumEditor.util.blockContainerElementNames.join('|') + ')[^>]*>', 'g'),
                    selectionHTML = MediumEditor.selection.getSelectionHtml(this.document).replace(regexEmptyHTMLTags, ''),
                    hasMultiParagraphs = selectionHTML.match(regexBlockElements);

                return !!hasMultiParagraphs && hasMultiParagraphs.length > 1;
            },

            modifySelection: function modifySelection() {
                var selection = this.window.getSelection(),
                    selectionRange = selection.getRangeAt(0);

                if (this.standardizeSelectionStart && selectionRange.startContainer.nodeValue && selectionRange.startOffset === selectionRange.startContainer.nodeValue.length) {
                    var adjacentNode = MediumEditor.util.findAdjacentTextNodeWithContent(MediumEditor.selection.getSelectionElement(this.window), selectionRange.startContainer, this.document);
                    if (adjacentNode) {
                        var offset = 0;
                        while (adjacentNode.nodeValue.substr(offset, 1).trim().length === 0) {
                            offset = offset + 1;
                        }
                        selectionRange = MediumEditor.selection.select(this.document, adjacentNode, offset, selectionRange.endContainer, selectionRange.endOffset);
                    }
                }
            },

            checkState: function checkState() {
                if (this.base.preventSelectionUpdates) {
                    return;
                }

                if (!this.base.getFocusedElement() || MediumEditor.selection.selectionInContentEditableFalse(this.window)) {
                    return this.hideToolbar();
                }

                var selectionElement = MediumEditor.selection.getSelectionElement(this.window);
                if (!selectionElement || this.getEditorElements().indexOf(selectionElement) === -1 || selectionElement.getAttribute('data-disable-toolbar')) {
                    return this.hideToolbar();
                }

                if (this.updateOnEmptySelection && this.static) {
                    return this.showAndUpdateToolbar();
                }

                if (!MediumEditor.selection.selectionContainsContent(this.document) || this.allowMultiParagraphSelection === false && this.multipleBlockElementsSelected()) {
                    return this.hideToolbar();
                }

                this.showAndUpdateToolbar();
            },

            showAndUpdateToolbar: function showAndUpdateToolbar() {
                this.modifySelection();
                this.setToolbarButtonStates();
                this.trigger('positionToolbar', {}, this.base.getFocusedElement());
                this.showToolbarDefaultActions();
                this.setToolbarPosition();
            },

            setToolbarButtonStates: function setToolbarButtonStates() {
                this.forEachExtension(function (extension) {
                    if (typeof extension.isActive === 'function' && typeof extension.setInactive === 'function') {
                        extension.setInactive();
                    }
                });

                this.checkActiveButtons();
            },

            checkActiveButtons: function checkActiveButtons() {
                var manualStateChecks = [],
                    queryState = null,
                    selectionRange = MediumEditor.selection.getSelectionRange(this.document),
                    parentNode,
                    updateExtensionState = function updateExtensionState(extension) {
                    if (typeof extension.checkState === 'function') {
                        extension.checkState(parentNode);
                    } else if (typeof extension.isActive === 'function' && typeof extension.isAlreadyApplied === 'function' && typeof extension.setActive === 'function') {
                        if (!extension.isActive() && extension.isAlreadyApplied(parentNode)) {
                            extension.setActive();
                        }
                    }
                };

                if (!selectionRange) {
                    return;
                }

                this.forEachExtension(function (extension) {
                    if (typeof extension.queryCommandState === 'function') {
                        queryState = extension.queryCommandState();

                        if (queryState !== null) {
                            if (queryState && typeof extension.setActive === 'function') {
                                extension.setActive();
                            }
                            return;
                        }
                    }

                    manualStateChecks.push(extension);
                });

                parentNode = MediumEditor.selection.getSelectedParentElement(selectionRange);

                if (!this.getEditorElements().some(function (element) {
                    return MediumEditor.util.isDescendant(element, parentNode, true);
                })) {
                    return;
                }

                while (parentNode) {
                    manualStateChecks.forEach(updateExtensionState);

                    if (MediumEditor.util.isMediumEditorElement(parentNode)) {
                        break;
                    }
                    parentNode = parentNode.parentNode;
                }
            },

            positionToolbarIfShown: function positionToolbarIfShown() {
                if (this.isDisplayed()) {
                    this.setToolbarPosition();
                }
            },

            setToolbarPosition: function setToolbarPosition() {
                var container = this.base.getFocusedElement(),
                    selection = this.window.getSelection();

                if (!container) {
                    return this;
                }

                if (this.static || !selection.isCollapsed) {
                    this.showToolbar();

                    if (!this.relativeContainer) {
                        if (this.static) {
                            this.positionStaticToolbar(container);
                        } else {
                            this.positionToolbar(selection);
                        }
                    }

                    this.trigger('positionedToolbar', {}, this.base.getFocusedElement());
                }
            },

            positionStaticToolbar: function positionStaticToolbar(container) {
                this.getToolbarElement().style.left = '0';

                var scrollTop = this.document.documentElement && this.document.documentElement.scrollTop || this.document.body.scrollTop,
                    windowWidth = this.window.innerWidth,
                    toolbarElement = this.getToolbarElement(),
                    containerRect = container.getBoundingClientRect(),
                    containerTop = containerRect.top + scrollTop,
                    containerCenter = containerRect.left + containerRect.width / 2,
                    toolbarHeight = toolbarElement.offsetHeight,
                    toolbarWidth = toolbarElement.offsetWidth,
                    halfOffsetWidth = toolbarWidth / 2,
                    targetLeft;

                if (this.sticky) {
                    if (scrollTop > containerTop + container.offsetHeight - toolbarHeight - this.stickyTopOffset) {
                        toolbarElement.style.top = containerTop + container.offsetHeight - toolbarHeight + 'px';
                        toolbarElement.classList.remove('medium-editor-sticky-toolbar');
                    } else if (scrollTop > containerTop - toolbarHeight - this.stickyTopOffset) {
                        toolbarElement.classList.add('medium-editor-sticky-toolbar');
                        toolbarElement.style.top = this.stickyTopOffset + 'px';
                    } else {
                        toolbarElement.classList.remove('medium-editor-sticky-toolbar');
                        toolbarElement.style.top = containerTop - toolbarHeight + 'px';
                    }
                } else {
                    toolbarElement.style.top = containerTop - toolbarHeight + 'px';
                }

                switch (this.align) {
                    case 'left':
                        targetLeft = containerRect.left;
                        break;

                    case 'right':
                        targetLeft = containerRect.right - toolbarWidth;
                        break;

                    case 'center':
                        targetLeft = containerCenter - halfOffsetWidth;
                        break;
                }

                if (targetLeft < 0) {
                    targetLeft = 0;
                } else if (targetLeft + toolbarWidth > windowWidth) {
                    targetLeft = windowWidth - Math.ceil(toolbarWidth) - 1;
                }

                toolbarElement.style.left = targetLeft + 'px';
            },

            positionToolbar: function positionToolbar(selection) {
                this.getToolbarElement().style.left = '0';
                this.getToolbarElement().style.right = 'initial';

                var range = selection.getRangeAt(0),
                    boundary = range.getBoundingClientRect();

                if (!boundary || boundary.height === 0 && boundary.width === 0 && range.startContainer === range.endContainer) {
                    if (range.startContainer.nodeType === 1 && range.startContainer.querySelector('img')) {
                        boundary = range.startContainer.querySelector('img').getBoundingClientRect();
                    } else {
                        boundary = range.startContainer.getBoundingClientRect();
                    }
                }

                var containerWidth = this.window.innerWidth,
                    toolbarElement = this.getToolbarElement(),
                    toolbarHeight = toolbarElement.offsetHeight,
                    toolbarWidth = toolbarElement.offsetWidth,
                    halfOffsetWidth = toolbarWidth / 2,
                    buttonHeight = 50,
                    defaultLeft = this.diffLeft - halfOffsetWidth,
                    elementsContainer = this.getEditorOption('elementsContainer'),
                    elementsContainerAbsolute = ['absolute', 'fixed'].indexOf(window.getComputedStyle(elementsContainer).getPropertyValue('position')) > -1,
                    positions = {},
                    relativeBoundary = {},
                    middleBoundary,
                    elementsContainerBoundary;

                if (elementsContainerAbsolute) {
                    elementsContainerBoundary = elementsContainer.getBoundingClientRect();
                    ['top', 'left'].forEach(function (key) {
                        relativeBoundary[key] = boundary[key] - elementsContainerBoundary[key];
                    });

                    relativeBoundary.width = boundary.width;
                    relativeBoundary.height = boundary.height;
                    boundary = relativeBoundary;

                    containerWidth = elementsContainerBoundary.width;

                    positions.top = elementsContainer.scrollTop;
                } else {
                    positions.top = this.window.pageYOffset;
                }

                middleBoundary = boundary.left + boundary.width / 2;
                positions.top += boundary.top - toolbarHeight;

                if (boundary.top < buttonHeight) {
                    toolbarElement.classList.add('medium-toolbar-arrow-over');
                    toolbarElement.classList.remove('medium-toolbar-arrow-under');
                    positions.top += buttonHeight + boundary.height - this.diffTop;
                } else {
                    toolbarElement.classList.add('medium-toolbar-arrow-under');
                    toolbarElement.classList.remove('medium-toolbar-arrow-over');
                    positions.top += this.diffTop;
                }

                if (middleBoundary < halfOffsetWidth) {
                    positions.left = defaultLeft + halfOffsetWidth;
                    positions.right = 'initial';
                } else if (containerWidth - middleBoundary < halfOffsetWidth) {
                    positions.left = 'auto';
                    positions.right = 0;
                } else {
                    positions.left = defaultLeft + middleBoundary;
                    positions.right = 'initial';
                }

                ['top', 'left', 'right'].forEach(function (key) {
                    toolbarElement.style[key] = positions[key] + (isNaN(positions[key]) ? '' : 'px');
                });
            }
        });

        MediumEditor.extensions.toolbar = Toolbar;
    })();

    (function () {
        'use strict';

        var ImageDragging = MediumEditor.Extension.extend({
            init: function init() {
                MediumEditor.Extension.prototype.init.apply(this, arguments);

                this.subscribe('editableDrag', this.handleDrag.bind(this));
                this.subscribe('editableDrop', this.handleDrop.bind(this));
            },

            handleDrag: function handleDrag(event) {
                var className = 'medium-editor-dragover';
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';

                if (event.type === 'dragover') {
                    event.target.classList.add(className);
                } else if (event.type === 'dragleave') {
                    event.target.classList.remove(className);
                }
            },

            handleDrop: function handleDrop(event) {
                var className = 'medium-editor-dragover',
                    files;
                event.preventDefault();
                event.stopPropagation();

                if (event.dataTransfer.files) {
                    files = Array.prototype.slice.call(event.dataTransfer.files, 0);
                    files.some(function (file) {
                        if (file.type.match('image')) {
                            var fileReader, id;
                            fileReader = new FileReader();
                            fileReader.readAsDataURL(file);

                            id = 'medium-img-' + +new Date();
                            MediumEditor.util.insertHTMLCommand(this.document, '<img class="medium-editor-image-loading" id="' + id + '" />');

                            fileReader.onload = function () {
                                var img = this.document.getElementById(id);
                                if (img) {
                                    img.removeAttribute('id');
                                    img.removeAttribute('class');
                                    img.src = fileReader.result;
                                }
                            }.bind(this);
                        }
                    }.bind(this));
                }
                event.target.classList.remove(className);
            }
        });

        MediumEditor.extensions.imageDragging = ImageDragging;
    })();

    (function () {
        'use strict';

        function handleDisableExtraSpaces(event) {
            var node = MediumEditor.selection.getSelectionStart(this.options.ownerDocument),
                textContent = node.textContent,
                caretPositions = MediumEditor.selection.getCaretOffsets(node);

            if (textContent[caretPositions.left - 1] === undefined || textContent[caretPositions.left - 1].trim() === '' || textContent[caretPositions.left] !== undefined && textContent[caretPositions.left].trim() === '') {
                event.preventDefault();
            }
        }

        function handleDisabledEnterKeydown(event, element) {
            if (this.options.disableReturn || element.getAttribute('data-disable-return')) {
                event.preventDefault();
            } else if (this.options.disableDoubleReturn || element.getAttribute('data-disable-double-return')) {
                var node = MediumEditor.selection.getSelectionStart(this.options.ownerDocument);

                if (node && node.textContent.trim() === '' && node.nodeName.toLowerCase() !== 'li' || node.previousElementSibling && node.previousElementSibling.nodeName.toLowerCase() !== 'br' && node.previousElementSibling.textContent.trim() === '') {
                    event.preventDefault();
                }
            }
        }

        function handleTabKeydown(event) {
            var node = MediumEditor.selection.getSelectionStart(this.options.ownerDocument),
                tag = node && node.nodeName.toLowerCase();

            if (tag === 'pre') {
                event.preventDefault();
                MediumEditor.util.insertHTMLCommand(this.options.ownerDocument, '    ');
            }

            if (MediumEditor.util.isListItem(node)) {
                event.preventDefault();

                if (event.shiftKey) {
                    this.options.ownerDocument.execCommand('outdent', false, null);
                } else {
                    this.options.ownerDocument.execCommand('indent', false, null);
                }
            }
        }

        function handleBlockDeleteKeydowns(event) {
            var p,
                node = MediumEditor.selection.getSelectionStart(this.options.ownerDocument),
                tagName = node.nodeName.toLowerCase(),
                isEmpty = /^(\s+|<br\/?>)?$/i,
                isHeader = /h\d/i;

            if (MediumEditor.util.isKey(event, [MediumEditor.util.keyCode.BACKSPACE, MediumEditor.util.keyCode.ENTER]) && node.previousElementSibling && isHeader.test(tagName) && MediumEditor.selection.getCaretOffsets(node).left === 0) {
                if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.BACKSPACE) && isEmpty.test(node.previousElementSibling.innerHTML)) {
                    node.previousElementSibling.parentNode.removeChild(node.previousElementSibling);
                    event.preventDefault();
                } else if (!this.options.disableDoubleReturn && MediumEditor.util.isKey(event, MediumEditor.util.keyCode.ENTER)) {
                    p = this.options.ownerDocument.createElement('p');
                    p.innerHTML = '<br>';
                    node.previousElementSibling.parentNode.insertBefore(p, node);
                    event.preventDefault();
                }
            } else if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.DELETE) && node.nextElementSibling && node.previousElementSibling && !isHeader.test(tagName) && isEmpty.test(node.innerHTML) && isHeader.test(node.nextElementSibling.nodeName.toLowerCase())) {
                MediumEditor.selection.moveCursor(this.options.ownerDocument, node.nextElementSibling);

                node.previousElementSibling.parentNode.removeChild(node);

                event.preventDefault();
            } else if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.BACKSPACE) && tagName === 'li' && isEmpty.test(node.innerHTML) && !node.previousElementSibling && !node.parentElement.previousElementSibling && node.nextElementSibling && node.nextElementSibling.nodeName.toLowerCase() === 'li') {
                p = this.options.ownerDocument.createElement('p');
                p.innerHTML = '<br>';
                node.parentElement.parentElement.insertBefore(p, node.parentElement);

                MediumEditor.selection.moveCursor(this.options.ownerDocument, p);

                node.parentElement.removeChild(node);

                event.preventDefault();
            } else if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.BACKSPACE) && MediumEditor.util.getClosestTag(node, 'blockquote') !== false && MediumEditor.selection.getCaretOffsets(node).left === 0) {
                event.preventDefault();
                MediumEditor.util.execFormatBlock(this.options.ownerDocument, 'p');
            } else if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.ENTER) && MediumEditor.util.getClosestTag(node, 'blockquote') !== false && MediumEditor.selection.getCaretOffsets(node).right === 0) {
                p = this.options.ownerDocument.createElement('p');
                p.innerHTML = '<br>';
                node.parentElement.insertBefore(p, node.nextSibling);

                MediumEditor.selection.moveCursor(this.options.ownerDocument, p);

                event.preventDefault();
            } else if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.BACKSPACE) && MediumEditor.util.isMediumEditorElement(node.parentElement) && !node.previousElementSibling && node.nextElementSibling && isEmpty.test(node.innerHTML)) {
                event.preventDefault();
                MediumEditor.selection.moveCursor(this.options.ownerDocument, node.nextSibling);
                node.parentElement.removeChild(node);
            }
        }

        function handleKeyup(event) {
            var node = MediumEditor.selection.getSelectionStart(this.options.ownerDocument),
                tagName;

            if (!node) {
                return;
            }

            if (MediumEditor.util.isMediumEditorElement(node) && node.children.length === 0 && !MediumEditor.util.isBlockContainer(node)) {
                this.options.ownerDocument.execCommand('formatBlock', false, 'p');
            }

            if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.ENTER) && !MediumEditor.util.isListItem(node) && !MediumEditor.util.isBlockContainer(node)) {

                tagName = node.nodeName.toLowerCase();

                if (tagName === 'a') {
                    this.options.ownerDocument.execCommand('unlink', false, null);
                } else if (!event.shiftKey && !event.ctrlKey) {
                    this.options.ownerDocument.execCommand('formatBlock', false, 'p');
                }
            }
        }

        function handleEditableInput(event, editable) {
            var textarea = editable.parentNode.querySelector('textarea[medium-editor-textarea-id="' + editable.getAttribute('medium-editor-textarea-id') + '"]');
            if (textarea) {
                textarea.value = editable.innerHTML.trim();
            }
        }

        function addToEditors(win) {
            if (!win._mediumEditors) {
                win._mediumEditors = [null];
            }

            if (!this.id) {
                this.id = win._mediumEditors.length;
            }

            win._mediumEditors[this.id] = this;
        }

        function removeFromEditors(win) {
            if (!win._mediumEditors || !win._mediumEditors[this.id]) {
                return;
            }

            win._mediumEditors[this.id] = null;
        }

        function createElementsArray(selector, doc, filterEditorElements) {
            var elements = [];

            if (!selector) {
                selector = [];
            }

            if (typeof selector === 'string') {
                selector = doc.querySelectorAll(selector);
            }

            if (MediumEditor.util.isElement(selector)) {
                selector = [selector];
            }

            if (filterEditorElements) {
                for (var i = 0; i < selector.length; i++) {
                    var el = selector[i];
                    if (MediumEditor.util.isElement(el) && !el.getAttribute('data-medium-editor-element') && !el.getAttribute('medium-editor-textarea-id')) {
                        elements.push(el);
                    }
                }
            } else {
                elements = Array.prototype.slice.apply(selector);
            }

            return elements;
        }

        function cleanupTextareaElement(element) {
            var textarea = element.parentNode.querySelector('textarea[medium-editor-textarea-id="' + element.getAttribute('medium-editor-textarea-id') + '"]');
            if (textarea) {
                textarea.classList.remove('medium-editor-hidden');
                textarea.removeAttribute('medium-editor-textarea-id');
            }
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }

        function setExtensionDefaults(extension, defaults) {
            Object.keys(defaults).forEach(function (prop) {
                if (extension[prop] === undefined) {
                    extension[prop] = defaults[prop];
                }
            });
            return extension;
        }

        function initExtension(extension, name, instance) {
            var extensionDefaults = {
                'window': instance.options.contentWindow,
                'document': instance.options.ownerDocument,
                'base': instance
            };

            extension = setExtensionDefaults(extension, extensionDefaults);

            if (typeof extension.init === 'function') {
                extension.init();
            }

            if (!extension.name) {
                extension.name = name;
            }
            return extension;
        }

        function isToolbarEnabled() {
            if (this.elements.every(function (element) {
                return !!element.getAttribute('data-disable-toolbar');
            })) {
                return false;
            }

            return this.options.toolbar !== false;
        }

        function isAnchorPreviewEnabled() {
            if (!isToolbarEnabled.call(this)) {
                return false;
            }

            return this.options.anchorPreview !== false;
        }

        function isPlaceholderEnabled() {
            return this.options.placeholder !== false;
        }

        function isAutoLinkEnabled() {
            return this.options.autoLink !== false;
        }

        function isImageDraggingEnabled() {
            return this.options.imageDragging !== false;
        }

        function isKeyboardCommandsEnabled() {
            return this.options.keyboardCommands !== false;
        }

        function shouldUseFileDraggingExtension() {
            return !this.options.extensions['imageDragging'];
        }

        function createContentEditable(textarea) {
            var div = this.options.ownerDocument.createElement('div'),
                now = Date.now(),
                uniqueId = 'medium-editor-' + now,
                atts = textarea.attributes;

            while (this.options.ownerDocument.getElementById(uniqueId)) {
                now++;
                uniqueId = 'medium-editor-' + now;
            }

            div.className = textarea.className;
            div.id = uniqueId;
            div.innerHTML = textarea.value;

            textarea.setAttribute('medium-editor-textarea-id', uniqueId);

            for (var i = 0, n = atts.length; i < n; i++) {
                if (!div.hasAttribute(atts[i].nodeName)) {
                    div.setAttribute(atts[i].nodeName, atts[i].nodeValue);
                }
            }

            if (textarea.form) {
                this.on(textarea.form, 'reset', function (event) {
                    if (!event.defaultPrevented) {
                        this.resetContent(this.options.ownerDocument.getElementById(uniqueId));
                    }
                }.bind(this));
            }

            textarea.classList.add('medium-editor-hidden');
            textarea.parentNode.insertBefore(div, textarea);

            return div;
        }

        function initElement(element, editorId) {
            if (!element.getAttribute('data-medium-editor-element')) {
                if (element.nodeName.toLowerCase() === 'textarea') {
                    element = createContentEditable.call(this, element);

                    if (!this.instanceHandleEditableInput) {
                        this.instanceHandleEditableInput = handleEditableInput.bind(this);
                        this.subscribe('editableInput', this.instanceHandleEditableInput);
                    }
                }

                if (!this.options.disableEditing && !element.getAttribute('data-disable-editing')) {
                    element.setAttribute('contentEditable', true);
                    element.setAttribute('spellcheck', this.options.spellcheck);
                }

                if (!this.instanceHandleEditableKeydownEnter) {
                    if (element.getAttribute('data-disable-return') || element.getAttribute('data-disable-double-return')) {
                        this.instanceHandleEditableKeydownEnter = handleDisabledEnterKeydown.bind(this);
                        this.subscribe('editableKeydownEnter', this.instanceHandleEditableKeydownEnter);
                    }
                }

                if (!this.options.disableReturn && !element.getAttribute('data-disable-return')) {
                    this.on(element, 'keyup', handleKeyup.bind(this));
                }

                var elementId = MediumEditor.util.guid();

                element.setAttribute('data-medium-editor-element', true);
                element.classList.add('medium-editor-element');
                element.setAttribute('role', 'textbox');
                element.setAttribute('aria-multiline', true);
                element.setAttribute('data-medium-editor-editor-index', editorId);

                element.setAttribute('medium-editor-index', elementId);
                initialContent[elementId] = element.innerHTML;

                this.events.attachAllEventsToElement(element);
            }

            return element;
        }

        function attachHandlers() {
            this.subscribe('editableKeydownTab', handleTabKeydown.bind(this));

            this.subscribe('editableKeydownDelete', handleBlockDeleteKeydowns.bind(this));
            this.subscribe('editableKeydownEnter', handleBlockDeleteKeydowns.bind(this));

            if (this.options.disableExtraSpaces) {
                this.subscribe('editableKeydownSpace', handleDisableExtraSpaces.bind(this));
            }

            if (!this.instanceHandleEditableKeydownEnter) {
                if (this.options.disableReturn || this.options.disableDoubleReturn) {
                    this.instanceHandleEditableKeydownEnter = handleDisabledEnterKeydown.bind(this);
                    this.subscribe('editableKeydownEnter', this.instanceHandleEditableKeydownEnter);
                }
            }
        }

        function initExtensions() {

            this.extensions = [];

            Object.keys(this.options.extensions).forEach(function (name) {
                if (name !== 'toolbar' && this.options.extensions[name]) {
                    this.extensions.push(initExtension(this.options.extensions[name], name, this));
                }
            }, this);

            if (shouldUseFileDraggingExtension.call(this)) {
                var opts = this.options.fileDragging;
                if (!opts) {
                    opts = {};

                    if (!isImageDraggingEnabled.call(this)) {
                        opts.allowedTypes = [];
                    }
                }
                this.addBuiltInExtension('fileDragging', opts);
            }

            var builtIns = {
                paste: true,
                'anchor-preview': isAnchorPreviewEnabled.call(this),
                autoLink: isAutoLinkEnabled.call(this),
                keyboardCommands: isKeyboardCommandsEnabled.call(this),
                placeholder: isPlaceholderEnabled.call(this)
            };
            Object.keys(builtIns).forEach(function (name) {
                if (builtIns[name]) {
                    this.addBuiltInExtension(name);
                }
            }, this);

            var toolbarExtension = this.options.extensions['toolbar'];
            if (!toolbarExtension && isToolbarEnabled.call(this)) {
                var toolbarOptions = MediumEditor.util.extend({}, this.options.toolbar, {
                    allowMultiParagraphSelection: this.options.allowMultiParagraphSelection });
                toolbarExtension = new MediumEditor.extensions.toolbar(toolbarOptions);
            }

            if (toolbarExtension) {
                this.extensions.push(initExtension(toolbarExtension, 'toolbar', this));
            }
        }

        function mergeOptions(defaults, options) {
            var deprecatedProperties = [['allowMultiParagraphSelection', 'toolbar.allowMultiParagraphSelection']];

            if (options) {
                deprecatedProperties.forEach(function (pair) {
                    if (options.hasOwnProperty(pair[0]) && options[pair[0]] !== undefined) {
                        MediumEditor.util.deprecated(pair[0], pair[1], 'v6.0.0');
                    }
                });
            }

            return MediumEditor.util.defaults({}, options, defaults);
        }

        function execActionInternal(action, opts) {
            var appendAction = /^append-(.+)$/gi,
                justifyAction = /justify([A-Za-z]*)$/g,
                match,
                cmdValueArgument;

            match = appendAction.exec(action);
            if (match) {
                return MediumEditor.util.execFormatBlock(this.options.ownerDocument, match[1]);
            }

            if (action === 'fontSize') {
                if (opts.size) {
                    MediumEditor.util.deprecated('.size option for fontSize command', '.value', '6.0.0');
                }
                cmdValueArgument = opts.value || opts.size;
                return this.options.ownerDocument.execCommand('fontSize', false, cmdValueArgument);
            }

            if (action === 'fontName') {
                if (opts.name) {
                    MediumEditor.util.deprecated('.name option for fontName command', '.value', '6.0.0');
                }
                cmdValueArgument = opts.value || opts.name;
                return this.options.ownerDocument.execCommand('fontName', false, cmdValueArgument);
            }

            if (action === 'createLink') {
                return this.createLink(opts);
            }

            if (action === 'image') {
                var src = this.options.contentWindow.getSelection().toString().trim();
                return this.options.ownerDocument.execCommand('insertImage', false, src);
            }

            if (action === 'html') {
                var html = this.options.contentWindow.getSelection().toString().trim();
                return MediumEditor.util.insertHTMLCommand(this.options.ownerDocument, html);
            }

            if (justifyAction.exec(action)) {
                var result = this.options.ownerDocument.execCommand(action, false, null),
                    parentNode = MediumEditor.selection.getSelectedParentElement(MediumEditor.selection.getSelectionRange(this.options.ownerDocument));
                if (parentNode) {
                    cleanupJustifyDivFragments.call(this, MediumEditor.util.getTopBlockContainer(parentNode));
                }

                return result;
            }

            cmdValueArgument = opts && opts.value;
            return this.options.ownerDocument.execCommand(action, false, cmdValueArgument);
        }

        function cleanupJustifyDivFragments(blockContainer) {
            if (!blockContainer) {
                return;
            }

            var textAlign,
                childDivs = Array.prototype.slice.call(blockContainer.childNodes).filter(function (element) {
                var isDiv = element.nodeName.toLowerCase() === 'div';
                if (isDiv && !textAlign) {
                    textAlign = element.style.textAlign;
                }
                return isDiv;
            });

            if (childDivs.length) {
                this.saveSelection();
                childDivs.forEach(function (div) {
                    if (div.style.textAlign === textAlign) {
                        var lastChild = div.lastChild;
                        if (lastChild) {
                            MediumEditor.util.unwrap(div, this.options.ownerDocument);
                            var br = this.options.ownerDocument.createElement('BR');
                            lastChild.parentNode.insertBefore(br, lastChild.nextSibling);
                        }
                    }
                }, this);
                blockContainer.style.textAlign = textAlign;

                this.restoreSelection();
            }
        }

        var initialContent = {};

        MediumEditor.prototype = {
            init: function init(elements, options) {
                this.options = mergeOptions.call(this, this.defaults, options);
                this.origElements = elements;

                if (!this.options.elementsContainer) {
                    this.options.elementsContainer = this.options.ownerDocument.body;
                }

                return this.setup();
            },

            setup: function setup() {
                if (this.isActive) {
                    return;
                }

                addToEditors.call(this, this.options.contentWindow);
                this.events = new MediumEditor.Events(this);
                this.elements = [];

                this.addElements(this.origElements);

                if (this.elements.length === 0) {
                    return;
                }

                this.isActive = true;

                initExtensions.call(this);
                attachHandlers.call(this);
            },

            destroy: function destroy() {
                if (!this.isActive) {
                    return;
                }

                this.isActive = false;

                this.extensions.forEach(function (extension) {
                    if (typeof extension.destroy === 'function') {
                        extension.destroy();
                    }
                }, this);

                this.events.destroy();

                this.elements.forEach(function (element) {
                    if (this.options.spellcheck) {
                        element.innerHTML = element.innerHTML;
                    }

                    element.removeAttribute('contentEditable');
                    element.removeAttribute('spellcheck');
                    element.removeAttribute('data-medium-editor-element');
                    element.classList.remove('medium-editor-element');
                    element.removeAttribute('role');
                    element.removeAttribute('aria-multiline');
                    element.removeAttribute('medium-editor-index');
                    element.removeAttribute('data-medium-editor-editor-index');

                    if (element.getAttribute('medium-editor-textarea-id')) {
                        cleanupTextareaElement(element);
                    }
                }, this);
                this.elements = [];
                this.instanceHandleEditableKeydownEnter = null;
                this.instanceHandleEditableInput = null;

                removeFromEditors.call(this, this.options.contentWindow);
            },

            on: function on(target, event, listener, useCapture) {
                this.events.attachDOMEvent(target, event, listener, useCapture);

                return this;
            },

            off: function off(target, event, listener, useCapture) {
                this.events.detachDOMEvent(target, event, listener, useCapture);

                return this;
            },

            subscribe: function subscribe(event, listener) {
                this.events.attachCustomEvent(event, listener);

                return this;
            },

            unsubscribe: function unsubscribe(event, listener) {
                this.events.detachCustomEvent(event, listener);

                return this;
            },

            trigger: function trigger(name, data, editable) {
                this.events.triggerCustomEvent(name, data, editable);

                return this;
            },

            delay: function delay(fn) {
                var self = this;
                return setTimeout(function () {
                    if (self.isActive) {
                        fn();
                    }
                }, this.options.delay);
            },

            serialize: function serialize() {
                var i,
                    elementid,
                    content = {},
                    len = this.elements.length;

                for (i = 0; i < len; i += 1) {
                    elementid = this.elements[i].id !== '' ? this.elements[i].id : 'element-' + i;
                    content[elementid] = {
                        value: this.elements[i].innerHTML.trim()
                    };
                }
                return content;
            },

            getExtensionByName: function getExtensionByName(name) {
                var extension;
                if (this.extensions && this.extensions.length) {
                    this.extensions.some(function (ext) {
                        if (ext.name === name) {
                            extension = ext;
                            return true;
                        }
                        return false;
                    });
                }
                return extension;
            },

            addBuiltInExtension: function addBuiltInExtension(name, opts) {
                var extension = this.getExtensionByName(name),
                    merged;
                if (extension) {
                    return extension;
                }

                switch (name) {
                    case 'anchor':
                        merged = MediumEditor.util.extend({}, this.options.anchor, opts);
                        extension = new MediumEditor.extensions.anchor(merged);
                        break;
                    case 'anchor-preview':
                        extension = new MediumEditor.extensions.anchorPreview(this.options.anchorPreview);
                        break;
                    case 'autoLink':
                        extension = new MediumEditor.extensions.autoLink();
                        break;
                    case 'fileDragging':
                        extension = new MediumEditor.extensions.fileDragging(opts);
                        break;
                    case 'fontname':
                        extension = new MediumEditor.extensions.fontName(this.options.fontName);
                        break;
                    case 'fontsize':
                        extension = new MediumEditor.extensions.fontSize(opts);
                        break;
                    case 'keyboardCommands':
                        extension = new MediumEditor.extensions.keyboardCommands(this.options.keyboardCommands);
                        break;
                    case 'paste':
                        extension = new MediumEditor.extensions.paste(this.options.paste);
                        break;
                    case 'placeholder':
                        extension = new MediumEditor.extensions.placeholder(this.options.placeholder);
                        break;
                    default:
                        if (MediumEditor.extensions.button.isBuiltInButton(name)) {
                            if (opts) {
                                merged = MediumEditor.util.defaults({}, opts, MediumEditor.extensions.button.prototype.defaults[name]);
                                extension = new MediumEditor.extensions.button(merged);
                            } else {
                                extension = new MediumEditor.extensions.button(name);
                            }
                        }
                }

                if (extension) {
                    this.extensions.push(initExtension(extension, name, this));
                }

                return extension;
            },

            stopSelectionUpdates: function stopSelectionUpdates() {
                this.preventSelectionUpdates = true;
            },

            startSelectionUpdates: function startSelectionUpdates() {
                this.preventSelectionUpdates = false;
            },

            checkSelection: function checkSelection() {
                var toolbar = this.getExtensionByName('toolbar');
                if (toolbar) {
                    toolbar.checkState();
                }
                return this;
            },

            queryCommandState: function queryCommandState(action) {
                var fullAction = /^full-(.+)$/gi,
                    match,
                    queryState = null;

                match = fullAction.exec(action);
                if (match) {
                    action = match[1];
                }

                try {
                    queryState = this.options.ownerDocument.queryCommandState(action);
                } catch (exc) {
                    queryState = null;
                }

                return queryState;
            },

            execAction: function execAction(action, opts) {
                var fullAction = /^full-(.+)$/gi,
                    match,
                    result;

                match = fullAction.exec(action);
                if (match) {
                    this.saveSelection();

                    this.selectAllContents();
                    result = execActionInternal.call(this, match[1], opts);

                    this.restoreSelection();
                } else {
                    result = execActionInternal.call(this, action, opts);
                }

                if (action === 'insertunorderedlist' || action === 'insertorderedlist') {
                    MediumEditor.util.cleanListDOM(this.options.ownerDocument, this.getSelectedParentElement());
                }

                this.checkSelection();
                return result;
            },

            getSelectedParentElement: function getSelectedParentElement(range) {
                if (range === undefined) {
                    range = this.options.contentWindow.getSelection().getRangeAt(0);
                }
                return MediumEditor.selection.getSelectedParentElement(range);
            },

            selectAllContents: function selectAllContents() {
                var currNode = MediumEditor.selection.getSelectionElement(this.options.contentWindow);

                if (currNode) {
                    while (currNode.children.length === 1) {
                        currNode = currNode.children[0];
                    }

                    this.selectElement(currNode);
                }
            },

            selectElement: function selectElement(element) {
                MediumEditor.selection.selectNode(element, this.options.ownerDocument);

                var selElement = MediumEditor.selection.getSelectionElement(this.options.contentWindow);
                if (selElement) {
                    this.events.focusElement(selElement);
                }
            },

            getFocusedElement: function getFocusedElement() {
                var focused;
                this.elements.some(function (element) {
                    if (!focused && element.getAttribute('data-medium-focused')) {
                        focused = element;
                    }

                    return !!focused;
                }, this);

                return focused;
            },

            exportSelection: function exportSelection() {
                var selectionElement = MediumEditor.selection.getSelectionElement(this.options.contentWindow),
                    editableElementIndex = this.elements.indexOf(selectionElement),
                    selectionState = null;

                if (editableElementIndex >= 0) {
                    selectionState = MediumEditor.selection.exportSelection(selectionElement, this.options.ownerDocument);
                }

                if (selectionState !== null && editableElementIndex !== 0) {
                    selectionState.editableElementIndex = editableElementIndex;
                }

                return selectionState;
            },

            saveSelection: function saveSelection() {
                this.selectionState = this.exportSelection();
            },

            importSelection: function importSelection(selectionState, favorLaterSelectionAnchor) {
                if (!selectionState) {
                    return;
                }

                var editableElement = this.elements[selectionState.editableElementIndex || 0];
                MediumEditor.selection.importSelection(selectionState, editableElement, this.options.ownerDocument, favorLaterSelectionAnchor);
            },

            restoreSelection: function restoreSelection() {
                this.importSelection(this.selectionState);
            },

            createLink: function createLink(opts) {
                var currentEditor = MediumEditor.selection.getSelectionElement(this.options.contentWindow),
                    customEvent = {},
                    targetUrl;

                if (this.elements.indexOf(currentEditor) === -1) {
                    return;
                }

                try {
                    this.events.disableCustomEvent('editableInput');

                    if (opts.url) {
                        MediumEditor.util.deprecated('.url option for createLink', '.value', '6.0.0');
                    }
                    targetUrl = opts.url || opts.value;
                    if (targetUrl && targetUrl.trim().length > 0) {
                        var currentSelection = this.options.contentWindow.getSelection();
                        if (currentSelection) {
                            var currRange = currentSelection.getRangeAt(0),
                                commonAncestorContainer = currRange.commonAncestorContainer,
                                exportedSelection,
                                startContainerParentElement,
                                endContainerParentElement,
                                textNodes;

                            if (currRange.endContainer.nodeType === 3 && currRange.startContainer.nodeType !== 3 && currRange.startOffset === 0 && currRange.startContainer.firstChild === currRange.endContainer) {
                                commonAncestorContainer = currRange.endContainer;
                            }

                            startContainerParentElement = MediumEditor.util.getClosestBlockContainer(currRange.startContainer);
                            endContainerParentElement = MediumEditor.util.getClosestBlockContainer(currRange.endContainer);

                            if (commonAncestorContainer.nodeType !== 3 && commonAncestorContainer.textContent.length !== 0 && startContainerParentElement === endContainerParentElement) {
                                var parentElement = startContainerParentElement || currentEditor,
                                    fragment = this.options.ownerDocument.createDocumentFragment();

                                this.execAction('unlink');

                                exportedSelection = this.exportSelection();
                                fragment.appendChild(parentElement.cloneNode(true));

                                if (currentEditor === parentElement) {
                                    MediumEditor.selection.select(this.options.ownerDocument, parentElement.firstChild, 0, parentElement.lastChild, parentElement.lastChild.nodeType === 3 ? parentElement.lastChild.nodeValue.length : parentElement.lastChild.childNodes.length);
                                } else {
                                    MediumEditor.selection.select(this.options.ownerDocument, parentElement, 0, parentElement, parentElement.childNodes.length);
                                }

                                var modifiedExportedSelection = this.exportSelection();

                                textNodes = MediumEditor.util.findOrCreateMatchingTextNodes(this.options.ownerDocument, fragment, {
                                    start: exportedSelection.start - modifiedExportedSelection.start,
                                    end: exportedSelection.end - modifiedExportedSelection.start,
                                    editableElementIndex: exportedSelection.editableElementIndex
                                });

                                if (textNodes.length === 0) {
                                    fragment = this.options.ownerDocument.createDocumentFragment();
                                    fragment.appendChild(commonAncestorContainer.cloneNode(true));
                                    textNodes = [fragment.firstChild.firstChild, fragment.firstChild.lastChild];
                                }

                                MediumEditor.util.createLink(this.options.ownerDocument, textNodes, targetUrl.trim());

                                var leadingWhitespacesCount = (fragment.firstChild.innerHTML.match(/^\s+/) || [''])[0].length;

                                MediumEditor.util.insertHTMLCommand(this.options.ownerDocument, fragment.firstChild.innerHTML.replace(/^\s+/, ''));
                                exportedSelection.start -= leadingWhitespacesCount;
                                exportedSelection.end -= leadingWhitespacesCount;

                                this.importSelection(exportedSelection);
                            } else {
                                this.options.ownerDocument.execCommand('createLink', false, targetUrl);
                            }

                            if (this.options.targetBlank || opts.target === '_blank') {
                                MediumEditor.util.setTargetBlank(MediumEditor.selection.getSelectionStart(this.options.ownerDocument), targetUrl);
                            } else {
                                MediumEditor.util.removeTargetBlank(MediumEditor.selection.getSelectionStart(this.options.ownerDocument), targetUrl);
                            }

                            if (opts.buttonClass) {
                                MediumEditor.util.addClassToAnchors(MediumEditor.selection.getSelectionStart(this.options.ownerDocument), opts.buttonClass);
                            }
                        }
                    }

                    if (this.options.targetBlank || opts.target === '_blank' || opts.buttonClass) {
                        customEvent = this.options.ownerDocument.createEvent('HTMLEvents');
                        customEvent.initEvent('input', true, true, this.options.contentWindow);
                        for (var i = 0, len = this.elements.length; i < len; i += 1) {
                            this.elements[i].dispatchEvent(customEvent);
                        }
                    }
                } finally {
                    this.events.enableCustomEvent('editableInput');
                }

                this.events.triggerCustomEvent('editableInput', customEvent, currentEditor);
            },

            cleanPaste: function cleanPaste(text) {
                this.getExtensionByName('paste').cleanPaste(text);
            },

            pasteHTML: function pasteHTML(html, options) {
                this.getExtensionByName('paste').pasteHTML(html, options);
            },

            setContent: function setContent(html, index) {
                index = index || 0;

                if (this.elements[index]) {
                    var target = this.elements[index];
                    target.innerHTML = html;
                    this.checkContentChanged(target);
                }
            },

            getContent: function getContent(index) {
                index = index || 0;

                if (this.elements[index]) {
                    return this.elements[index].innerHTML.trim();
                }
                return null;
            },

            checkContentChanged: function checkContentChanged(editable) {
                editable = editable || MediumEditor.selection.getSelectionElement(this.options.contentWindow);
                this.events.updateInput(editable, { target: editable, currentTarget: editable });
            },

            resetContent: function resetContent(element) {

                if (element) {
                    var index = this.elements.indexOf(element);
                    if (index !== -1) {
                        this.setContent(initialContent[element.getAttribute('medium-editor-index')], index);
                    }
                    return;
                }

                this.elements.forEach(function (el, idx) {
                    this.setContent(initialContent[el.getAttribute('medium-editor-index')], idx);
                }, this);
            },

            addElements: function addElements(selector) {
                var elements = createElementsArray(selector, this.options.ownerDocument, true);

                if (elements.length === 0) {
                    return false;
                }

                elements.forEach(function (element) {
                    element = initElement.call(this, element, this.id);

                    this.elements.push(element);

                    this.trigger('addElement', { target: element, currentTarget: element }, element);
                }, this);
            },

            removeElements: function removeElements(selector) {
                var elements = createElementsArray(selector, this.options.ownerDocument),
                    toRemove = elements.map(function (el) {
                    if (el.getAttribute('medium-editor-textarea-id') && el.parentNode) {
                        return el.parentNode.querySelector('div[medium-editor-textarea-id="' + el.getAttribute('medium-editor-textarea-id') + '"]');
                    } else {
                        return el;
                    }
                });

                this.elements = this.elements.filter(function (element) {
                    if (toRemove.indexOf(element) !== -1) {
                        this.events.cleanupElement(element);
                        if (element.getAttribute('medium-editor-textarea-id')) {
                            cleanupTextareaElement(element);
                        }

                        this.trigger('removeElement', { target: element, currentTarget: element }, element);
                        return false;
                    }
                    return true;
                }, this);
            }
        };

        MediumEditor.getEditorFromElement = function (element) {
            var index = element.getAttribute('data-medium-editor-editor-index'),
                win = element && element.ownerDocument && (element.ownerDocument.defaultView || element.ownerDocument.parentWindow);
            if (win && win._mediumEditors && win._mediumEditors[index]) {
                return win._mediumEditors[index];
            }
            return null;
        };
    })();

    (function () {

        MediumEditor.prototype.defaults = {
            activeButtonClass: 'medium-editor-button-active',
            buttonLabels: false,
            delay: 0,
            disableReturn: false,
            disableDoubleReturn: false,
            disableExtraSpaces: false,
            disableEditing: false,
            autoLink: false,
            elementsContainer: false,
            contentWindow: window,
            ownerDocument: document,
            targetBlank: false,
            extensions: {},
            spellcheck: true
        };
    })();

    MediumEditor.parseVersionString = function (release) {
        var split = release.split('-'),
            version = split[0].split('.'),
            preRelease = split.length > 1 ? split[1] : '';
        return {
            major: parseInt(version[0], 10),
            minor: parseInt(version[1], 10),
            revision: parseInt(version[2], 10),
            preRelease: preRelease,
            toString: function toString() {
                return [version[0], version[1], version[2]].join('.') + (preRelease ? '-' + preRelease : '');
            }
        };
    };

    MediumEditor.version = MediumEditor.parseVersionString.call(this, {
        'version': '5.23.2'
    }.version);

    return MediumEditor;
}());