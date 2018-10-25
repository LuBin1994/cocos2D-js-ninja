(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/utils/util.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '21692qGB49Md4FD07gHVTu1', 'util', __filename);
// script/utils/util.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gameDataManager = require('../gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

var _gameConfig = require('../gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

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
        _gameDataManager2.default.isHideSub = false;
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
        _gameDataManager2.default.isHideSub = false;
    },

    /**
     * 返回随机数，范围 0~multiple的整数
     * @param multiple 随机数上限
     */
    randomNum: function randomNum(multiple) {
        return Math.floor(Math.random() * multiple);
    },

    /**
     * 游戏难度设置
     * @param num 游戏难度等级
     */
    setGameDifficulty: function setGameDifficulty(num) {
        switch (num) {
            case 1:
                _gameConfig2.default.MaxMultiProbability = 0.2;
                _gameConfig2.default.sharkJumpDurTime = 40;
                break;
            case 2:
                _gameConfig2.default.MaxMultiProbability = 0.25;
                _gameConfig2.default.sharkJumpDurTime = 37;
                break;
            case 3:
                _gameConfig2.default.MaxMultiProbability = 0.3;
                _gameConfig2.default.sharkJumpDurTime = 34;
                break;
            case 4:
                _gameConfig2.default.MaxMultiProbability = 0.35;
                _gameConfig2.default.sharkJumpDurTime = 31;
                break;
            case 5:
                _gameConfig2.default.MaxMultiProbability = 0.4;
                _gameConfig2.default.sharkJumpDurTime = 28;
                break;
            case 6:
                _gameConfig2.default.MaxMultiProbability = 0.5;
                _gameConfig2.default.sharkJumpDurTime = 25;
                break;
            case 7:
                _gameConfig2.default.MaxMultiProbability = 0.6;
                _gameConfig2.default.sharkJumpDurTime = 22;
                break;
            case 8:
                _gameConfig2.default.MaxMultiProbability = 0.7;
                _gameConfig2.default.sharkJumpDurTime = 19;
                break;
            case 9:
                _gameConfig2.default.MaxMultiProbability = 0.8;
                _gameConfig2.default.sharkJumpDurTime = 16;
                break;
            case 10:
                _gameConfig2.default.MaxMultiProbability = 0.9;
                _gameConfig2.default.sharkJumpDurTime = 13;
                break;
        }
    },

    /**
     * 游戏日志
     * @param logLevel 日志等级
     * @param logRemark 日志备注
     */
    gameLog: function gameLog(logLevel, logRemark) {
        wx.request({
            url: _gameConfig2.default.LOG_URL + 'submit',
            data: {
                'code': 2,
                'env': 2,
                'content': _gameConfig2.default.config,
                'level': logLevel,
                'remark': logRemark
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'sessionId': 'SESSION=' + wx.getStorageSync('sessionId')
            },
            method: "POST",
            seccuss: function seccuss(res) {
                console.log('日志接口访问成功');
                console.log(res.data);
                if (res.data.status) {
                    console.log('日志提交成功');
                } else {
                    console.log(res.data.info);
                }
            }
        });
    }
};
exports.default = Util;
module.exports = exports['default'];

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
        //# sourceMappingURL=util.js.map
        