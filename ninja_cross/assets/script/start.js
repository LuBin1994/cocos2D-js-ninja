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
        if(GameConfig.IS_WX){
            wx.showShareMenu();//显示转发按钮
            this.getShareConfig();
            this.getUserSystemInfo();
            this.getOtherShareCode();
        }
    },
    start (){
        cc.director.preloadScene("game", () => {
           console.log("游戏场景已加载");
        });
        this.tex = new cc.Texture2D();
    },
    init:function(){
        var _this = this;
        if(GameConfig.IS_WX){
            GameUITools.loadingLayer("panel/userInfo");
        }
        GameUITools.loadingLayer("panel/music");
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
    },
    //获取分享信息
    getShareConfig() {
        var _this = this
        wx.request({
            url: GameConfig.INTER_URL + "game/getConfig",
            method: "GET",
            success: function (res) {
                console.log("获取分享信息返回值：",res.data)
                if (res.data.status == 1){
                    GameConfig.config = res.data.data;
                    if(!GameConfig.haveSetMode){
                        GameDataManager.toolChoose = parseInt(res.data.data.defaultModel)-1;
                        GameConfig.haveSetMode = true
                    }
                    var gameDifficultyNum = parseInt(GameConfig.config.difficulty)
                    //设置游戏难度
                    Util.setGameDifficulty(gameDifficultyNum)
                    //用户点击了右上角“转发”按钮
                    wx.onShareAppMessage(function (res){
                        return {
                            title: GameConfig.config.shareTitle,
                            imageUrl:GameConfig.config.shareImg,
                            query:"shareCode="+wx.getStorageSync('shareCode')
                        }
                    })
                }
                else {
                    Util.gameLog(res.data.info)
                }
            }
        })
    },
    //获取用户系统信息
    getUserSystemInfo(){
        wx.getSystemInfo({
            success (res){
                GameConfig.systemInfo.system = res.system;
                GameConfig.systemInfo.brand = res.brand;
                GameConfig.systemInfo.model = res.model;
                GameConfig.systemInfo.pixelRatio = res.pixelRatio;
                GameConfig.systemInfo.screenWidth = res.screenWidth;
                GameConfig.systemInfo.screenHeight = res.screenHeight;
                GameConfig.systemInfo.version = res.version;
                GameConfig.systemInfo.platform = res.platform;
                GameConfig.systemInfo.SDKVersion = res.SDKVersion;
                GameConfig.systemInfo.screenWidth = res.screenWidth;
                GameConfig.systemInfo.benchmarkLevel = res.benchmarkLevel;
            }
        })
    },
    //获取由他人分享的shareCode
    getOtherShareCode(){
        var res = wx.getLaunchOptionsSync()
        console.log("返回小程序启动参数",res)
        if(res.query.shareCode){
            GameConfig.enterShareConfig.enterShareCode = res.query.shareCode
            GameConfig.enterShareConfig.path = res.path
        }
    }
});
