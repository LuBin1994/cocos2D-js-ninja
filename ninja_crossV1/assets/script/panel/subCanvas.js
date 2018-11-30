
import GameConfig from '../gameConfig';
cc.Class({
    extends: cc.Component,
    properties: {

    },
    onload(){
        this.init();
    },
    init(){
        var _this = this;
        if(GameConfig.IS_WX){
            if (CC_WECHATGAME) {
                this.tex = new cc.Texture2D();
                window.sharedCanvas.width = 750;
                window.sharedCanvas.height = 1206;
            }
        }
    },
    start () {
        this.tex = new cc.Texture2D();
    },
    // 刷新开放数据域的纹理
    _updateSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.node = new cc.SpriteFrame(this.tex);
    },
    update () {
        if(GameConfig.IS_WX){
            this._updateSubDomainCanvas();
        }
    }
});
