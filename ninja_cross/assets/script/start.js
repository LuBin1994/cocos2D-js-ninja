import Util from './utils/util';
import GameUITools from './utils/GameUITools';
import GameDataManager from './gameDataManager';
import GameConfig from './gameConfig';
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
        wx.showShareMenu()//显示转发按钮
        this.getShareConfig();
    },
    getShareConfig() {
        var _this = this
        //获取分享信息
        wx.request({
                url: GameConfig.INTER_URL + "game/getConfig",
                method: "GET",
                success: function (res) {
                    console.log(res.data)
                    if (res.data.status == 1){
                        GameConfig.config = res.data.data;
                        console.log(GameConfig)
                        var gameDifficultyNum = parseInt(GameConfig.config.difficulty)
                        //设置游戏难度
                        Util.setGameDifficulty(gameDifficultyNum)
                    }
                    else {
                        console.log("获取游戏配置信息失败")
                        console.log(res.data.info)
                    }
                }
        })
    },
    start (){
        cc.director.preloadScene("game", () => {
           console.log("游戏场景已加载")
        });
        this.tex = new cc.Texture2D();
        Util.gameLog(5,'测试日志接口')
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
                //游戏开始获取gameId
                wx.request({
                    url:GameConfig.INTER_URL+"game/start",
                    header: {
                        'Cookie':"SESSION="+wx.getStorageSync('sessionId')
                    },
                    method: "POST",
                    success:function (res) {
                        console.log(res.data)
                        if(res.data.status == 1){
                            GameDataManager.gameId = res.data.data;
                        }
                        else{
                           console.log(res.data.info);
                        }
                    },
                    error:function () {
                        console.log("请求无响应")
                    }
                });
                Util.gameLog();
            }
            Util.gameLog()
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
    },
});
