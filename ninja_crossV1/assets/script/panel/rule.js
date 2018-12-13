import Util from '../utils/util';
import GameUITools from '../utils/GameUITools';
import GameConfig from '../gameConfig';
cc.Class({
    extends: cc.Component,
    properties: {
        rules:cc.Node,
        ruleCloseBtn:cc.Node,
        btnSound:{
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad () {
        this.init();
    },
    init(){
        var _this = this;
        Util.btnEvent(this.ruleCloseBtn,this.btnSound,function(){
            if(GameConfig.auths_Btn){
                if(!GameConfig.IS_AUTHORIZE){
                    GameConfig.auths_Btn.show();
                } 
            }
            GameUITools.unLoadingLayer(_this.node);
        });
        this.node.on('touchstart',function(e){
            e.stopPropagation();
        })
    }
});
