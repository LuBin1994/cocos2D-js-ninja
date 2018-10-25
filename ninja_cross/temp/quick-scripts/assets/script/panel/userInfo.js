(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/panel/userInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cbf0bCBr4ZKN7+pR1Gx5PMo', 'userInfo', __filename);
// script/panel/userInfo.js

'use strict';

var _gameConfig = require('../gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        nickName: cc.Label,
        avatar: cc.Sprite
    },
    onLoad: function onLoad() {
        this.node.active = false;
        try {
            this.getUserInfo();
        } catch (e) {
            _util2.default.gameLog(1, '用户授权模块错误');
        }
    },
    start: function start() {},

    //授权
    getUserInfo: function getUserInfo() {
        var _this = this;
        if (_gameConfig2.default.IS_WX) {
            //获取用户系统信息
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
            if (_gameConfig2.default.IS_AUTHORIZE == false) {
                wx.getSetting({
                    success: function success(res) {
                        //已经授权
                        if (res.authSetting['scope.userInfo']) {
                            _this.node.active = true;
                            _gameConfig2.default.IS_AUTHORIZE = true;
                            wx.login({
                                success: function success(res) {
                                    _gameConfig2.default.code = res.code;
                                    //登陆服务器
                                    _this.login();
                                }
                            });
                            //获取用户信息
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
                        //未授权
                        else {
                                //获取手机信息
                                wx.getSystemInfo({
                                    success: function success(res) {
                                        var width = res.screenWidth;
                                        var height = res.screenHeight;
                                        console.log(width, height);
                                        if (_gameConfig2.default.auths_Btn == null) {
                                            _gameConfig2.default.auths_Btn = wx.createUserInfoButton({
                                                type: 'image',
                                                image: 'https://st.gwold.com/wfclb/ninja/pic/authorBtn.png',
                                                style: {
                                                    left: width / 2 - 40 - Math.floor(250 * width / 750),
                                                    top: height / 2 - 40 - Math.floor(500 * height / 1206),
                                                    width: 80,
                                                    height: 80
                                                }
                                            });
                                        }
                                        _gameConfig2.default.auths_Btn.onTap(function (res1) {
                                            wx.getSetting({
                                                success: function success(auths) {
                                                    if (auths.authSetting["scope.userInfo"]) {
                                                        console.log("==已经授权===");
                                                        _gameConfig2.default.IS_AUTHORIZE = true;
                                                        _gameConfig2.default.auths_Btn.hide();
                                                        _this.node.active = true;
                                                        wx.login({
                                                            success: function success(res2) {
                                                                _gameConfig2.default.code = res2.code;
                                                                //登陆服务器
                                                                wx.request({
                                                                    url: _gameConfig2.default.INTER_URL + "login",
                                                                    data: {
                                                                        'code': _gameConfig2.default.code
                                                                    },
                                                                    method: "POST",
                                                                    header: {
                                                                        'content-type': 'application/x-www-form-urlencoded'
                                                                    },
                                                                    success: function success(res) {
                                                                        console.log(res.data);
                                                                        if (res.data.status == 1) {
                                                                            console.log("登陆成功");
                                                                            wx.setStorageSync('sessionId', res.data.data.sessionId);
                                                                            wx.setStorageSync('shareCode', res.data.data.shareCode);
                                                                            //将用户信息传至开发者服务器
                                                                            _this.sendUserInfo();
                                                                        } else {
                                                                            switch (res.data.code) {
                                                                                case 1006:
                                                                                    console.log("登录操作失败");
                                                                                    break;
                                                                                case 1005:
                                                                                    console.log("登录参数错误");
                                                                                    break;
                                                                            }
                                                                        }
                                                                    },
                                                                    error: function error() {
                                                                        console.log("连接错误");
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        console.log("==拒绝授权===");
                                                    }
                                                }
                                            });
                                        });
                                        _gameConfig2.default.auths_Btn.show();
                                    }
                                });
                            }
                    },
                    fail: function fail() {
                        console.log("调用接口失败");
                    }
                });
            } else {
                this.node.active = true;
                if (_gameConfig2.default.auths_Btn) {
                    _gameConfig2.default.auths_Btn.hide();
                }
                this.nickName.string = _gameConfig2.default.nickName;
                cc.loader.load(_gameConfig2.default.avatarUrl, function (err, texture) {
                    var sprite = new cc.SpriteFrame(texture);
                    _this.avatar.spriteFrame = sprite;
                });
            }
        }
    },

    //开发者服务器登录
    login: function login() {
        var _this = this;
        wx.request({
            url: _gameConfig2.default.INTER_URL + "login",
            data: {
                'code': _gameConfig2.default.code
            },
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function success(res) {
                console.log(res.data);
                if (res.data.status == 1) {
                    console.log("登陆成功");
                    wx.setStorageSync('sessionId', res.data.data.sessionId);
                    wx.setStorageSync('shareCode', res.data.data.shareCode);
                } else {
                    switch (res.data.code) {
                        case 1006:
                            console.log("登录操作失败");
                            break;
                        case 1005:
                            console.log("登录参数错误");
                            break;
                    }
                }
            },
            error: function error() {
                console.log("连接错误");
            }
        });
    },

    //发送用户信息
    sendUserInfo: function sendUserInfo() {
        var _this = this;
        //获取用户信息
        wx.getUserInfo({
            success: function success(res) {
                _gameConfig2.default.nickName = res.userInfo.nickName;
                _gameConfig2.default.avatarUrl = res.userInfo.avatarUrl + '?aaa=aa.jpg';
                _gameConfig2.default.country = res.userInfo.country;
                _gameConfig2.default.province = res.userInfo.province;
                _gameConfig2.default.city = res.userInfo.city;
                _gameConfig2.default.sex = res.userInfo.gender;
                _this.nickName.string = res.userInfo.nickName;
                cc.loader.load(_gameConfig2.default.avatarUrl, function (err, texture) {
                    var sprite = new cc.SpriteFrame(texture);
                    _this.avatar.spriteFrame = sprite;
                });
                //将用户信息传至开发者服务器
                wx.request({
                    url: _gameConfig2.default.INTER_URL + "info",
                    data: {
                        'nickName': _gameConfig2.default.nickName,
                        'headImg': _gameConfig2.default.avatarUrl,
                        'country': _gameConfig2.default.country,
                        'province': _gameConfig2.default.province,
                        'city': _gameConfig2.default.city,
                        'sex': _gameConfig2.default.sex
                    },
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                    },
                    success: function success(res) {
                        console.log(res.data);
                        if (res.data.status == 1) {
                            console.log("用户信息传送成功");
                        } else {
                            switch (res.data.code) {
                                case 1006:
                                    console.log("用户信息传送操作失败");
                                case 1005:
                                    console.log("用户信息传送参数错误");
                            }
                        }
                    },
                    error: function error() {
                        console.log("连接出现错误");
                    }
                });
            }
        });
    }
}
//获取分享信息
);

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
        //# sourceMappingURL=userInfo.js.map
        