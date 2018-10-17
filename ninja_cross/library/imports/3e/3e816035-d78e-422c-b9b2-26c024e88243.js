"use strict";
cc._RF.push(module, '3e816A1145CLLmyJsAk6IJD', 'gameBg');
// script/gameBg.js

'use strict';

var _gameConfig = require('./gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        far_bg: [cc.Node]
    },
    onLoad: function onLoad() {},
    start: function start() {},

    init: function init(game) {
        this.game = game;
    },
    bgMove: function bgMove(bgList, speed) {
        for (var index = 0; index < bgList.length; index++) {
            var element = bgList[index];
            element.x -= speed;
        }
    },
    //检查是否要重置位置
    checkBgReset: function checkBgReset(bgList) {
        var first_xMax = bgList[0].getBoundingBox().xMax;
        if (first_xMax <= -375) {
            var preFirstBg = bgList.shift();
            bgList.push(preFirstBg);
            var curFirstBg = bgList[0];
            preFirstBg.x = 1625;
        }
    },
    update: function update(dt) {
        if (_gameDataManager2.default.isMove) {
            this.bgMove(this.far_bg, _gameConfig2.default.gameBgMoveSpeed);
            this.checkBgReset(this.far_bg);
        }
    }
});

cc._RF.pop();