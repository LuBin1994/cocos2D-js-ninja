import Util from './utils/util' ;
import GameUITools from './utils/GameUITools';
import gameConfig from './gameConfig' ;
import GameDataManager from './GameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        playAgainBtn:cc.Node,
        advBtn:cc.Node,
        goBackHomeBtn:cc.Node,
        rankBtn:cc.Node,
        btnSound:cc.AudioClip,
        bestScore:cc.Label,
        nowScore: cc.Label,
        btnGroup:cc.Node,
        showOffbtn:cc.Node,
    },
    onLoad () {
        var _this = this;
        //btn绑定事件
        cc.loader.loadRes("panel/subCanvas", (err, prefab) => {
            if(!err){
                let node = cc.instantiate(prefab);
                _this.node.addChild(node);
            }
        });
        Util.btnEvent(this.playAgainBtn,this.btnSound,function () {
            gameConfig.canResurrectTime = 1;
            _this.advBtn.active = true;
            _this.game.reStartGame();
            _this.node.active = false
        });
        Util.btnEvent(this.goBackHomeBtn,this.btnSound,function () {
            GameUITools.loadingScene('start');
            gameConfig.canResurrectTime = 1;
        });
        Util.btnEvent(this.rankBtn,this.btnSound,function () {
            GameUITools.loadingLayer("panel/rank")
        });
        Util.btnEvent(this.advBtn,this.btnSound,function () {
            gameConfig.canResurrectTime -= 1;
            _this.game.continueGame();
            _this.node.active = false
        });
        Util.btnEvent(this.showOffbtn,this.btnSound,function () {
            if(gameConfig.IS_WX){
                switch (GameDataManager.toolChoose) {
                    case 0:
                        wx.shareAppMessage({
                            title: '@你,快来超越我吧',
                            imageUrl:"https://st.gwold.com/wfclb/ninja/pic/stickmode.png"
                        });
                        break;
                    case 1:
                        wx.shareAppMessage({
                            title: '@你,快来超越我吧',
                            imageUrl:"https://st.gwold.com/wfclb/ninja/pic/bridgemode.png"
                        });
                        break;
                    case 2:
                        wx.shareAppMessage({
                            title: '@你,快来超越我吧',
                            imageUrl:"https://st.gwold.com/wfclb/ninja/pic/jumpmode.jpg"
                        });
                        break;
                }
            }
        });
    },
    init:function(game){
       this.game = game;
    },
    showScore:function(){
        //分数记录
        if (localStorage.getItem("score")) {
            var score = localStorage.getItem("score");
            this.nowScore.string = "本次分值: " + GameDataManager.totalScore;
            if (GameDataManager.totalScore > score) {
                this.bestScore.string = "历史最佳: " + score;
                localStorage.setItem("score", GameDataManager.totalScore);
            }
            else {
                this.bestScore.string = "历史最佳: " + score;
            }
        }
        else{
            this.nowScore.string = "本次分值: " + GameDataManager.totalScore;
            this.bestScore.string = "历史最佳: " + GameDataManager.totalScore;
            localStorage.setItem("score", GameDataManager.totalScore)
        }
        //微信存储分数
        var gameScore = GameDataManager.totalScore;
        if(gameConfig.IS_WX){
            wx.postMessage({messageType: 1, score: gameScore, MAIN_MENU_NUM: gameConfig.MAIN_MENU_NUM,});
            wx.postMessage({messageType: 3, MAIN_MENU_NUM: gameConfig.MAIN_MENU_NUM,});
            //记录游戏数据
            /*wx.request({
                method: "post",
                url:GameConfig.INTER_URL+"/game/over",
                data: {
                    gameId: GameDataManager.gameId,
                    score: GameDataManager.score
                },
                datatype:'json',
                success:function (res) {
                    if(res.status == 1){
                        console.log("游戏数据记录成功")
                    }
                    else{
                        switch(res.code){
                            case 1004:
                                console.log("游戏不存在")
                            case 1005:
                                console.log("参数错误")
                        }
                    }
                },
                error:function () {
                    console.log("连接错误")
                }
            });*/
        }


    }
});
