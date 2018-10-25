import Util from './utils/util' ;
import GameUITools from './utils/GameUITools';
import GameConfig from './gameConfig' ;
import GameDataManager from './GameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        playAgainBtn:cc.Node,
        advBtn:cc.Node,
        navigateBtn:cc.Node,
        goBackHomeBtn:cc.Node,
        rankBtn:cc.Node,
        btnSound:cc.AudioClip,
        bestScore:cc.Label,
        nowScore: cc.Label,
        btnGroup:cc.Node,
        showOffbtn:cc.Node,
        showOffText:cc.Node,
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
            GameConfig.canResurrectTime = 1;
            _this.advBtn.active = true;
            _this.game.reStartGame();
            _this.node.active = false
        });
        Util.btnEvent(this.goBackHomeBtn,this.btnSound,function () {
            GameUITools.loadingScene('start');
            GameConfig.canResurrectTime = 1;
        });
        Util.btnEvent(this.rankBtn,this.btnSound,function () {
            GameUITools.loadingLayer("panel/rank")
        });
        Util.btnEvent(this.advBtn,this.btnSound,function () {
            GameConfig.canResurrectTime -= 1;
            _this.game.continueGame();
            _this.node.active = false;
        });
        Util.btnEvent(this.navigateBtn,this.btnSound,function (){
            if(GameConfig.IS_WX){
                wx.navigateToMiniProgram({
                    appId:'wx60dc6bacf553bdfc',
                    success(res) {
                        console.log("跳转成功")
                    }
                })
            }
        });
        Util.btnEvent(this.showOffbtn,this.btnSound,function (){
            if(GameConfig.IS_WX){
                if(GameDataManager.isBreakRecord){
                    wx.shareAppMessage({
                        title:GameConfig.config.recordShareTitle,
                        imageUrl:GameConfig.config.recordShareImg,
                        query:"SHARECODE="+wx.getStorageSync('shareCode')
                    });
                    //用户点击了“转发”按钮
                    wx.onShareAppMessage(function (res) {
                        return {
                            title: GameConfig.config.recordShareTitle,
                            imageUrl:GameConfig.config.recordShareImg,
                            query:"SHARECODE="+wx.getStorageSync('shareCode')
                        }
                    })
                    wx.request({
                        url:GameConfig.INTER_URL+"game/share",
                        data:{
                            'title': GameConfig.config.recordShareTitle,
                            'image': GameConfig.config.recordShareImg,
                            'query':"SHARECODE="+wx.getStorageSync('shareCode')
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Cookie':"SESSION="+wx.getStorageSync('sessionId')
                        },
                        method: "POST",
                        success:function (res){
                            console.log(res.data)
                            if(res.data.status == 1){
                                console.log("游戏分享保存成功")
                            }
                            else{
                                switch(res.data.code){
                                    case 1005:
                                        console.log("游戏分享保存参数错误")
                                        break;
                                }
                            }
                        },
                        error:function () {
                            console.log("连接错误")
                        }

                    })
                }
                else{
                    wx.shareAppMessage({
                        title:GameConfig.config.shareTitle,
                        imageUrl:GameConfig.config.shareImg,
                        query:"SHARECODE="+wx.getStorageSync('shareCode')
                    });
                    wx.request({
                        url:GameConfig.INTER_URL+"game/share",
                        data:{
                            'title': GameConfig.config.shareTitle,
                            'image': GameConfig.config.shareImg,
                            'query':"SHARECODE="+wx.getStorageSync('shareCode')
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Cookie':"SESSION="+wx.getStorageSync('sessionId')
                        },
                        method: "POST",
                        success:function (res){
                            console.log(res.data)
                            if(res.data.status == 1){
                                console.log("游戏分享保存成功")
                            }
                            else{
                                switch(res.data.code){
                                    case 1005:
                                        console.log("游戏分享保存参数错误")
                                        break;
                                }
                            }
                        },
                        error:function () {
                            console.log("连接错误")
                        }

                    });
                    //用户点击了“转发”按钮
                    wx.onShareAppMessage(function (res) {
                        return {
                            title: GameConfig.config.shareTitle,
                            imageUrl:GameConfig.config.shareImg,
                            query:"SHARECODE="+wx.getStorageSync('shareCode')
                        }
                    })
                }
            }
        });
    },
    init:function(game){
       this.game = game;
    },
    showScore:function(){
        try{if(GameConfig.IS_WX){
            //分数记录
            if (wx.getStorageSync('gameScore')) {
                var score = wx.getStorageSync('gameScore');
                this.nowScore.string = "本次分值: " + GameDataManager.totalScore;
                if (GameDataManager.totalScore > score) {
                    this.bestScore.string = "历史最佳: " + score;
                    wx.setStorageSync('gameScore',GameDataManager.totalScore);
                    this.showOffText.active = true;
                    GameDataManager.isHideSub = true;
                    GameDataManager.isBreakRecord = true;
                }
                else {
                    this.showOffText.active = false;
                    GameDataManager.isBreakRecord = false;
                    this.bestScore.string = "历史最佳: " + score;
                    GameDataManager.isHideSub = false;
                }
            }
            else{
                this.nowScore.string = "本次分值: " + GameDataManager.totalScore;
                this.bestScore.string = "历史最佳: " + GameDataManager.totalScore;
                wx.setStorageSync('gameScore',GameDataManager.totalScore);
                GameDataManager.isHideSub = true;
            }
            //微信存储分数
            var gameScore = GameDataManager.totalScore;
            wx.postMessage({messageType: 1, score: gameScore, MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,});
            wx.postMessage({messageType: 3, MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,});
            if(GameDataManager.isHideSub){
                wx.postMessage({messageType: 5});
            }
            //记录游戏数据
            wx.request({
                url:GameConfig.INTER_URL+"game/over",
                data:{
                    'gameId': GameDataManager.gameId,
                    'score': GameDataManager.totalScore
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie':"SESSION="+wx.getStorageSync('sessionId')
                },
                method: "POST",
                success:function (res) {
                    console.log(res.data)
                    if(res.data.status == 1){
                        console.log("游戏数据记录成功")
                    }
                    else{
                        switch(res.data.code){
                            case 1004:
                                console.log("游戏不存在")
                                break;
                            case 1005:
                                console.log("游戏数据记录参数错误")
                                break;
                        }
                    }
                },
                error:function () {
                    console.log("连接错误")
                }
            })
        }}
        catch (e) {
            Util.gameLog(1,'游戏结果显示模块错误')
        }

    }
});
