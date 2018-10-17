"use strict";
cc._RF.push(module, '21692qGB49Md4FD07gHVTu1', 'util');
// script/utils/util.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gameDataManager = require('../gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Util = {
    /**
     * 普通按钮触摸效果
     * @param NODE 按钮节点
     * @param btnSound 按钮音效
     * @param CALLBACKS touchend回调函数
     */
    btnEvent: function btnEvent(NODE, btnSound, CALLBACKS) {
        NODE.on('touchstart', function () {
            NODE.setScale(0.8);
            cc.audioEngine.playEffect(btnSound, false, 1);
        });
        NODE.on('touchend', function () {
            NODE.setScale(1);
            CALLBACKS && CALLBACKS();
        });
        NODE.on('touchcancel', function () {
            NODE.setScale(1);
            CALLBACKS && CALLBACKS();
        });
    },

    /**
     * 模式选择按钮触摸效果
     * @param NODE 按钮节点
     * @param btnSound 按钮音效
     * @param CALLBACKS touchend回调函数
     */
    modeBtnEvent: function modeBtnEvent(NODE, btnSound, CALLBACKS) {
        NODE.on('touchstart', function () {
            cc.audioEngine.playEffect(btnSound, false, 1);
        });
        NODE.on('touchend', function () {
            CALLBACKS && CALLBACKS();
        });
    },

    /**
     * 游戏开始或重开数据初始化
     */
    gameStartDataInit: function gameStartDataInit() {
        _gameDataManager2.default.totalScore = 0;
        _gameDataManager2.default.isMove = false;
        _gameDataManager2.default.isSuccess = false;
        _gameDataManager2.default.canDrop = false;
        _gameDataManager2.default.move = 0;
        _gameDataManager2.default.isAnimate = false;
        _gameDataManager2.default.isLengthen = false;
        _gameDataManager2.default.isStartLengthen = false;
        _gameDataManager2.default.isGameOver = false;
    },

    /**
     * 本局游戏继续数据初始化
     */
    gameContinueDataInit: function gameContinueDataInit() {
        _gameDataManager2.default.isMove = false;
        _gameDataManager2.default.isSuccess = false;
        _gameDataManager2.default.canDrop = false;
        _gameDataManager2.default.move = 0;
        _gameDataManager2.default.isAnimate = false;
        _gameDataManager2.default.isLengthen = false;
        _gameDataManager2.default.isStartLengthen = false;
        _gameDataManager2.default.isGameOver = false;
    },

    /**
     * 返回随机数，范围 0~multiple的整数
     * @param multiple 随机数上限
     */
    randomNum: function randomNum(multiple) {
        return Math.floor(Math.random() * multiple);
    },

    /**
     * 计算道具所转角度
     * @param multiple 随机数上限
     */
    getAngle: function getAngle(start, end) {
        var diff_x = end.x - start.x,
            diff_y = end.y - start.y;
        return 90 - 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    }
};
exports.default = Util;
module.exports = exports['default'];

cc._RF.pop();