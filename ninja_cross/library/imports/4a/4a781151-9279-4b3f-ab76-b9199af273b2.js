"use strict";
cc._RF.push(module, '4a781FRknlLP6t2uRma8nOy', 'start');
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
        prefab: [cc.Prefab],
        btnSound: {
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad: function onLoad() {
        this.init();
        if (_gameConfig2.default.IS_WX) {
            wx.showShareMenu(); //显示转发按钮
            this.getShareConfig();
            this.getUserSystemInfo();
            this.getOtherShareCode();
        }
    },
    start: function start() {
        cc.director.preloadScene("game", function () {
            console.log("游戏场景已加载");
        });
        this.tex = new cc.Texture2D();
        this.modeBounce(this.startBtn);
    },

    init: function init() {
        var _this = this;
        //头像预制
        if (_gameConfig2.default.IS_WX) {
            _GameUITools2.default.initPrefab(this.prefab[1]);
        }
        //音乐
        _GameUITools2.default.initPrefab(this.prefab[0]);
        //更多游戏
        _GameUITools2.default.initPrefab(this.prefab[2]);
        //开始游戏
        _util2.default.btnEvent(this.startBtn, this.btnSound, function () {
            _GameUITools2.default.loadingScene("game");
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
    },
    //获取分享信息
    getShareConfig: function getShareConfig() {
        var _this = this;
        wx.request({
            url: _gameConfig2.default.INTER_URL + "game/getConfig",
            method: "GET",
            success: function success(res) {
                console.log("获取分享信息返回值：", res.data);
                if (res.data.status == 1) {
                    _gameConfig2.default.config = res.data.data;
                    if (!_gameConfig2.default.haveSetMode) {
                        _gameDataManager2.default.toolChoose = parseInt(res.data.data.defaultModel) - 1;
                        _gameConfig2.default.haveSetMode = true;
                    }
                    var gameDifficultyNum = parseInt(_gameConfig2.default.config.difficulty);
                    //设置游戏难度
                    _util2.default.setGameDifficulty(gameDifficultyNum);
                    //用户点击了右上角“转发”按钮
                    wx.onShareAppMessage(function (res) {
                        return {
                            title: _gameConfig2.default.config.shareTitle,
                            imageUrl: _gameConfig2.default.config.shareImg,
                            query: "shareCode=" + wx.getStorageSync('shareCode')
                        };
                    });
                } else {
                    _util2.default.gameLog(res.data.info);
                }
            }
        });
    },

    //获取用户系统信息
    getUserSystemInfo: function getUserSystemInfo() {
        wx.getSystemInfo({
            success: function success(res) {
                _gameConfig2.default.systemInfo.system = res.system;
                _gameConfig2.default.systemInfo.brand = res.brand;
                _gameConfig2.default.systemInfo.model = res.model;
                _gameConfig2.default.systemInfo.pixelRatio = res.pixelRatio;
                _gameConfig2.default.systemInfo.screenWidth = res.screenWidth;
                _gameConfig2.default.systemInfo.screenHeight = res.screenHeight;
                _gameConfig2.default.systemInfo.version = res.version;
                _gameConfig2.default.systemInfo.platform = res.platform;
                _gameConfig2.default.systemInfo.SDKVersion = res.SDKVersion;
                _gameConfig2.default.systemInfo.screenWidth = res.screenWidth;
                _gameConfig2.default.systemInfo.benchmarkLevel = res.benchmarkLevel;
            }
        });
    },

    //获取由他人分享的shareCode
    getOtherShareCode: function getOtherShareCode() {
        var res = wx.getLaunchOptionsSync();
        console.log("返回小程序启动参数", res);
        if (res.query.shareCode) {
            _gameConfig2.default.enterShareConfig.enterShareCode = res.query.shareCode;
            _gameConfig2.default.enterShareConfig.path = res.path;
        }
    },
    modeBounce: function modeBounce(node) {
        var scale1 = cc.scaleTo(0.5, 0.9);
        var scale2 = cc.scaleTo(0.5, 1);
        var ani = cc.sequence(scale1, scale2);
        var ani1 = cc.repeatForever(ani);
        node.runAction(ani1);
    }
});

cc._RF.pop();