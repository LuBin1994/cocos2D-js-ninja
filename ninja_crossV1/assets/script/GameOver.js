import Util from './utils/util';
import GameUITools from './utils/GameUITools';
import GameConfig from './gameConfig';
import GameDataManager from './GameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        playAgainBtn: cc.Node,
        advBtn: cc.Node,
        goBackHomeBtn: cc.Node,
        rankBtn: cc.Node,
        btnSound: cc.AudioClip,
        bestScore: cc.Label,
        nowScore: cc.Label,
        btnGroup: cc.Node,
        showOffbtn: cc.Node,
        showOffText: cc.Node
    },
    onLoad() {
        var _this = this;
        cc.loader.loadRes("panel/moreGame", (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                this.node.addChild(node);
            }
        });
        //btn绑定事件
        Util.btnEvent(this.playAgainBtn, this.btnSound, function () {
            if (GameDataManager.everydayGameMax != 0) {
                GameDataManager.everydayGameMax--;
                localStorage.setItem('everydayGameMax', GameDataManager.everydayGameMax);
                _this.game.reStartGame();
                _this.node.active = false
                _this.hideBannerAdv();
            }
            else {
                Util.createVideoAdv('adunit-2a1eec952b1c6e4c', GameConfig.videoAdv, function () {
                    GameDataManager.everydayGameMax += GameConfig.gameIncrease;
                    GameDataManager.everydayGameMax--;
                    localStorage.setItem('everydayGameMax', GameDataManager.everydayGameMax);
                    _this.game.reStartGame();
                    _this.node.active = false
                    _this.hideBannerAdv();
                })
            }
        });
        Util.btnEvent(this.goBackHomeBtn, this.btnSound, function () {
            GameUITools.loadingScene('start');
            _this.hideBannerAdv();
        });
        //查看排名
        Util.btnEvent(this.rankBtn, this.btnSound, function () {
            if (GameDataManager.rankMax != 0) {
                GameDataManager.rankMax--;
                localStorage.setItem('rankMax', GameDataManager.rankMax);
                GameUITools.loadingLayer("panel/rank");
                if (GameConfig.auths_Btn) {
                    GameConfig.auths_Btn.hide();
                }
                _this.hideBannerAdv();
            }
            else {
                Util.createVideoAdv('adunit-9429ed2ecefa9198', GameConfig.videoAdv, function () {
                    GameDataManager.rankMax += GameConfig.rankIncrease;
                    GameDataManager.rankMax--;
                    localStorage.setItem('rankMax', GameDataManager.rankMax)
                    GameUITools.loadingLayer("panel/rank");
                    if (GameConfig.auths_Btn) {
                        GameConfig.auths_Btn.hide();
                    }
                    _this.hideBannerAdv();
                })
            }
        });
        Util.btnEvent(this.advBtn, this.btnSound, function () {
            Util.createVideoAdv('adunit-a319cf0689893757', GameConfig.videoAdv, function () {
                GameConfig.canResurrectTime -= 1;
                _this.game.continueGame();
                _this.hideGameOver();
            })
        });
        if (GameConfig.IS_WX){
            Util.btnEvent(this.showOffbtn, this.btnSound, function () {
                var shareCode = "shareCode=" + wx.getStorageSync('shareCode')
                console.log(shareCode)
                if (GameDataManager.isBreakRecord) {
                    console.log("破纪录的分享")
                    wx.shareAppMessage({
                        title: GameConfig.config.recordShareTitle,
                        imageUrl: GameConfig.config.recordShareImg,
                        query: shareCode
                    });
                    wx.request({
                        url: GameConfig.INTER_URL + "game/share",
                        data: {
                            'title': GameConfig.config.recordShareTitle,
                            'image': GameConfig.config.recordShareImg,
                            'query': wx.getStorageSync('shareCode')
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                        },
                        method: "POST",
                        success: function (res) {
                            console.log(res.data)
                            if (res.data.status == 1) {
                                console.log("游戏分享保存成功")
                            }
                            else {
                                switch (res.data.code) {
                                    case 1005:
                                        console.log("游戏分享保存参数错误")
                                        break;
                                }
                            }
                        },
                        error: function () {
                            console.log("连接错误")
                        }

                    })
                }
                else {
                    console.log("未破纪录的分享")
                    wx.shareAppMessage({
                        title: GameConfig.config.passShareTitle,
                        imageUrl: GameConfig.config.passShareImg,
                        query: shareCode
                    });
                    wx.request({
                        url: GameConfig.INTER_URL + "game/share",
                        data: {
                            'title': GameConfig.config.passShareTitle,
                            'image': GameConfig.config.passShareImg,
                            'query': wx.getStorageSync('shareCode')
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                        },
                        method: "POST",
                        success: function (res) {
                            console.log(res.data)
                            if (res.data.status == 1) {
                            }
                            else {
                                switch (res.data.code) {
                                    case 1005:
                                        Util.gameLog("游戏分享保存参数错误")
                                        break;
                                }
                            }
                        },
                        error: function () {
                            console.log("连接错误")
                        }

                    });
                }
            });
            cc.loader.loadRes("panel/subCanvas", (err, prefab) => {
                if (!err) {
                    let node = cc.instantiate(prefab);
                    _this.node.addChild(node);
                }
            });
        }
    },
    init: function (game) {
        this.game = game;
    },
    //游戏分数处理
    scoreProcess: function () {
        if (GameConfig.IS_WX) {
            //分数记录
            var score = wx.getStorageSync('gameScore');
            this.nowScore.string = "本次分值: " + GameDataManager.totalScore;
            if (GameDataManager.totalScore > score) {
                this.bestScore.string = "历史最佳: " + score;
                wx.setStorageSync('gameScore', GameDataManager.totalScore);
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
            //微信存储分数
            var gameScore = GameDataManager.totalScore;
            wx.postMessage({ messageType: 1, score: gameScore, MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM, });
            wx.postMessage({ messageType: 3, MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM, });
            if (GameDataManager.isHideSub) {
                wx.postMessage({ messageType: 5 });
            }
            //记录游戏数据
            console.log("将要传回的gameID", GameDataManager.gameId)
            wx.request({
                url: GameConfig.INTER_URL + "game/over",
                data: {
                    'gameId': GameDataManager.gameId,
                    'score': GameDataManager.totalScore
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                },
                method: "POST",
                success: function (res) {
                    console.log('游戏数据记录接口返回值：', res.data)
                    if (res.data.status == 1) { }
                    else {
                        console.log(res.data.info)
                    }
                },
                error: function () {
                    Util.gameLog("/game/over接口调用失败")
                }
            })
        }
    },
    showGameOver() {
        this.node.active = true;
        if (GameConfig.IS_WX) {
            //banner广告
            Util.createBannerAdv(Util.createBannerAdv);
        }
        if(GameConfig.canResurrectTime == 0){
            this.advBtn.active = false;
        }
        else{
            this.advBtn.active = true;
        }
    },
    hideGameOver(){
        this.node.active = false;
        this.hideBannerAdv();
    },
    hideBannerAdv() {
        if (GameConfig.IS_WX) {
            GameConfig.gameOverBannerAdv.hide();
        }
    }
});
