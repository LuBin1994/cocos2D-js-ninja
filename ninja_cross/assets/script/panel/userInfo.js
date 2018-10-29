import GameConfig from '../gameConfig';
import Util from '../utils/util'
cc.Class({
    extends: cc.Component,
    properties: {
        nickName:cc.Label,
        avatar:cc.Sprite
    },
    onLoad () {
        this.node.active = false;
        try{this.getUserInfo()}
        catch (e) {
            Util.gameLog(1,'用户授权模块错误')
        }
    },
    start () {},
    //授权
    getUserInfo(){
        var _this = this;
        if(GameConfig.IS_WX){
            //获取用户系统信息
            wx.getSystemInfo({
                success (res) {
                    GameConfig.systemInfo.system = res.system;
                    GameConfig.systemInfo.brand = res.brand;
                    GameConfig.systemInfo.model = res.model;
                    GameConfig.systemInfo.pixelRatio = res.pixelRatio;
                    GameConfig.systemInfo.screenWidth = res.screenWidth;
                    GameConfig.systemInfo.screenHeight = res.screenHeight;
                    GameConfig.systemInfo.version = res.version;
                    GameConfig.systemInfo.platform = res.platform;
                    GameConfig.systemInfo.SDKVersion = res.SDKVersion;
                    GameConfig.systemInfo.screenWidth = res.screenWidth;
                    GameConfig.systemInfo.benchmarkLevel = res.benchmarkLevel;
                }
            })
            if(GameConfig.IS_AUTHORIZE == false){
                wx.getSetting({
                    success: function(res){
                        //已经授权
                        if (res.authSetting['scope.userInfo']) {
                            _this.node.active = true;
                            GameConfig.IS_AUTHORIZE = true;
                            wx.login({
                                success(res){
                                    GameConfig.code = res.code;
                                    //登陆服务器
                                    _this.login();
                                }
                            })
                            //获取用户信息
                            wx.getUserInfo({
                                success: function(res){
                                    GameConfig.nickName = res.userInfo.nickName;
                                    GameConfig.avatarUrl = res.userInfo.avatarUrl+'?aaa=aa.jpg';
                                    _this.nickName.string = res.userInfo.nickName;
                                    cc.loader.load(GameConfig.avatarUrl, function (err, texture) {
                                        var sprite  = new cc.SpriteFrame(texture);
                                        _this.avatar.spriteFrame = sprite;
                                    });
                                }
                            })
                        }
                        //未授权
                        else{
                            //获取手机信息
                            wx.getSystemInfo({
                                success(res){
                                    var width = res.screenWidth;
                                    var height = res.screenHeight;
                                    console.log(width,height)
                                    if(GameConfig.auths_Btn == null){
                                        GameConfig.auths_Btn = wx.createUserInfoButton({
                                            type: 'image',
                                            image: 'https://st.gwold.com/wfclb/ninja/pic/authorBtn.png',
                                            style: {
                                                left: width/2-40-Math.floor(250*width/750),
                                                top: height/2-40-Math.floor(500*height/1206),
                                                width:80,
                                                height:80
                                            }
                                        })
                                    }
                                    GameConfig.auths_Btn.onTap((res1) => {
                                        wx.getSetting({
                                            success(auths){
                                                if(auths.authSetting["scope.userInfo"]){
                                                    console.log("==已经授权===")
                                                    GameConfig.IS_AUTHORIZE = true;
                                                    GameConfig.auths_Btn.hide();
                                                    _this.node.active = true;
                                                    wx.login({
                                                        success(res2){
                                                            GameConfig.code = res2.code;
                                                            //登陆服务器
                                                            wx.request({
                                                                url:GameConfig.INTER_URL+"login",
                                                                data:{
                                                                    'code':GameConfig.code
                                                                },
                                                                method:"POST",
                                                                header: {
                                                                    'content-type': 'application/x-www-form-urlencoded'
                                                                },
                                                                success:function (res) {
                                                                    console.log(res.data)
                                                                    if(res.data.status == 1){
                                                                        console.log("登陆成功")
                                                                        wx.setStorageSync('sessionId',res.data.data.sessionId)
                                                                        wx.setStorageSync('shareCode',res.data.data.shareCode)
                                                                        //将用户信息传至开发者服务器
                                                                        _this.sendUserInfo();
                                                                    }
                                                                    else{
                                                                        switch(res.data.code){
                                                                            case 1006:
                                                                                console.log("登录操作失败")
                                                                                break;
                                                                            case 1005:
                                                                                console.log("登录参数错误")
                                                                                break;
                                                                        }
                                                                    }
                                                                },
                                                                error:function () {
                                                                    console.log("连接错误")
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                                else{
                                                    console.log("==拒绝授权===")
                                                }
                                            }
                                        })
                                    })
                                    GameConfig.auths_Btn.show()
                                }
                            })
                        }
                    },
                    fail:function () {
                        console.log("调用接口失败")
                    }
                })
            }
            else{
                this.node.active = true;
                if(GameConfig.auths_Btn){
                    GameConfig.auths_Btn.hide();
                }
                this.nickName.string = GameConfig.nickName;
                cc.loader.load(GameConfig.avatarUrl, function (err, texture) {
                    var sprite  = new cc.SpriteFrame(texture);
                    _this.avatar.spriteFrame = sprite;
                });
            }
        }
    },
    //开发者服务器登录
    login(){
        var _this = this;
        wx.request({
            url:GameConfig.INTER_URL+"login",
            data:{
                'code':GameConfig.code
            },
            method:"POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success:function (res) {
                console.log(res.data)
                if(res.data.status == 1){
                    console.log("登陆成功");
                    wx.setStorageSync('sessionId',res.data.data.sessionId);
                    wx.setStorageSync('shareCode',res.data.data.shareCode)
                }
                else{
                    switch(res.data.code){
                        case 1006:
                            console.log("登录操作失败")
                            break;
                            case 1005:
                                console.log("登录参数错误")
                                break;
                    }
                }
                },
            error:function () {
                console.log("连接错误")
            }
        })
    },
    //发送用户信息
    sendUserInfo(){
        var _this = this;
        //获取用户信息
        wx.getUserInfo({
            success: function(res){
                GameConfig.nickName = res.userInfo.nickName;
                GameConfig.avatarUrl = res.userInfo.avatarUrl+'?aaa=aa.jpg';
                GameConfig.country = res.userInfo.country;
                GameConfig.province = res.userInfo.province;
                GameConfig.city = res.userInfo.city;
                GameConfig.sex = res.userInfo.gender;
                _this.nickName.string = res.userInfo.nickName;
                cc.loader.load(GameConfig.avatarUrl, function (err, texture) {
                    var sprite  = new cc.SpriteFrame(texture);
                    _this.avatar.spriteFrame = sprite;
                });
                //将用户信息传至开发者服务器
                wx.request({
                    url:GameConfig.INTER_URL+"info",
                    data:{
                        'nickName':GameConfig.nickName,
                        'headImg':GameConfig.avatarUrl,
                        'country':GameConfig.country,
                        'province':GameConfig.province,
                        'city':GameConfig.city,
                        'sex':GameConfig.sex
                    },
                    method:"POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Cookie':"SESSION="+wx.getStorageSync('sessionId')
                    },
                    success:function (res){
                        console.log(res.data)
                        if(res.data.status == 1){
                            console.log("用户信息传送成功")
                        }
                        else{
                            switch(res.data.code){
                                case 1006:
                                    console.log("用户信息传送操作失败")
                                case 1005:
                                    console.log("用户信息传送参数错误")
                            }
                        }
                    },
                    error:function () {
                        console.log("连接出现错误")
                    }
                })
            }
        })
    },
    //获取分享信息
});
