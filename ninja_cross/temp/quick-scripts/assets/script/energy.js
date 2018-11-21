(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/energy.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c43999w48VE4btSEyWz28vL', 'energy', __filename);
// script/energy.js

'use strict';

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        energy: cc.Node,
        caliUp: cc.Node,
        caliDown: cc.Node,
        energySpeed: 5
    },
    onLoad: function onLoad() {},
    init: function init(game) {
        this.game = game;
        this.hideCali();
    },
    configInit: function configInit() {
        this.energy.height = 0;
        this.energySpeed = 5;
        this.node.opacity = 255;
    },
    gameInit: function gameInit() {
        this.energy.height = 0;
        this.energySpeed = 5;
        this.node.opacity = 255;
        this.setCali();
    },

    //设置能量条刻度
    setCali: function setCali() {
        var lengthObj = this.game.stage.getLength();
        var downY = Math.floor(lengthObj.min / 600 * 300);
        var upY = Math.floor(lengthObj.max / 600 * 300);
        this.caliUp.y = -147 + upY;
        this.caliDown.y = -147 + downY;
    },
    showCali: function showCali() {
        this.node.active = true;
    },
    hideCali: function hideCali() {
        this.node.active = false;
    },
    update: function update() {
        if (_gameDataManager2.default.toolChoose == 2) {
            if (_gameDataManager2.default.isLengthen) {
                this.energy.height += this.energySpeed;
                if (this.energy.height == 300 || this.energy.height == 0) {
                    this.energySpeed *= -1;
                }
            }
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
        //# sourceMappingURL=energy.js.map
        