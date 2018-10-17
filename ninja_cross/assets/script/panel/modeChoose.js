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
    onLoad () {
        this.init();
        this.showChoose();
    },
    init(){
        var _this = this;
        Util.modeBtnEvent(this.stickMode,this.btnSound,function(){
            GameDataManager.toolChoose = 0;
            GameUITools.unLoadingLayer(_this.node);
            _this.showChoose();
        });

        Util.modeBtnEvent(this.bridgeMode,this.btnSound,function(){
            GameDataManager.toolChoose = 1;
            GameUITools.unLoadingLayer(_this.node);
            _this.showChoose();
        });

        Util.modeBtnEvent(this.jumpMode,this.btnSound,function(){
            GameDataManager.toolChoose = 2;
            GameUITools.unLoadingLayer(_this.node);
            _this.showChoose();
        });
    },
    showChoose(){
        for(var i=0;i<3;i++){
            this.modeChooseShow[i].active = false
        }
        this.modeChooseShow[GameDataManager.toolChoose].active = true
    },
    start (){},
    update (dt) {},
});
