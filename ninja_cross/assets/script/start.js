import GameConfig from './gameConfig';
import Util from './utils/util';
import GameUITools from './utils/GameUITools';
cc.Class({
    extends: cc.Component,
    properties: {
        startBtn:cc.Node,
        ruleBtn:cc.Node,
        rankBtn:cc.Node,
        modeChooseBtn:cc.Node,
        btnSound:{
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad () {
        this.init();
    },
    start (){
        cc.director.preloadScene("game", () => {
           console.log("游戏场景已加载")
        });
        this.tex = new cc.Texture2D();
    },
    init:function(){
        var _this = this;
        GameUITools.loadingLayer("panel/music");
        if(GameConfig.IS_WX){
            GameUITools.loadingLayer("panel/userInfo");
        }
        //开始游戏
        Util.btnEvent(this.startBtn,this.btnSound,function(){
            GameUITools.loadingScene("game");
        });
        //弹出规则
        Util.btnEvent(this.ruleBtn,this.btnSound,function(){
            GameUITools.loadingLayer("panel/rule");
        });
        //弹出排名
        Util.btnEvent(this.rankBtn,this.btnSound,function(){
            GameUITools.loadingLayer("panel/rank");
        });
        //弹出模式选择
        Util.btnEvent(this.modeChooseBtn,this.btnSound,function(){
            GameUITools.loadingLayer("panel/modeChoose")
        });
    }
});
