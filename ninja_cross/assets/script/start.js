import GameConfig from './gameConfig';
import Util from './utils/util';
import GameUITools from './utils/GameUITools';
import GameDataManager from './gameDataManager'
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
            if(GameConfig.IS_WX){
                /*wx.request({
                    url:GameConfig.INTER_URL+"/game/start",
                    method: "post",
                    datatype:'json',
                    success:function (res) {
                        if(res.status == 1){
                            console.log(res)
                            GameDataManager.gameId = res.data.gameId;
                        }
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
                });*/
            }
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
