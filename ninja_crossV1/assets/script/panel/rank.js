import Util from '../utils/util';
import GameUITools from '../utils/GameUITools';
import GameConfig from '../gameConfig';
import GameDataManager from '../gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        inviteBtn:cc.Node,
        closeBtn:cc.Node,
        btnSound:{
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad(){
        this.init();
        this.inviteBtn.zIndex = 10
    },
    init(){
        var _this = this;
        cc.loader.loadRes("panel/subCanvas", (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                _this.node.addChild(node,5);
            }
        });
        if(GameConfig.IS_WX){
            if (CC_WECHATGAME) {
                this.tex = new cc.Texture2D();
                window.sharedCanvas.width = 750;
                window.sharedCanvas.height = 1206;
                wx.postMessage({
                    messageType: 2, //获取排行榜
                    MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                });
            }
        }
        this.node.on('touchstart',function(e){
            e.stopPropagation();
        });
        if(GameConfig.IS_WX){
            Util.btnEvent(this.closeBtn,this.btnSound,function () {
                if(GameConfig.IS_WX){
                    if(GameConfig.auths_Btn){
                        if(!GameConfig.IS_AUTHORIZE){
                            GameConfig.auths_Btn.show();
                        } 
                        var cur = cc.director.getRunningScene();
                        if(typeof cur == "object" && cur.name == 'game')
                        {
                            if(GameConfig.gameOverBannerAdv){
                                GameConfig.gameOverBannerAdv.show();
                            }
                        }
                    }
                    wx.postMessage({messageType: 3, MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,});
                    console.log(GameDataManager.isHideSub)
                    if(GameDataManager.isHideSub){
                        console.log('关闭排行榜隐藏子域')
                        wx.postMessage({messageType: 5});
                    }
                }
                GameUITools.unLoadingLayer(_this.node);
            })
            Util.btnEvent(this.inviteBtn,this.btnSound,function () {
                wx.shareAppMessage({
                    title:GameConfig.config.shareTitle,
                    imageUrl:GameConfig.config.shareImg,
                    query:"shareCode="+wx.getStorageSync('shareCode')
                });
                wx.request({
                    url:GameConfig.INTER_URL+"game/share",
                    data:{
                        'title': GameConfig.config.shareTitle,
                        'image': GameConfig.config.shareImg,
                        'query': wx.getStorageSync('shareCode')
                    },
                    header:{
                        'content-type': 'application/x-www-form-urlencoded',
                        'Cookie':"SESSION="+wx.getStorageSync('sessionId')
                    },
                    method: "POST",
                    success:function (res){
                        console.log(res.data)
                        if(res.data.status == 1){
                            console.log("游戏分享保存成功")
                        }
                        else{
                            switch(res.data.code){
                                case 1005:
                                    console.log("游戏分享保存参数错误")
                                    break;
                            }
                        }
                    },
                    error:function (){
                        console.log("连接错误")
                    }

                })
            })
        }
    },
    start () {
        this.tex = new cc.Texture2D();
    },
    //获取排行
    // 刷新开放数据域的纹理
    _updateSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.subCanvas = new cc.SpriteFrame(this.tex);
    },
    update () {
        if(GameConfig.IS_WX){
            this._updateSubDomainCanvas();
        }
    }
});