import GameConfig from '../gameConfig';
cc.Class({
    extends: cc.Component,
    properties: {
        nickName:cc.Label,
        avatar:cc.Sprite
    },
    onLoad () {
        this.getUserInfo();
    },
    start () {},
    //获取微信头像昵称
    getUserInfo:function () {
        var _this = this;
        if(GameConfig.nickName == null && GameConfig.avatarUrl == null){
            wx.authorize({
                scope:"scope.userInfo",
                success:function () {
                    wx.getSetting({
                        success: function(res){
                            if (res.authSetting['scope.userInfo']) {
                                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                                wx.getUserInfo({
                                    success: function(res) {
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
                        }
                    })
                }
            })
        }
        else{
            this.nickName.string = GameConfig.nickName;
            cc.loader.load(GameConfig.avatarUrl, function (err, texture) {
                var sprite  = new cc.SpriteFrame(texture);
                _this.avatar.spriteFrame = sprite;
            });
        }
    },
    // update (dt) {},
});
