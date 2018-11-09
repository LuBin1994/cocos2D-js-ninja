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
            if (_gameDataManager2.default.canSoundPlay) {
                cc.audioEngine.playEffect(btnSound, false, 1);
            }
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
            if (_gameDataManager2.default.canSoundPlay) {
                cc.audioEngine.playEffect(btnSound, false, 1);
            }
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
        _gameConfig2.default.MaxMultiProbability = 0.13 + 0.7 * num;
        _gameConfig2.default.sharkJumpDurTime = 40 - 3 * num;
    },

    /**
     * 游戏日志
     * @param error 内容
     */
    gameLog: function gameLog(error) {
        var str = error;
        wx.request({
            url: _gameConfig2.default.LOG_URL + 'submit',
            data: {
                'code': 2,
                'env': _gameConfig2.default.env,
                'content': str,
                'system': _gameConfig2.default.systemInfo.system,
                'brand': _gameConfig2.default.systemInfo.brand,
                'model': _gameConfig2.default.systemInfo.model,
                'pixelRatio': _gameConfig2.default.systemInfo.pixelRatio,
                'screenWidth': _gameConfig2.default.systemInfo.screenWidth,
                'screenHeight': _gameConfig2.default.systemInfo.screenHeight,
                'version': _gameConfig2.default.systemInfo.version,
                'platform': _gameConfig2.default.systemInfo.platform,
                'sdkVersion': _gameConfig2.default.systemInfo.sdkVersion,
                'benchmarkLevel': _gameConfig2.default.systemInfo.benchmarkLevel
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'sessionId': 'SESSION=' + wx.getStorageSync('sessionId')
            },
            method: "POST",
            seccuss: function seccuss(res) {
                if (res.data.status) {
                    console.log('日志提交成功');
                } else {
                    console.log(res.data.info);
                }
            }
        });
    },

    /**
     * 得分计算
     * @param toolLength 道具长度
     * @param distance 站桩距离
     */
    culculateScore: function culculateScore(node, toolLength, distance) {
        var scoreInterval; //得分区间
        var num = parseInt(node.name.replace(/[^0-9]/ig, ""));
        var centerDistance = Math.floor(Math.abs(toolLength - (distance + node.width / 2))); //道具顶点与下个站桩中心的距离
        if (num <= 3) {
            scoreInterval = Math.floor(node.width / 9);
            if (0 <= centerDistance && centerDistance <= 0.5 * scoreInterval) {
                _gameDataManager2.default.nextScore = 5;
                _gameDataManager2.default.addScoreGrade = 3;
            } else if (0.5 * scoreInterval < centerDistance && centerDistance <= 1.5 * scoreInterval) {
                _gameDataManager2.default.nextScore = 4;
                _gameDataManager2.default.addScoreGrade = 2;
            } else if (1.5 * scoreInterval < centerDistance && centerDistance <= 2.5 * scoreInterval) {
                _gameDataManager2.default.nextScore = 3;
                _gameDataManager2.default.addScoreGrade = 2;
            } else if (2.5 * scoreInterval < centerDistance && centerDistance <= 3.5 * scoreInterval) {
                _gameDataManager2.default.nextScore = 2;
                _gameDataManager2.default.addScoreGrade = 1;
            } else if (3.5 * scoreInterval < centerDistance && centerDistance <= 4.5 * scoreInterval) {
                _gameDataManager2.default.nextScore = 1;
                _gameDataManager2.default.addScoreGrade = 1;
            }
        } else {
            switch (num) {
                case 4:
                    scoreInterval = Math.floor(node.width / 7);
                    if (0 < centerDistance && centerDistance <= 0.5 * scoreInterval) {
                        _gameDataManager2.default.nextScore = 6;
                        _gameDataManager2.default.addScoreGrade = 3;
                    } else if (0.5 * scoreInterval < centerDistance && centerDistance <= 1.5 * scoreInterval) {
                        _gameDataManager2.default.nextScore = 5;
                        _gameDataManager2.default.addScoreGrade = 2;
                    } else if (1.5 * scoreInterval < centerDistance && centerDistance <= 2.5 * scoreInterval) {
                        _gameDataManager2.default.nextScore = 3;
                        _gameDataManager2.default.addScoreGrade = 2;
                    } else if (2.5 * scoreInterval < centerDistance && centerDistance <= 3.5 * scoreInterval) {
                        _gameDataManager2.default.nextScore = 1;
                        _gameDataManager2.default.addScoreGrade = 1;
                    }
                    break;
                case 5:
                    scoreInterval = Math.floor(node.width / 5);
                    if (0 < centerDistance && centerDistance <= 0.5 * scoreInterval) {
                        _gameDataManager2.default.nextScore = 7;
                        _gameDataManager2.default.addScoreGrade = 3;
                    } else if (0.5 * scoreInterval < centerDistance && centerDistance <= 1.5 * scoreInterval) {
                        _gameDataManager2.default.nextScore = 4;
                        _gameDataManager2.default.addScoreGrade = 2;
                    } else if (1.5 * scoreInterval < centerDistance && centerDistance <= 2.5 * scoreInterval) {
                        _gameDataManager2.default.nextScore = 2;
                        _gameDataManager2.default.addScoreGrade = 1;
                    }
                    break;
                case 6:
                    scoreInterval = Math.floor(node.width / 3);
                    if (0 < centerDistance && centerDistance <= 0.5 * scoreInterval) {
                        _gameDataManager2.default.nextScore = 8;
                        _gameDataManager2.default.addScoreGrade = 3;
                    } else if (0.5 * scoreInterval < centerDistance && centerDistance <= 1.5 * scoreInterval) {
                        _gameDataManager2.default.nextScore = 4;
                        _gameDataManager2.default.addScoreGrade = 2;
                    }
                    break;
            }
        }
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
        