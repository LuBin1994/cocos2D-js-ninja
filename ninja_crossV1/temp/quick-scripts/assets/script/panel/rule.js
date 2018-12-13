(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/panel/rule.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd2830UZLJtPYp+FyYc33J4H', 'rule', __filename);
// script/panel/rule.js

'use strict';

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

var _GameUITools = require('../utils/GameUITools');

var _GameUITools2 = _interopRequireDefault(_GameUITools);

var _gameConfig = require('../gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        rules: cc.Node,
        ruleCloseBtn: cc.Node,
        btnSound: {
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad: function onLoad() {
        this.init();
    },
    init: function init() {
        var _this = this;
        _util2.default.btnEvent(this.ruleCloseBtn, this.btnSound, function () {
            if (_gameConfig2.default.auths_Btn) {
                if (!_gameConfig2.default.IS_AUTHORIZE) {
                    _gameConfig2.default.auths_Btn.show();
                }
            }
            _GameUITools2.default.unLoadingLayer(_this.node);
        });
        this.node.on('touchstart', function (e) {
            e.stopPropagation();
        });
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=rule.js.map
        