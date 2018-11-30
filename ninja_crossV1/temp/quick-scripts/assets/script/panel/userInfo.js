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
        var _this = this;
        this.node.active = false;
        this.login();
    },

    //未登陆处理
    unLoginedSetting: function unLoginedSetting() {
        var _this = this;
        if (_gameConfig2.default.IS_AUTHORIZE == false) {
            wx.getSetting({
                success: function success(res) {
                    //已经授权
                    if (res.authSetting['scope.userInfo']) {
                        console.log('==已获得登录权限==');
                        _this.node.active = true;
                        _gameConfig2.default.IS_AUTHORIZE = true;
                        _this.loginWithWxAuthorize();
                        //获取用户信息,显示头像
                        wx.getUserInfo({
                            success: function success(res) {
                                _gameConfig2.default.userInfo.nickName = res.userInfo.nickName;
                                _gameConfig2.default.userInfo.avatarUrl = res.userInfo.avatarUrl + '?aaa=aa.jpg';
                                _this.nickName.string = res.userInfo.nickName;
                                cc.loader.load(_gameConfig2.default.userInfo.avatarUrl, function (err, texture) {
                                    var sprite = new cc.SpriteFrame(texture);
                                    _this.avatar.spriteFrame = sprite;
                                });
                            }
                        });
                    }
                    //未授权
                    else {
                            _this.loginWithoutWxAuthorize();
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
                                                left: width / 2 - 30 - Math.floor(250 * width / 750),
                                                top: height / 2 - 30 - Math.floor(500 * height / 1206),
                                                width: 60,
                                                height: 60
                                            }
                                        });
                                        _gameConfig2.default.auths_Btn.onTap(function (res) {
                                            if (res.errMsg == "getUserInfo:ok") {
                                                console.log("==已经授权===");
                                                _gameConfig2.default.IS_AUTHORIZE = true;
                                                _gameConfig2.default.auths_Btn.hide();
                                                var userInfo = cc.director.getScene().children[0].getChildByName("userInfo");
                                                userInfo.active = true;
                                                //将用户信息传至开发者服务器
                                                _this.sendUserInfo();
                                            } else {
                                                console.log("==拒绝授权===");
                                            }
                                        });
                                    }
                                }
                            });
                        }
                },
                fail: function fail() {
                    _util2.default.gameLog("wx.getSetting调用失败");
                }
            });
        } else {
            console.log("当前已手动授权");
            this.node.active = true;
            if (_gameConfig2.default.auths_Btn) {
                _gameConfig2.default.auths_Btn.hide();
            }
            this.nickName.string = _gameConfig2.default.userInfo.nickName;
            cc.loader.load(_gameConfig2.default.userInfo.avatarUrl, function (err, texture) {
                var sprite = new cc.SpriteFrame(texture);
                _this.avatar.spriteFrame = sprite;
            });
        }
    },

    //已登陆处理
    loginedSetting: function loginedSetting() {
        var _this = this;
        if (_gameConfig2.default.IS_AUTHORIZE == false) {
            wx.getSetting({
                success: function success(res) {
                    //已经授权
                    if (res.authSetting['scope.userInfo']) {
                        console.log('==已获得登录权限==');
                        _this.node.active = true;
                        _gameConfig2.default.IS_AUTHORIZE = true;
                        //获取用户信息,显示头像
                        wx.getUserInfo({
                            success: function success(res) {
                                _gameConfig2.default.userInfo.nickName = res.userInfo.nickName;
                                _gameConfig2.default.userInfo.avatarUrl = res.userInfo.avatarUrl + '?aaa=aa.jpg';
                                _this.nickName.string = res.userInfo.nickName;
                                cc.loader.load(_gameConfig2.default.userInfo.avatarUrl, function (err, texture) {
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
                                                left: width / 2 - 30 - Math.floor(250 * width / 750),
                                                top: height / 2 - 30 - Math.floor(500 * height / 1206),
                                                width: 60,
                                                height: 60
                                            }
                                        });
                                        _gameConfig2.default.auths_Btn.onTap(function (res) {
                                            console.log('授权按钮点击返回值', res);
                                            if (res.errMsg == "getUserInfo:ok") {
                                                console.log("==已经授权===");
                                                _gameConfig2.default.IS_AUTHORIZE = true;
                                                _gameConfig2.default.auths_Btn.hide();
                                                var userInfo = cc.director.getScene().children[0].getChildByName("userInfo");
                                                userInfo.active = true;
                                                //将用户信息传至开发者服务器
                                                _this.sendUserInfo();
                                            } else {
                                                console.log("==拒绝授权===");
                                            }
                                        });
                                    }
                                }
                            });
                        }
                },
                fail: function fail() {}
            });
        } else {
            console.log("当前已手动授权");
            this.node.active = true;
            if (_gameConfig2.default.auths_Btn) {
                _gameConfig2.default.auths_Btn.hide();
            }
            this.nickName.string = _gameConfig2.default.userInfo.nickName;
            cc.loader.load(_gameConfig2.default.userInfo.avatarUrl, function (err, texture) {
                var sprite = new cc.SpriteFrame(texture);
                _this.avatar.spriteFrame = sprite;
            });
        }
    },

    //微信已授权开发者服务器登录
    loginWithWxAuthorize: function loginWithWxAuthorize() {
        console.log("已授权登陆开始");
        var _this = this;
        this.getUserInfo(function () {
            wx.request({
                url: _gameConfig2.default.INTER_URL + "login",
                data: {
                    'code': _gameConfig2.default.userInfo.code,
                    'nickName': _gameConfig2.default.userInfo.nickName,
                    'headImg': _gameConfig2.default.userInfo.avatarUrl,
                    'country': _gameConfig2.default.userInfo.country,
                    'province': _gameConfig2.default.userInfo.province,
                    'city': _gameConfig2.default.userInfo.city,
                    'sex': _gameConfig2.default.userInfo.sex,
                    'shareCode': _gameConfig2.default.enterShareConfig.enterShareCode
                },
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function success(res) {
                    console.log('微信已授权登陆完成后返回值：', res.data);
                    if (res.data.status == 1) {
                        wx.setStorageSync('sessionId', res.data.data.sessionId);
                        wx.setStorageSync('shareCode', res.data.data.shareCode);
                        //更新本地分数
                        if (wx.getStorageSync('gameScore')) {
                            if (res.data.data.bestScore > wx.getStorageSync('gameScore')) {
                                wx.setStorageSync('gameScore', res.data.data.bestScore);
                            }
                        } else {
                            wx.setStorageSync('gameScore', res.data.data.bestScore);
                        }
                    } else {
                        console.log(res.data.info);
                    }
                },
                error: function error() {
                    _util2.default.gameLog("/login接口调用失败");
                }
            });
        });
    },

    //微信未授权开发者服务器登录
    loginWithoutWxAuthorize: function loginWithoutWxAuthorize() {
        console.log("未授权登陆开始");
        var _this = this;
        wx.request({
            url: _gameConfig2.default.INTER_URL + "login",
            data: {
                'code': _gameConfig2.default.userInfo.code,
                'shareCode': _gameConfig2.default.enterShareConfig.enterShareCode
            },
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function success(res) {
                console.log('微信未授权登陆完成后返回值：', res.data);
                if (res.data.status == 1) {
                    wx.setStorageSync('sessionId', res.data.data.sessionId);
                    wx.setStorageSync('shareCode', res.data.data.shareCode);
                    //更新本地分数
                    if (wx.getStorageSync('gameScore')) {
                        if (res.data.data.bestScore > wx.getStorageSync('gameScore')) {
                            wx.setStorageSync('gameScore', res.data.data.bestScore);
                        }
                    } else {
                        wx.setStorageSync('gameScore', res.data.data.bestScore);
                    }
                } else {
                    _util2.default.gameLog(res.data.info);
                }
            },
            error: function error() {
                _util2.default.gameLog("/login接口调用失败");
            }
        });
    },

    //发送用户信息
    sendUserInfo: function sendUserInfo() {
        console.log("将用户信息传送至开发者服务器开始");
        var _this = this;
        var userInfo = cc.director.getScene().children[0].getChildByName("userInfo");
        var nickName = userInfo.getChildByName("nickName").getComponent(cc.Label);
        var avatar = userInfo.getChildByName("mask").getChildByName("avatar").getComponent(cc.Sprite);
        this.getUserInfo(function () {
            nickName.string = _gameConfig2.default.userInfo.nickName;
            cc.loader.load(_gameConfig2.default.userInfo.avatarUrl, function (err, texture) {
                var sprite = new cc.SpriteFrame(texture);
                avatar.spriteFrame = sprite;
            });
            //将用户信息传至开发者服务器
            wx.request({
                url: _gameConfig2.default.INTER_URL + "info",
                data: {
                    'nickName': _gameConfig2.default.userInfo.nickName,
                    'headImg': _gameConfig2.default.userInfo.avatarUrl,
                    'country': _gameConfig2.default.userInfo.country,
                    'province': _gameConfig2.default.userInfo.province,
                    'city': _gameConfig2.default.userInfo.city,
                    'sex': _gameConfig2.default.userInfo.sex
                },
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                },
                success: function success(res) {
                    console.log("用户信息传至开发者服务器返回值", res.data);
                    if (res.data.status == 1) {} else {
                        _util2.default.gameLog(res.data.info);
                    }
                },
                error: function error() {
                    _util2.default.gameLog("/info接口调用失败");
                }
            });
        });
    },

    //获取用户信息
    getUserInfo: function getUserInfo(callBacks) {
        console.log("获取个人信息开始");
        var callback = callBacks;
        wx.getUserInfo({
            success: function success(res) {
                console.log("获取用户信息返回值", res);
                _gameConfig2.default.userInfo.nickName = res.userInfo.nickName;
                _gameConfig2.default.userInfo.avatarUrl = res.userInfo.avatarUrl + '?aaa=aa.jpg';
                _gameConfig2.default.userInfo.country = res.userInfo.country;
                _gameConfig2.default.userInfo.province = res.userInfo.province;
                _gameConfig2.default.userInfo.city = res.userInfo.city;
                _gameConfig2.default.userInfo.sex = res.userInfo.gender;
                if (res.userInfo.gender = '') {
                    _gameConfig2.default.userInfo.sex = -1;
                }
                callback && callback();
            }
        });
    },
    login: function login() {
        var _this = this;
        if (!_gameConfig2.default.haveCheckLogin) {
            wx.checkSession({
                //session_key 未过期
                success: function success() {
                    console.log("session_key未过期");
                    wx.request({
                        url: _gameConfig2.default.INTER_URL + "checkLogin",
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function success(res) {
                            _gameConfig2.default.haveCheckLogin = true;
                            //已登录
                            if (res.data.status == 1 && res.data.data == 1) {
                                console.log("已登陆");
                                _this.loginedSetting();
                            }
                            //未登录
                            else if (res.data.status == 1 && res.data.data == 0) {
                                    console.log("未登陆");
                                    _this.doLogin();
                                }
                        },
                        fail: function fail() {
                            _util2.default.gameLog("checkLogin接口调用失败");
                        }
                    });
                },

                //session_key 已过期
                fail: function fail() {
                    console.log("session_key已过期");
                    _gameConfig2.default.haveCheckLogin = true;
                    _this.doLogin();
                }
            });
        } else {
            this.loginedSetting();
        }
    },
    doLogin: function doLogin() {
        var _this = this;
        wx.login({
            success: function success(res) {
                _gameConfig2.default.userInfo.code = res.code;
                _this.unLoginedSetting();
            }
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
        //# sourceMappingURL=userInfo.js.map
        