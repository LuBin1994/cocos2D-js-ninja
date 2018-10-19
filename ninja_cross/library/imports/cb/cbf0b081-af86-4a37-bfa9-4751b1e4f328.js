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
        this.node.active = false;
        this.getUserInfoNew();
    },
    start: function start() {},

    //新版授权
    getUserInfoNew: function getUserInfoNew() {
        var _this = this;
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
                                /* wx.request({
                                     method:"post",
                                     url:GameConfig.INTER_URL+"/game/login",
                                     data:{
                                         code:GameConfig.code
                                     }
                                     datatype:'json',
                                     success:function (res) {
                                         if(res.status == 1){
                                             console.log("登陆成功")
                                         else{
                                             switch(res.code){
                                                 case 1006:
                                                     console.log("操作失败")
                                             }
                                         }
                                     },
                                     error:function () {
                                         console.log("连接错误")
                                     }
                                 })*/
                            },
                            fail: function fail() {
                                console.log("调用接口失败");
                            }
                        });
                        //调用 getUserInfo 获取头像昵称
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
                            //判断用户是否做过授权操作
                            if (!_gameConfig2.default.IS_AUTHS_OPE) {
                                //获取手机信息
                                wx.getSystemInfo({
                                    success: function success(res) {
                                        var width = res.screenWidth;
                                        var height = res.screenHeight;
                                        console.log(width, height);
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
                                        _gameConfig2.default.auths_Btn.onTap(function (res1) {
                                            wx.getSetting({
                                                success: function success(auths) {
                                                    _gameConfig2.default.IS_AUTHS_OPE = !_gameConfig2.default.IS_AUTHS_OPE;
                                                    if (auths.authSetting["scope.userInfo"]) {
                                                        console.log("==已经授权===");
                                                        _gameConfig2.default.IS_AUTHORIZE = true;
                                                        _gameConfig2.default.auths_Btn.hide();
                                                        wx.login({
                                                            success: function success(res2) {
                                                                //获得个人信息
                                                                _gameConfig2.default.code = res2.code;
                                                                /* wx.request({
                                                                     method:"post",
                                                                     url:GameConfig.INTER_URL+"/game/login",
                                                                     data:{
                                                                         code:GameConfig.code
                                                                     }
                                                                     datatype:'json',
                                                                     success:function (res) {
                                                                         if(res.status == 1){
                                                                             console.log("登陆成功")
                                                                         else{
                                                                                 switch(res.code){
                                                                                     case 1006:
                                                                                         console.log("操作失败")
                                                                                 }
                                                                             }
                                                                         },
                                                                         error:function () {
                                                                             console.log("连接错误")
                                                                         }
                                                                     })*/
                                                                wx.getUserInfo({
                                                                    withCredentials: true,
                                                                    lang: 'zh_CN',
                                                                    success: function success(res3) {
                                                                        _gameConfig2.default.nickName = res3.userInfo.nickName;
                                                                        _gameConfig2.default.avatarUrl = res3.userInfo.avatarUrl + '?aaa=aa.jpg';
                                                                        _this.nickName.string = res3.userInfo.nickName;
                                                                        cc.loader.load(_gameConfig2.default.avatarUrl, function (err, texture) {
                                                                            var sprite = new cc.SpriteFrame(texture);
                                                                            _this.avatar.spriteFrame = sprite;
                                                                        });
                                                                    },
                                                                    fail: function fail() {
                                                                        console.log("login:获取自己的信息失败");
                                                                    }
                                                                });
                                                                _this.node.active = true;
                                                            }
                                                        });
                                                    } else {
                                                        console.log("==拒绝授权===");
                                                        _gameConfig2.default.auths_Btn.hide();
                                                        _this.node.active = false;
                                                    }
                                                }
                                            });
                                        });
                                        _gameConfig2.default.auths_Btn.show();
                                    }
                                });
                            }
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
});

cc._RF.pop();