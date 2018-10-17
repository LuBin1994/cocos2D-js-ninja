(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/panel/modeChoose.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '381e0h7o6JIt5IKsu6FA8Up', 'modeChoose', __filename);
// script/panel/modeChoose.js

'use strict';

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

var _GameUITools = require('../utils/GameUITools');

var _GameUITools2 = _interopRequireDefault(_GameUITools);

var _gameDataManager = require('../gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        stickMode: cc.Node,
        bridgeMode: cc.Node,
        jumpMode: cc.Node,
        modeChooseShow: [cc.Node],
        btnSound: {
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad: function onLoad() {
        this.init();
        this.showChoose();
    },
    init: function init() {
        var _this = this;
        _util2.default.modeBtnEvent(this.stickMode, this.btnSound, function () {
            _gameDataManager2.default.toolChoose = 0;
            _GameUITools2.default.unLoadingLayer(_this.node);
            _this.showChoose();
        });

        _util2.default.modeBtnEvent(this.bridgeMode, this.btnSound, function () {
            _gameDataManager2.default.toolChoose = 1;
            _GameUITools2.default.unLoadingLayer(_this.node);
            _this.showChoose();
        });

        _util2.default.modeBtnEvent(this.jumpMode, this.btnSound, function () {
            _gameDataManager2.default.toolChoose = 2;
            _GameUITools2.default.unLoadingLayer(_this.node);
            _this.showChoose();
        });
    },
    showChoose: function showChoose() {
        for (var i = 0; i < 3; i++) {
            this.modeChooseShow[i].active = false;
        }
        this.modeChooseShow[_gameDataManager2.default.toolChoose].active = true;
    },
    start: function start() {},
    update: function update(dt) {}
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
        //# sourceMappingURL=modeChoose.js.map
        