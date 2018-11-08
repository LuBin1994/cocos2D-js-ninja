(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/bridge.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ab2925nPNhKQ7LzANX24OIQ', 'bridge', __filename);
// script/bridge.js

'use strict';

var _gameConfig = require('./gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        bridgePrefab: cc.Prefab,
        bridgeY: 90,
        timer: 0,
        bridgePool: null
    },
    onLoad: function onLoad() {
        this.bridgePool = new cc.NodePool();
        for (var i = 0; i < 5; i++) {
            var bridgeUnit = cc.instantiate(this.bridgePrefab);
            this.bridgePool.put(bridgeUnit);
        }
        this.node.active = false;
    },
    start: function start() {},

    configInit: function configInit() {
        this.node.rotation = 0;
    },
    gameInit: function gameInit() {
        this.node.rotation = 0;
        this.node.opacity = 255;
    },

    buildBridge: function buildBridge() {
        var bridgeUnit;
        if (this.bridgePool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            bridgeUnit = this.bridgePool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bridgeUnit = cc.instantiate(this.bridgePrefab);
        }
        bridgeUnit.parent = this.node;
        bridgeUnit.setPosition(cc.v2(-25, this.bridgeY));
        this.bridgeY += 90;
    },
    reSetBridge: function reSetBridge() {
        var _this = this;
        this.timer = 0;
        this.bridgeY = 0;
        console.log(this.node.children.length);
        if (this.node.children.length > 0) {
            for (var i = 0; i < this.node.children.length; i++) {
                this.bridgePool.put(this.node.children[i--]);
            }
        }
        this.buildBridge();
    },
    setBridge: function setBridge(x) {
        this.reSetBridge();
        this.node.setPosition(cc.v2(x, -305));
        this.configInit();
    },
    update: function update(dt) {
        if (!_gameDataManager2.default.isGameOver) {
            if (_gameDataManager2.default.isLengthen) {
                this.timer++;
                if (this.timer % 30 == 0) {
                    this.buildBridge();
                }
            }
            if (_gameDataManager2.default.isMove) {
                this.timer = 0;
                this.node.x -= _gameConfig2.default.gameMoveSpeed;
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
        //# sourceMappingURL=bridge.js.map
        