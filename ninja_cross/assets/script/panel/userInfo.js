import GameConfig from '../gameConfig';
cc.Class({
    extends: cc.Component,
    properties: {
        nickName:cc.Label,
        avatar:cc.Sprite
    },
    onLoad () {
        this.node.active = false;
        this.getUserInfoNew();
    },
    start () {},
    //新版授权
    getUserInfoNew(){
        var _this = this;
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
                            fail(){
                                console.log("调用接口失败")
                            }
                        })
                        //调用 getUserInfo 获取头像昵称
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
                        //判断用户是否做过授权操作
                        if(!GameConfig.IS_AUTHS_OPE){
                            //获取手机信息
                            wx.getSystemInfo({
                                success(res){
                                    var width = res.screenWidth;
                                    var height = res.screenHeight;
                                    GameConfig.auths_Btn = wx.createUserInfoButton({
                                        type: 'text',
                                        text: '微信授权',
                                        style: {
                                            left: (width-200)/2,
                                            top: (height-100)/2-40,
                                            width:200,
                                            height: 100,
                                            lineHeight: 100,
                                            backgroundColor: '#05920a',
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 30,
                                            borderRadius: 20
                                        }
                                    })
                                    GameConfig.auths_Btn.onTap((res1) => {
                                        wx.getSetting({
                                            success(auths){
                                                GameConfig.IS_AUTHS_OPE = !GameConfig.IS_AUTHS_OPE
                                                if(auths.authSetting["scope.userInfo"]){
                                                    console.log("==已经授权===")
                                                    GameConfig.IS_AUTHORIZE = true;
                                                    GameConfig.auths_Btn.hide();
                                                    wx.login({
                                                        success(res2){
                                                            //获得个人信息
                                                            GameConfig.code = res2.code
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
                                                                success(res3){
                                                                    GameConfig.nickName = res3.userInfo.nickName;
                                                                    GameConfig.avatarUrl = res3.userInfo.avatarUrl+'?aaa=aa.jpg';
                                                                    _this.nickName.string = res3.userInfo.nickName;
                                                                    cc.loader.load(GameConfig.avatarUrl, function (err, texture) {
                                                                        var sprite  = new cc.SpriteFrame(texture);
                                                                        _this.avatar.spriteFrame = sprite;
                                                                    });
                                                                },
                                                                fail(){
                                                                    console.log("login:获取自己的信息失败");
                                                                }
                                                            })
                                                            _this.node.active = true;
                                                        }
                                                    })
                                                }
                                                else{
                                                    console.log("==拒绝授权===")
                                                    GameConfig.auths_Btn.hide();
                                                    _this.node.active = false;
                                                }
                                            }
                                        })
                                    })
                                    GameConfig.auths_Btn.show()
                                }
                            })
                        }
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
});
