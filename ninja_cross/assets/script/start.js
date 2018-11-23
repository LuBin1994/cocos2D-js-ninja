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
        prefab:[cc.Prefab],
        btnSound:{
            default: null,
            type: cc.AudioClip
        },
        completeCount:0,
        totalCount:2,
        loadingMask:cc.Node
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
        cc.director.preloadScene("game", () =>{
           console.log("游戏场景已加载");
        });
        this.tex = new cc.Texture2D();
        this.modeBounce(this.startBtn);
    },
    init:function(){
        var _this = this;
        if(GameConfig.IS_WX){
            //头像预制
            GameUITools.initPrefab(this.prefab[1]);
            if(GameConfig.haveLoadData){
                this.loadingMask.active = false;
            }
            else{
                this.loadingMask.active = true;
            }
        }
        //音乐
        GameUITools.initPrefab(this.prefab[0]);
        //更多游戏
        GameUITools.initPrefab(this.prefab[2]);
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
        if(!localStorage.getItem('modeGuide')){
            GameUITools.loadingLayer("panel/modeChoose");
        }
    },
    //获取分享信息
    getShareConfig() {
        var _this = this
        wx.request({
            url: GameConfig.INTER_URL + "game/getConfig",
            method: "GET",
            success: function (res){
                console.log("获取分享信息返回值：",res.data)
                if (res.data.status == 1){
                    GameConfig.config = res.data.data;
                    if(!GameConfig.haveSetMode){
                        GameDataManager.toolChoose = parseInt(res.data.data.defaultModel)-1;
                        GameConfig.haveSetMode = true
                    }
                    var gameDifficultyNum = parseInt(GameConfig.config.difficulty);
                    //设置游戏难度
                    Util.setGameDifficulty(gameDifficultyNum);
                    _this.completeCount+=1;
                    console.log('完成进度',_this.completeCount)
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
        var _this = this;
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
                _this.completeCount+=1;
                console.log('完成进度',_this.completeCount)
            }
        })
    },
    //获取由他人分享的shareCode
    getOtherShareCode(){
        var res = wx.getLaunchOptionsSync()
        console.log("返回小程序启动参数",res)
        if(res.query.shareCode){
            GameConfig.enterShareConfig.enterShareCode = res.query.shareCode;
            GameConfig.enterShareConfig.path = res.path;
        }
    },
    modeBounce(node){
        var scale1 = cc.scaleTo(0.5,0.9)
        var scale2 = cc.scaleTo(0.5,1)
        var ani = cc.sequence(scale1,scale2);
        var ani1 = cc.repeatForever(ani);
        node.runAction(ani1);
    },
    update(dt){
        if(!GameConfig.haveLoadData){
            if(this.completeCount == this.totalCount){
                console.log('已完成加载')
                GameConfig.haveLoadData = true;
                this.loadingMask.active = false; 
            }
        }
    },
});
