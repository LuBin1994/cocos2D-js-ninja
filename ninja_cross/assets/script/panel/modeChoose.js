import Util from '../utils/util';
import GameUITools from '../utils/GameUITools';
import GameDataManager from '../gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        stickMode:cc.Node,
        bridgeMode:cc.Node,
        jumpMode:cc.Node,
        modeChooseShow:[cc.Node],
        btnSound:{
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad (){
        this.init();
        this.showChoose();
    },
    init(){
        var _this = this;
        this.modeEvent(this.stickMode,this.btnSound,function () {
            GameDataManager.toolChoose = 0;
        })
        this.modeEvent(this.bridgeMode,this.btnSound,function () {
            GameDataManager.toolChoose = 1;
        })
        this.modeEvent(this.jumpMode,this.btnSound,function () {
            GameDataManager.toolChoose = 2;
        })
    },
    showChoose(){
        for(var i=0;i<3;i++){
            this.modeChooseShow[i].active = false
        }
        this.modeChooseShow[GameDataManager.toolChoose].active = true
    },
    modeEvent(node,btnSound,callbacks){
        var _this = this;
        Util.modeBtnEvent(node,btnSound,function(){
            _this.showChoose();
            if(localStorage.getItem('modeGuide')){
                GameUITools.loadingScene("game");
            }
            else{
                GameUITools.unLoadingLayer(_this.node);
                localStorage.setItem('modeGuide',true)
            }
            callbacks && callbacks()
        });
    }
});
