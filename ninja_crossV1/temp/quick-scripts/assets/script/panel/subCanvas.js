(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/panel/subCanvas.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9ea6cviF05Jj5GuSllDVB1D', 'subCanvas', __filename);
// script/panel/subCanvas.js

'use strict';

var _gameConfig = require('../gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {},
    onload: function onload() {
        this.init();
    },
    init: function init() {
        var _this = this;
        if (_gameConfig2.default.IS_WX) {
            if (CC_WECHATGAME) {
                this.tex = new cc.Texture2D();
                window.sharedCanvas.width = 750;
                window.sharedCanvas.height = 1206;
            }
        }
    },
    start: function start() {
        this.tex = new cc.Texture2D();
    },

    // 刷新开放数据域的纹理
    _updateSubDomainCanvas: function _updateSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.node = new cc.SpriteFrame(this.tex);
    },
    update: function update() {
        if (_gameConfig2.default.IS_WX) {
            this._updateSubDomainCanvas();
        }
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
        //# sourceMappingURL=subCanvas.js.map
        