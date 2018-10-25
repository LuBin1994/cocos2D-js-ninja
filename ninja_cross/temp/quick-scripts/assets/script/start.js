(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/start.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4a781FRknlLP6t2uRma8nOy', 'start', __filename);
// script/start.js

'use strict';

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

var _GameUITools = require('./utils/GameUITools');

var _GameUITools2 = _interopRequireDefault(_GameUITools);

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

var _gameConfig = require('./gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        startBtn: cc.Node,
        ruleBtn: cc.Node,
        rankBtn: cc.Node,
        modeChooseBtn: cc.Node,
        btnSound: {
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad: function onLoad() {
        this.init();
        wx.showShareMenu(); //显示转发按钮
        this.getShareConfig();
    },
    getShareConfig: function getShareConfig() {
        var _this = this;
        //获取分享信息
        wx.request({
            url: _gameConfig2.default.INTER_URL + "game/getConfig",
            method: "GET",
            success: function success(res) {
                console.log(res.data);
                if (res.data.status == 1) {
                    _gameConfig2.default.config = res.data.data;
                    console.log(_gameConfig2.default);
                    var gameDifficultyNum = parseInt(_gameConfig2.default.config.difficulty);
                    //设置游戏难度
                    _util2.default.setGameDifficulty(gameDifficultyNum);
                } else {
                    console.log("获取游戏配置信息失败");
                    console.log(res.data.info);
                }
            }
        });
    },
    start: function start() {
        cc.director.preloadScene("game", function () {
            console.log("游戏场景已加载");
        });
        this.tex = new cc.Texture2D();
        _util2.default.gameLog(5, '测试日志接口');
    },

    init: function init() {
        var _this = this;
        _GameUITools2.default.loadingLayer("panel/music");
        if (_gameConfig2.default.IS_WX) {
            _GameUITools2.default.loadingLayer("panel/userInfo");
        }
        //开始游戏
        _util2.default.btnEvent(this.startBtn, this.btnSound, function () {
            _GameUITools2.default.loadingScene("game");
            if (_gameConfig2.default.IS_WX) {
                //游戏开始获取gameId
                wx.request({
                    url: _gameConfig2.default.INTER_URL + "game/start",
                    header: {
                        'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                    },
                    method: "POST",
                    success: function success(res) {
                        console.log(res.data);
                        if (res.data.status == 1) {
                            _gameDataManager2.default.gameId = res.data.data;
                        } else {
                            console.log(res.data.info);
                        }
                    },
                    error: function error() {
                        console.log("请求无响应");
                    }
                });
                _util2.default.gameLog();
            }
            _util2.default.gameLog();
        });
        //弹出规则
        _util2.default.btnEvent(this.ruleBtn, this.btnSound, function () {
            _GameUITools2.default.loadingLayer("panel/rule");
        });
        //弹出排名
        _util2.default.btnEvent(this.rankBtn, this.btnSound, function () {
            _GameUITools2.default.loadingLayer("panel/rank");
        });
        //弹出模式选择
        _util2.default.btnEvent(this.modeChooseBtn, this.btnSound, function () {
            _GameUITools2.default.loadingLayer("panel/modeChoose");
        });
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
        //# sourceMappingURL=start.js.map
        