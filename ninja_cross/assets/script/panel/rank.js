import Util from '../utils/util';
import GameUITools from '../utils/GameUITools';
import GameConfig from '../gameConfig';
import GameDataManager from '../gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        subCanvas:cc.Node,
        closeBtn:cc.Node,
        btnSound:{
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad(){
        this.init();
    },
    init(){
        var _this = this;
        cc.loader.loadRes("panel/subCanvas", (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                _this.node.addChild(node);
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
        Util.btnEvent(this.closeBtn,this.btnSound,function(){
            if(GameConfig.IS_WX){
                wx.postMessage({messageType: 3, MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,});
                console.log(GameDataManager.isHideSub)
                if(GameDataManager.isHideSub){
                    console.log('关闭排行榜隐藏子域')
                    wx.postMessage({messageType: 5});
                }
            }
            GameUITools.unLoadingLayer(_this.node);
        })
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