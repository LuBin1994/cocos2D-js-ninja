import Util from './utils/util' ;
import Animation from './utils/animation';
import GameUITools from './utils/GameUITools';
import GameConfig from './GameConfig' ;
import GameDataManager from './gameDataManager';
var Player = require('player');
var Stage = require('stage');
var GameBg = require('gameBg');
var Stick = require('stick');
var GameOver = require('GameOver');
var ScoreAni = require('scoreAni');
var Bridge = require('bridge');
var Fog = require('fog');
var Energy = require('energy');
var Shark = require('shark');
cc.Class({
    extends: cc.Component,
    properties: {
        player: Player,
        stage: Stage,
        gameBg: GameBg,
        stick: Stick,
        bridge:Bridge,
        fog:Fog,
        gameOver:GameOver,
        scoreAni:ScoreAni,
        energy:Energy,
        scoreDisplay:cc.Label,
        scoreGroup:cc.Node,
        gameOverSound:cc.AudioClip,
        shark:Shark,

    },
    onLoad() {
        this.gameBg.init(this);
        this.stage.init(this);
        this.gameOver.init(this);
        this.energy.init(this);
        this.shark.init(this);
        this.player.init(this);
        this.init();
        this.configInit();
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.5));
        Util.gameStartDataInit();
    },
    init: function () {
        var _this = this;
        GameUITools.loadingLayer("panel/music");
        switch(GameDataManager.toolChoose){
            case 0:
                if(!localStorage.getItem("stickGuide")){
                    console.log('棍子新手引导')
                    GameUITools.loadingLayer('panel/guide')
                }
                break;
            case 1:
                if(!localStorage.getItem("bridgeGuide")){
                    console.log('桥梁新手引导')
                    GameUITools.loadingLayer('panel/guide')
                }
                break;
            case 2:
                if(!localStorage.getItem("jumpGuide")){
                    console.log('跳跃新手引导')
                    GameUITools.loadingLayer('panel/guide')
                }
                break;
        }
        if(GameConfig.IS_WX){
            GameUITools.loadingLayer("panel/userInfo");
        }
        this.node.on('touchstart', function () {
            if(GameConfig.isScreemCanTouch && !GameDataManager.isAnimate){
                _this.gameTouchStartProcessing();
            }
        });
        this.node.on('touchend', function () {
            if(GameConfig.isScreemCanTouch){
                if ( GameDataManager.isStartLengthen){
                    _this.gameTouchEndProcessing();
                }
            }
        });
        //游戏开始获取id
        if(GameConfig.IS_WX){
            var modelChoose = parseInt(GameDataManager.toolChoose)+1
            //游戏开始获取gameId
            wx.request({
                url:GameConfig.INTER_URL+"game/start",
                data:{
                    'model':modelChoose
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie':"SESSION="+wx.getStorageSync('sessionId')
                },
                method: "POST",
                success:function (res) {
                    console.log('游戏开始获取gameId返回值：',res.data)
                    if(res.data.status == 1){
                        GameDataManager.gameId = res.data.data;
                    }
                    else{
                        Util.gameLog(res.data.info)
                    }
                },
                error:function () {
                    Util.gameLog("game/start接口调用失败")
                }
            });
        }
    },
    configInit: function () {
        this.canShowGameOver = true
    },
    //游戏复活
    continueGame: function () {
        this.stage.setStagePosX();
        this.stage.showStage();
        switch(GameDataManager.toolChoose){
            case 0:
                this.stick.gameInit();
                break;
            case 1:
                this.bridge.gameInit();
                break;
            case 2:
                break;
        }
        this.stick.node.x = this.stage.currentPlat.x + this.stage.currentPlat.width / 2;
        this.player.gameInit();
        this.shark.gameInit();
        this.setTool();
        Util.gameContinueDataInit();
        this.configInit();
        this.scoreDisplay.string = GameDataManager.totalScore;
        if(GameConfig.canResurrectTime == 0){
            this.gameOver.advBtn.active = false;
        }
        if(GameDataManager.toolChoose == 2){
            this.energy.gameInit();
        }
        this.scoreGroup.opacity = 255;
    },
    //重开游戏
    reStartGame: function () {
        GameUITools.loadingScene("game");
    },
    /**
     * 游戏触摸开始数据处理
     */
    gameTouchStartProcessing(){
        if(!GameDataManager.isAnimate){
            GameDataManager.isLengthen = true;
            GameDataManager.isStartLengthen = true;
            switch(GameDataManager.toolChoose){
                case 1:
                    this.bridge.buildBridge();
                    break;
                case 2:
                    this.player.readyToJump();
                    break;
            }
            //删掉新手指引
            if(cc.director.getScene().children[0].getChildByName("guide")){
                var guide =  cc.director.getScene().children[0].getChildByName("guide");
                cc.director.getScene().children[0].removeChild(guide)
                cc.director.getScene().children[0].removeChild(guide)
            }
        }
    },
    /**
     * 游戏触摸结束数据处理
     */
    gameTouchEndProcessing(){
        GameDataManager.isLengthen = false;
        switch(GameDataManager.toolChoose){
            case 0:
                if(!localStorage.getItem("stickGuide")){
                   localStorage.setItem('stickGuide',true)
                }
                break;
            case 1:
                if(!localStorage.getItem("bridgeGuide")){
                    localStorage.setItem('bridgeGuide',true)
                }
                break;
            case 2:
                if(!localStorage.getItem("jumpGuide")){
                    localStorage.setItem('jumpGuide',true)
                }
                break;
        }
        if(!GameDataManager.isAnimate){
            var length = this.getToolLength();
            if(GameDataManager.toolChoose <= 1){
                GameDataManager.moveDistance =Math.floor(this.stage.currentPlat.x - this.player.node.x + length + this.stage.currentPlat.width/2)
            }
            else{
                var distance = Math.floor(this.energy.energy.height/300*600);
                GameDataManager.moveDistance =Math.floor(this.stage.currentPlat.x - this.player.node.x + distance + this.stage.currentPlat.width/2)
            }
            this.successOrlose(length);
            if(GameDataManager.isShowFog){
                this.fog.hideFog();
            }
            GameDataManager.isAnimate = true;
        }
    },
    /**
     * 计算道具是否能完成过桥
     */
    successOrlose: function (length) {
        var _this = this;
        var lengthObj = this.stage.getLength();
        //判断搭桥是否成功
        if (lengthObj.min <= length && length <= lengthObj.max){
            Util.culculateScore(this.stage.nextPlat,length,lengthObj.min);
            GameDataManager.isSuccess = true;
        }
        else {
            GameDataManager.isSuccess = false;
        }

        //道具执行动画
        if(!GameDataManager.isGameOver){
            switch(GameDataManager.toolChoose){
                case 0:
                    //棍子执行动画
                    Animation.toolRotateAni( GameDataManager.isSuccess,this.stick.node);
                    setTimeout(function () { _this.player.run()},700);
                    break;
                case 1:
                    //桥执行动画
                    Animation.toolRotateAni( GameDataManager.isSuccess,this.bridge.node);
                    setTimeout(function () { _this.player.run() },700);
                    break;
                case 2:
                    //跳跃执行动画
                    if(GameDataManager.isSuccess){
                        this.player.successJump(GameDataManager.moveDistance,_this.player.jumpHeight);
                    }
                    else{
                        this.player.failJump(GameDataManager.moveDistance,_this.player.jumpHeight);
                    }
                    break;
            }
        }
    },
    /**
     * 控制所有节点的移动
     */
    allMove: function (callbacks){
        GameDataManager.move += GameConfig.gameMoveSpeed;
        if (GameDataManager.move > (GameDataManager.moveDistance)) {
            callbacks && callbacks();  //移动完执行
        }
    },
    /**
     * 获取道具长度
     */
    getToolLength:function(){
        switch(GameDataManager.toolChoose){
            case 0:
                return this.stick.node.height;
                break;
            case 1:
                return this.bridge.bridgeY;
                break;
            case 2:
                return Math.floor(this.energy.energy.height/300*600);
                break;
        }
    },
    /**
     * 设置道具
     */
    setTool:function(){
        switch(GameDataManager.toolChoose){
            case 0:
                this.stick.setStick(this.stage.currentPlat.x + this.stage.currentPlat.width / 2)
                break;
            case 1:
                this.bridge.setBridge(this.stage.currentPlat.x + this.stage.currentPlat.width / 2);
                break;
            case 2:
                this.player.stop();
                break;
        }
    },
    //得分
    gainScore: function () {
        GameDataManager.totalScore += GameDataManager.nextScore;
        this.scoreDisplay.string = GameDataManager.totalScore;
    },
    /**
     * 游戏结束显示
     */
    showGameOver: function () {
        var _this = this;
        if (this.canShowGameOver) {
            GameDataManager.isGameOver = true;
            this.gameOver.showScore();
            if(GameDataManager.canSoundPlay){
                cc.audioEngine.playEffect(_this.gameOverSound,false,1);
            }
            this.scheduleOnce(function() {
                switch(GameDataManager.toolChoose){
                    case 0:
                        this.stick.node.opacity = 0;
                        break;
                    case 1:
                        this.bridge.node.opacity = 0;
                        break;
                    case 2:
                        this.energy.node.opacity = 0;
                        break;
                }
                this.scoreGroup.opacity = 0;
                this.gameOver.node.active = true;
                this.stage.hideStage();
            }, 1.5);
            this.fog.hideFog();
            if(GameConfig.canResurrectTime == 0){
                this.gameOver.advBtn.active = false;
                //this.gameOver.btnGroup.y = -270;
            }
            else{
                this.gameOver.advBtn.active = true;
                //this.gameOver.btnGroup.y = -390;
            }
        }
        this.canShowGameOver = false;
    },
    update(dt) {
        var _this = this;
        if (GameDataManager.isAnimate) {
            //所有对象移动，以及移动完的回调
            if (GameDataManager.isMove) {
                if(GameDataManager.isSuccess){
                    this.allMove(function () {
                        if(GameDataManager.isSuccess){
                            GameDataManager.isMove = false;
                            GameDataManager.isAnimate = false;
                            GameDataManager.move = 0;
                            _this.stage.createStage();
                            _this.stage.recycleStage();
                            if(GameDataManager.toolChoose !== 2){
                                _this.gainScore();
                                _this.scoreAni.showScoreFx();
                            }
                            _this.setTool();
                            _this.player.stop();
                            if(GameDataManager.toolChoose == 2){
                                _this.energy.configInit();
                            }
                            GameDataManager.isStartLengthen = false;
                        }
                    });
                }
            }
            //人物掉落动画
            if (!GameDataManager.isSuccess) {
                if (GameDataManager.canDrop) {
                    var moveDistance = this.stage.currentPlat.x-this.player.node.x+this.stage.currentPlat.width/2
                    this.player.drop(moveDistance);
                    this.showGameOver();
                    GameDataManager.canDrop = false;
                }
            }
        }
    }
});

