import GameConfig from '../gameConfig';
import Util from '../utils/util'
cc.Class({
    extends: cc.Component,
    properties: {
        nickName: cc.Label,
        avatar: cc.Sprite
    },
    onLoad() {
        var _this = this
        this.node.active = false;
        this.login();
    },
    //未登陆处理
    unLoginedSetting(){
        var _this = this
        if (GameConfig.IS_AUTHORIZE == false){
            wx.getSetting({
                success: function (res){
                    //已经授权
                    if (res.authSetting['scope.userInfo']){
                        console.log('==已获得登录权限==')
                        _this.node.active = true;
                        GameConfig.IS_AUTHORIZE = true;
                        _this.loginWithWxAuthorize();
                        //获取用户信息,显示头像
                        wx.getUserInfo({
                            success: function (res){
                                GameConfig.userInfo.nickName = res.userInfo.nickName;
                                GameConfig.userInfo.avatarUrl = res.userInfo.avatarUrl + '?aaa=aa.jpg';
                                _this.nickName.string = res.userInfo.nickName;
                                cc.loader.load(GameConfig.userInfo.avatarUrl, function (err, texture) {
                                    var sprite = new cc.SpriteFrame(texture);
                                    _this.avatar.spriteFrame = sprite;
                                });
                            }
                        })
                    }
                    //未授权
                    else {
                        _this.loginWithoutWxAuthorize();
                        //获取手机信息
                        wx.getSystemInfo({
                            success(res) {
                                var width = res.screenWidth;
                                var height = res.screenHeight;
                                console.log(width, height)
                                if (GameConfig.auths_Btn == null) {
                                    GameConfig.auths_Btn = wx.createUserInfoButton({
                                        type: 'image',
                                        image: 'https://st.gwold.com/wfclb/ninja/pic/authorBtn.png',
                                        style: {
                                            left: width / 2 - 30 - Math.floor(250 * width / 750),
                                            top: height / 2 - 30 - Math.floor(500 * height / 1206),
                                            width: 60,
                                            height: 60
                                        }
                                    });
                                    GameConfig.auths_Btn.onTap((res) => {
                                        if (res.errMsg == "getUserInfo:ok") {
                                            console.log("==已经授权===")
                                            GameConfig.IS_AUTHORIZE = true;
                                            GameConfig.auths_Btn.hide();
                                            var userInfo = cc.director.getScene().children[0].getChildByName("userInfo");
                                            userInfo.active = true
                                            //将用户信息传至开发者服务器
                                            _this.sendUserInfo();
                                        }
                                        else {
                                            console.log("==拒绝授权===")
                                        }
                                    })
                                }
                            }
                        })
                    }
                },
                fail: function () {
                    Util.gameLog("wx.getSetting调用失败")
                }
            })
        }
        else {
            console.log("当前已手动授权")
            this.node.active = true;
            if (GameConfig.auths_Btn) {
                GameConfig.auths_Btn.hide();
            }
            this.nickName.string = GameConfig.userInfo.nickName;
            cc.loader.load(GameConfig.userInfo.avatarUrl, function (err, texture) {
                var sprite = new cc.SpriteFrame(texture);
                _this.avatar.spriteFrame = sprite;
            });
        }
    },
    //已登陆处理
    loginedSetting(){
        var _this = this
        if (GameConfig.IS_AUTHORIZE == false){
            wx.getSetting({
                success: function (res){
                    //已经授权
                    if (res.authSetting['scope.userInfo']){
                        console.log('==已获得登录权限==')
                        _this.node.active = true;
                        GameConfig.IS_AUTHORIZE = true;
                        //获取用户信息,显示头像
                        wx.getUserInfo({
                            success: function (res){
                                GameConfig.userInfo.nickName = res.userInfo.nickName;
                                GameConfig.userInfo.avatarUrl = res.userInfo.avatarUrl + '?aaa=aa.jpg';
                                _this.nickName.string = res.userInfo.nickName;
                                cc.loader.load(GameConfig.userInfo.avatarUrl, function (err, texture){
                                    var sprite = new cc.SpriteFrame(texture);
                                    _this.avatar.spriteFrame = sprite;
                                });
                            }
                        })
                    }
                    //未授权
                    else {
                        //获取手机信息
                        wx.getSystemInfo({
                            success(res) {
                                var width = res.screenWidth;
                                var height = res.screenHeight;
                                console.log(width, height)
                                if (GameConfig.auths_Btn == null) {
                                    GameConfig.auths_Btn = wx.createUserInfoButton({
                                        type: 'image',
                                        image: 'https://st.gwold.com/wfclb/ninja/pic/authorBtn.png',
                                        style: {
                                            left: width / 2 - 30 - Math.floor(250 * width / 750),
                                            top: height / 2 - 30 - Math.floor(500 * height / 1206),
                                            width: 60,
                                            height: 60
                                        }
                                    })
                                    GameConfig.auths_Btn.onTap((res) => {
                                        console.log('授权按钮点击返回值', res)
                                        if (res.errMsg=="getUserInfo:ok") {
                                            console.log("==已经授权===")
                                            GameConfig.IS_AUTHORIZE = true;
                                            GameConfig.auths_Btn.hide();
                                            var userInfo = cc.director.getScene().children[0].getChildByName("userInfo");
                                            userInfo.active = true
                                            //将用户信息传至开发者服务器
                                            _this.sendUserInfo();
                                        }
                                        else {
                                            console.log("==拒绝授权===")
                                        }
                                    })
                                }
                            }
                        })
                    }
                },
                fail: function () {}
            })
        }
        else {
            console.log("当前已手动授权")
            this.node.active = true;
            if (GameConfig.auths_Btn) {
                GameConfig.auths_Btn.hide();
            }
            this.nickName.string = GameConfig.userInfo.nickName;
            cc.loader.load(GameConfig.userInfo.avatarUrl, function (err, texture) {
                var sprite = new cc.SpriteFrame(texture);
                _this.avatar.spriteFrame = sprite;
            });
        }
    },
    //微信已授权开发者服务器登录
    loginWithWxAuthorize(){
        console.log("已授权登陆开始");
        var _this = this;
        this.getUserInfo(function (){
            wx.request({
                url: GameConfig.INTER_URL + "login",
                data: {
                    'code': GameConfig.userInfo.code,
                    'nickName': GameConfig.userInfo.nickName,
                    'headImg': GameConfig.userInfo.avatarUrl,
                    'country': GameConfig.userInfo.country,
                    'province': GameConfig.userInfo.province,
                    'city': GameConfig.userInfo.city,
                    'sex': GameConfig.userInfo.sex,
                    'shareCode': GameConfig.enterShareConfig.enterShareCode
                },
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    console.log('微信已授权登陆完成后返回值：', res.data)
                    if (res.data.status == 1) {
                        wx.setStorageSync('sessionId', res.data.data.sessionId);
                        wx.setStorageSync('shareCode', res.data.data.shareCode);
                        //更新本地分数
                        if (wx.getStorageSync('gameScore')) {
                            if (res.data.data.bestScore > wx.getStorageSync('gameScore')) {
                                wx.setStorageSync('gameScore', res.data.data.bestScore);
                            }
                        }
                        else {
                            wx.setStorageSync('gameScore', res.data.data.bestScore);
                        }
                    }
                    else {
                        console.log(res.data.info)
                    }
                },
                error: function () {
                    Util.gameLog("/login接口调用失败")
                }
            })
        })
    },
    //微信未授权开发者服务器登录
    loginWithoutWxAuthorize(){
        console.log("未授权登陆开始");
        var _this = this;
        wx.request({
            url: GameConfig.INTER_URL + "login",
            data: {
                'code': GameConfig.userInfo.code,
                'shareCode': GameConfig.enterShareConfig.enterShareCode
            },
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log('微信未授权登陆完成后返回值：', res.data)
                if (res.data.status == 1) {
                    wx.setStorageSync('sessionId', res.data.data.sessionId);
                    wx.setStorageSync('shareCode', res.data.data.shareCode)
                    //更新本地分数
                    if (wx.getStorageSync('gameScore')) {
                        if (res.data.data.bestScore > wx.getStorageSync('gameScore')) {
                            wx.setStorageSync('gameScore', res.data.data.bestScore);
                        }
                    }
                    else {
                        wx.setStorageSync('gameScore', res.data.data.bestScore);
                    }
                }
                else {
                    Util.gameLog(res.data.info)
                }
            },
            error: function () {
                Util.gameLog("/login接口调用失败")
            }
        })
    },
    //发送用户信息
    sendUserInfo(){
        console.log("将用户信息传送至开发者服务器开始")
        var _this = this;
        var userInfo = cc.director.getScene().children[0].getChildByName("userInfo");
        var nickName = userInfo.getChildByName("nickName").getComponent(cc.Label);
        var avatar = userInfo.getChildByName("mask").getChildByName("avatar").getComponent(cc.Sprite);
        this.getUserInfo(
            function () {
                nickName.string = GameConfig.userInfo.nickName;
                cc.loader.load(GameConfig.userInfo.avatarUrl, function (err, texture) {
                    var sprite = new cc.SpriteFrame(texture);
                    avatar.spriteFrame = sprite;
                });
                //将用户信息传至开发者服务器
                wx.request({
                    url: GameConfig.INTER_URL + "info",
                    data: {
                        'nickName': GameConfig.userInfo.nickName,
                        'headImg': GameConfig.userInfo.avatarUrl,
                        'country': GameConfig.userInfo.country,
                        'province': GameConfig.userInfo.province,
                        'city': GameConfig.userInfo.city,
                        'sex': GameConfig.userInfo.sex
                    },
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                    },
                    success: function (res) {
                        console.log("用户信息传至开发者服务器返回值", res.data)
                        if (res.data.status == 1){}
                        else {
                            Util.gameLog(res.data.info)
                        }
                    },
                    error: function () {
                        Util.gameLog("/info接口调用失败")
                    }
                })
            })
    },
    //获取用户信息
    getUserInfo(callBacks) {
        console.log("获取个人信息开始")
        var callback = callBacks;
        wx.getUserInfo({
            success: function (res) {
                console.log("获取用户信息返回值", res)
                GameConfig.userInfo.nickName = res.userInfo.nickName;
                GameConfig.userInfo.avatarUrl = res.userInfo.avatarUrl + '?aaa=aa.jpg';
                GameConfig.userInfo.country = res.userInfo.country;
                GameConfig.userInfo.province = res.userInfo.province;
                GameConfig.userInfo.city = res.userInfo.city;
                GameConfig.userInfo.sex = res.userInfo.gender;
                if (res.userInfo.gender = '') {
                    GameConfig.userInfo.sex = -1
                }
                callback && callback();
            }
        })
    },
    login() {
        var _this = this;
        if (!GameConfig.haveCheckLogin) {
            wx.checkSession({
                //session_key 未过期
                success(){
                    console.log("session_key未过期")
                    wx.request({
                        url: GameConfig.INTER_URL + "checkLogin",
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            GameConfig.haveCheckLogin = true;
                            //已登录
                            if (res.data.status == 1 && res.data.data == 1) {
                                console.log("已登陆")
                                _this.loginedSetting()
                            }
                            //未登录
                            else if (res.data.status == 1 && res.data.data == 0) {
                                console.log("未登陆")
                                _this.doLogin();
                            }
                        },
                        fail: function () {
                            Util.gameLog("checkLogin接口调用失败")
                        }
                    })
                },
                //session_key 已过期
                fail(){
                    console.log("session_key已过期")
                    GameConfig.haveCheckLogin = true;
                    _this.doLogin();
                }
            })
        }
        else {
            this.loginedSetting();
        }
    },
    doLogin(){
        var _this = this;
        wx.login({
            success(res){
                GameConfig.userInfo.code = res.code;
                _this.unLoginedSetting();
            }
        })
    }
});
