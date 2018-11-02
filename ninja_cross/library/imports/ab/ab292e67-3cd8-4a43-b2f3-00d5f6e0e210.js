"use strict";
cc._RF.push(module, 'ab2925nPNhKQ7LzANX24OIQ', 'bridge');
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
        bridgeY: 90,
        timer: 0
    },
    onLoad: function onLoad() {
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
        var _this = this;
        cc.loader.loadRes('tools/bridgeUnit', function (err, prefab) {
            if (!err) {
                var node = cc.instantiate(prefab);
                node.setPosition(cc.v2(-25, _this.bridgeY));
                _this.node.addChild(node);
                _this.bridgeY += 90;
            }
        });
    },
    reSetBridge: function reSetBridge() {
        var _this = this;
        this.timer = 0;
        this.bridgeY = 90;
        this.node.removeAllChildren(true);
        cc.loader.loadRes('tools/bridgeUnit', function (err, prefab) {
            if (!err) {
                var node = cc.instantiate(prefab);
                node.setPosition(cc.v2(-25, 0));
                _this.node.addChild(node);
            }
        });
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