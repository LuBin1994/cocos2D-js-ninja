"use strict";
cc._RF.push(module, 'ea993OaclZFSYRp26rCz1XM', 'rank');
// script/panel/rank.js

'use strict';

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

var _GameUITools = require('../utils/GameUITools');

var _GameUITools2 = _interopRequireDefault(_GameUITools);

var _gameConfig = require('../gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _gameDataManager = require('../gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        inviteBtn: cc.Node,
        closeBtn: cc.Node,
        btnSound: {
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad: function onLoad() {
        this.init();
        this.inviteBtn.zIndex = 10;
    },
    init: function init() {
        var _this = this;
        cc.loader.loadRes("panel/subCanvas", function (err, prefab) {
            if (!err) {
                var node = cc.instantiate(prefab);
                _this.node.addChild(node, 5);
            }
        });
        if (_gameConfig2.default.IS_WX) {
            if (CC_WECHATGAME) {
                this.tex = new cc.Texture2D();
                window.sharedCanvas.width = 750;
                window.sharedCanvas.height = 1206;
                wx.postMessage({
                    messageType: 2, //获取排行榜
                    MAIN_MENU_NUM: _gameConfig2.default.MAIN_MENU_NUM
                });
            }
        }
        this.node.on('touchstart', function (e) {
            e.stopPropagation();
        });
        if (_gameConfig2.default.IS_WX) {
            _util2.default.btnEvent(this.closeBtn, this.btnSound, function () {
                if (_gameConfig2.default.IS_WX) {
                    wx.postMessage({ messageType: 3, MAIN_MENU_NUM: _gameConfig2.default.MAIN_MENU_NUM });
                    console.log(_gameDataManager2.default.isHideSub);
                    if (_gameDataManager2.default.isHideSub) {
                        console.log('关闭排行榜隐藏子域');
                        wx.postMessage({ messageType: 5 });
                    }
                }
                _GameUITools2.default.unLoadingLayer(_this.node);
            });
            _util2.default.btnEvent(this.inviteBtn, this.btnSound, function () {
                wx.shareAppMessage({
                    title: _gameConfig2.default.config.shareTitle,
                    imageUrl: _gameConfig2.default.config.shareImg,
                    query: "shareCode=" + wx.getStorageSync('shareCode')
                });
                wx.request({
                    url: _gameConfig2.default.INTER_URL + "game/share",
                    data: {
                        'title': _gameConfig2.default.config.shareTitle,
                        'image': _gameConfig2.default.config.shareImg,
                        'query': wx.getStorageSync('shareCode')
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                    },
                    method: "POST",
                    success: function success(res) {
                        console.log(res.data);
                        if (res.data.status == 1) {
                            console.log("游戏分享保存成功");
                        } else {
                            switch (res.data.code) {
                                case 1005:
                                    console.log("游戏分享保存参数错误");
                                    break;
                            }
                        }
                    },
                    error: function error() {
                        console.log("连接错误");
                    }

                });
            });
        }
    },
    start: function start() {
        this.tex = new cc.Texture2D();
    },

    //获取排行
    // 刷新开放数据域的纹理
    _updateSubDomainCanvas: function _updateSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.subCanvas = new cc.SpriteFrame(this.tex);
    },
    update: function update() {
        if (_gameConfig2.default.IS_WX) {
            this._updateSubDomainCanvas();
        }
    }
});

cc._RF.pop();