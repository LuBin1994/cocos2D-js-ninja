"use strict";
cc._RF.push(module, 'cbf0bCBr4ZKN7+pR1Gx5PMo', 'userInfo');
// script/panel/userInfo.js

'use strict';

var _gameConfig = require('../gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        nickName: cc.Label,
        avatar: cc.Sprite
    },
    onLoad: function onLoad() {
        this.getUserInfo();
    },
    start: function start() {},

    //获取微信头像昵称
    getUserInfo: function getUserInfo() {
        var _this = this;
        if (_gameConfig2.default.nickName == null && _gameConfig2.default.avatarUrl == null) {
            wx.authorize({
                scope: "scope.userInfo",
                success: function success() {
                    wx.getSetting({
                        success: function success(res) {
                            if (res.authSetting['scope.userInfo']) {
                                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                                wx.getUserInfo({
                                    success: function success(res) {
                                        _gameConfig2.default.nickName = res.userInfo.nickName;
                                        _gameConfig2.default.avatarUrl = res.userInfo.avatarUrl + '?aaa=aa.jpg';
                                        _this.nickName.string = res.userInfo.nickName;
                                        cc.loader.load(_gameConfig2.default.avatarUrl, function (err, texture) {
                                            var sprite = new cc.SpriteFrame(texture);
                                            _this.avatar.spriteFrame = sprite;
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } else {
            this.nickName.string = _gameConfig2.default.nickName;
            cc.loader.load(_gameConfig2.default.avatarUrl, function (err, texture) {
                var sprite = new cc.SpriteFrame(texture);
                _this.avatar.spriteFrame = sprite;
            });
        }
    }
    // update (dt) {},
});

cc._RF.pop();