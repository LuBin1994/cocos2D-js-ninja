"use strict";
cc._RF.push(module, 'e7e49tNaqVEI746VGh7yTu0', 'fog');
// script/fog.js

'use strict';

var _gameConfig = require('./gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function onLoad() {},
    start: function start() {
        this.node.opacity = 0;
    },

    /**
     * 显示烟雾
     * @param fogX 烟雾坐标x
     * @param fogY 烟雾坐标y
     */
    showFog: function showFog(fogX, fogY) {
        this.node.opacity = 0;
        this.node.setPosition(cc.v2(fogX, fogY));
        var fadeIn = cc.fadeIn(0.5);
        this.node.runAction(fadeIn);
        _gameDataManager2.default.isShowFog = true;
    },
    hideFog: function hideFog() {
        var fadeOut = cc.fadeOut(1);
        this.node.runAction(fadeOut);
        this.node.opacity = 0;
        _gameDataManager2.default.isShowFog = false;
    },
    update: function update(dt) {
        if (_gameDataManager2.default.isMove) {
            this.node.x -= _gameConfig2.default.gameMoveSpeed;
        }
    }
});

cc._RF.pop();