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
        },
        completeCount: 0,
        totalCount: 2,
        loadingMask: cc.Node
    },
    onLoad: function onLoad() {
        this.init();
        if (_gameConfig2.default.IS_WX) {
            wx.showShareMenu(); //显示转发按钮
            this.getGameConfig();
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
        if (_gameConfig2.default.IS_WX) {
            //头像预制
            _GameUITools2.default.initPrefab(this.prefab[1]);
            if (_gameConfig2.default.haveLoadData) {
                this.loadingMask.active = false;
            } else {
                this.loadingMask.active = true;
            }
        }
        //音乐
        _GameUITools2.default.initPrefab(this.prefab[0]);
        //更多游戏
        _GameUITools2.default.initPrefab(this.prefab[2]);
        //开始游戏
        _util2.default.btnEvent(this.startBtn, this.btnSound, function () {
            if (_gameDataManager2.default.everydayGameMax != 0) {
                _GameUITools2.default.loadingScene("game");
                _gameDataManager2.default.everydayGameMax--;
                localStorage.setItem('everydayGameMax', _gameDataManager2.default.everydayGameMax);
            } else {
                _util2.default.createVideoAdv('adunit-2a1eec952b1c6e4c', _gameConfig2.default.videoAdv, function () {
                    _GameUITools2.default.loadingScene("game");
                    _gameDataManager2.default.everydayGameMax += _gameConfig2.default.gameIncrease;
                    _gameDataManager2.default.everydayGameMax--;
                    localStorage.setItem('everydayGameMax', _gameDataManager2.default.everydayGameMax);
                });
            }
        });
        //弹出规则
        _util2.default.btnEvent(this.ruleBtn, this.btnSound, function () {
            _GameUITools2.default.loadingLayer("panel/rule");
            if (_gameConfig2.default.auths_Btn) {
                _gameConfig2.default.auths_Btn.hide();
            }
        });
        //弹出排名
        _util2.default.btnEvent(this.rankBtn, this.btnSound, function () {
            if (_gameDataManager2.default.rankMax != 0) {
                _gameDataManager2.default.rankMax--;
                localStorage.setItem('rankMax', _gameDataManager2.default.rankMax);
                _GameUITools2.default.loadingLayer("panel/rank");
                if (_gameConfig2.default.auths_Btn) {
                    _gameConfig2.default.auths_Btn.hide();
                }
            } else {
                _util2.default.createVideoAdv('adunit-9429ed2ecefa9198', _gameConfig2.default.videoAdv, function () {
                    _gameDataManager2.default.rankMax += _gameConfig2.default.rankIncrease;
                    _gameDataManager2.default.rankMax--;
                    localStorage.setItem('rankMax', _gameDataManager2.default.rankMax);
                    _GameUITools2.default.loadingLayer("panel/rank");
                    if (_gameConfig2.default.auths_Btn) {
                        _gameConfig2.default.auths_Btn.hide();
                    }
                });
            }
        });
        //弹出模式选择
        _util2.default.btnEvent(this.modeChooseBtn, this.btnSound, function () {
            if (_gameDataManager2.default.switchModelMax != 0) {
                _GameUITools2.default.loadingLayer("panel/modeChoose");
            } else {
                _util2.default.createVideoAdv('adunit-9429ed2ecefa9198', _gameConfig2.default.videoAdv, function () {
                    _gameDataManager2.default.switchModelMax += _gameConfig2.default.modelIncrease;
                    localStorage.setItem('switchModelMax', _gameDataManager2.default.switchModelMax);
                    _GameUITools2.default.loadingLayer("panel/modeChoose");
                });
            }
        });
        if (!localStorage.getItem('modeGuide')) {
            _GameUITools2.default.loadingLayer("panel/modeChoose");
        }
    },

    //获取信息
    getGameConfig: function getGameConfig() {
        var _this = this;
        if (!_gameConfig2.default.haveGetGameConfig) {
            //获取系统信息
            this.getUserSystemInfo();
            //获取由他人分享的shareCode
            this.getOtherShareCode();
            //从接口获取游戏配置
            wx.request({
                url: _gameConfig2.default.INTER_URL + "game/getConfig",
                method: "GET",
                success: function success(res) {
                    console.log("获取分享信息返回值：", res.data);
                    if (res.data.status == 1) {
                        _gameConfig2.default.config = res.data.data;
                        //设置默认模式
                        _gameDataManager2.default.toolChoose = parseInt(_gameConfig2.default.config.defaultModel) - 1;
                        //设置游戏难度
                        _util2.default.setGameDifficulty(parseInt(_gameConfig2.default.config.difficulty));
                        //设置游戏奖励
                        _gameConfig2.default.everydayGameMax = parseInt(_gameConfig2.default.config.everydayGameMax);
                        _gameConfig2.default.gameIncrease = parseInt(_gameConfig2.default.config.gameIncrease);
                        _gameConfig2.default.switchModelMax = parseInt(_gameConfig2.default.config.switchModelMax);
                        _gameConfig2.default.modelIncrease = parseInt(_gameConfig2.default.config.modelIncrease);
                        _gameConfig2.default.rankMax = parseInt(_gameConfig2.default.config.rankMax);
                        _gameConfig2.default.rankIncrease = parseInt(_gameConfig2.default.config.rankIncrease);
                        //设置每日游戏次数
                        _this.setGametimes();
                        _this.completeCount += 1;
                        console.log('获取游戏配置参数', _this.completeCount, _this.totalCount);
                        _gameConfig2.default.haveGetGameConfig = true;
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
        }
    },

    //获取用户系统信息
    getUserSystemInfo: function getUserSystemInfo() {
        var _this = this;
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
                _this.completeCount += 1;
                console.log('获取用户系统信息', _this.completeCount, _this.totalCount);
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
    },

    //根据日期设置玩家可用次数
    setGametimes: function setGametimes() {
        if (localStorage.getItem('date')) {
            var today = _util2.default.getDate();
            if (!today == localStorage.getItem('date')) {
                localStorage.setItem('date', today);
                localStorage.setItem('everydayGameMax', _gameConfig2.default.everydayGameMax);
                localStorage.setItem('switchModelMax', _gameConfig2.default.switchModelMax);
                localStorage.setItem('rankMax', _gameConfig2.default.rankMax);
                _gameDataManager2.default.everydayGameMax = _gameConfig2.default.everydayGameMax;
                _gameDataManager2.default.rankMax = _gameConfig2.default.rankMax;
                _gameDataManager2.default.switchModelMax = _gameConfig2.default.switchModelMax;
            } else {
                _gameDataManager2.default.everydayGameMax = localStorage.getItem('everydayGameMax');
                _gameDataManager2.default.rankMax = localStorage.getItem('rankMax');
                _gameDataManager2.default.switchModelMax = localStorage.getItem('switchModelMax');
            }
        } else {
            var today = _util2.default.getDate();
            localStorage.setItem('date', today);
            localStorage.setItem('everydayGameMax', _gameConfig2.default.everydayGameMax);
            localStorage.setItem('switchModelMax', _gameConfig2.default.switchModelMax);
            localStorage.setItem('rankMax', _gameConfig2.default.rankMax);
            _gameDataManager2.default.everydayGameMax = _gameConfig2.default.everydayGameMax;
            _gameDataManager2.default.rankMax = _gameConfig2.default.rankMax;
            _gameDataManager2.default.switchModelMax = _gameConfig2.default.switchModelMax;
        }
    },
    update: function update(dt) {
        if (!_gameConfig2.default.haveLoadData) {
            if (this.completeCount == this.totalCount) {
                console.log('已完成加载');
                _gameConfig2.default.haveLoadData = true;
                this.loadingMask.active = false;
            }
        }
    }
});

cc._RF.pop();