import Util from './utils/util' ;
import Animation from './utils/animation';
import GameUITools from './utils/GameUITools';
import gameConfig from './gameConfig' ;
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
        Util.gameStartDataInit();
        this.init();
        this.configInit();
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.5));
    },
    init: function () {
        var _this = this;
        GameUITools.loadingLayer("panel/music");
        if(gameConfig.IS_WX){
            GameUITools.loadingLayer("panel/userInfo");
        }
        this.node.on('touchstart', function () {
            if(gameConfig.isScreemCanTouch && !GameDataManager.isAnimate){
                _this.gameTouchStartProcessing();
            }
        });
        this.node.on('touchend', function () {
            if(gameConfig.isScreemCanTouch){
                if ( GameDataManager.isStartLengthen) {
                    _this.gameTouchEndProcessing();
                }
            }
        });
    },
    configInit: function () {
        this.canShowGameOver = true
    },
    //游戏复活
    continueGame: function () {
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
        if(gameConfig.canResurrectTime == 0){
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
        if(gameConfig.IS_WX){
            //游戏开始获取gameId
            wx.request({
                url:gameConfig.INTER_URL+"game/start",
                header: {
                    'Cookie':"SESSION="+wx.getStorageSync('sessionId')
                },
                method: "POST",
                success:function (res) {
                    console.log(res.data)
                    if(res.data.status == 1){
                        GameDataManager.gameId = res.data.data
                    }
                    else{
                        switch(res.data.code){
                            case 1006:
                                console.log("游戏开始操作失败")
                                break;
                        }
                    }
                },
                error:function () {
                    console.log("连接错误")
                }
            });
        }
    },
    /**
     * 游戏触摸开始数据处理
     */
    gameTouchStartProcessing(){
        if(!GameDataManager.isAnimate){
            GameDataManager.isLengthen = true;
            GameDataManager.isStartLengthen = true;
            if(GameDataManager.toolChoose == 1){
                this.bridge.buildBridge();
            }
            else if(GameDataManager.toolChoose == 2){
                this.player.readyToJump();
            }
        }
    },
    /**
     * 游戏触摸结束数据处理
     */
    gameTouchEndProcessing(){
        GameDataManager.isLengthen = false;
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
            this.culculateScore(length,lengthObj.min);
            GameDataManager.isSuccess = true
        }
        else {
            GameDataManager.isSuccess = false
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
     * 得分计算
     * @param toolLength 道具长度
     * @param distance 站桩距离
     */
    culculateScore:function(toolLength,distance){
        var scoreInterval; //得分区间
        var num = parseInt(this.stage.nextPlat.name.replace(/[^0-9]/ig, ""));
        var centerDistance = Math.floor(Math.abs(toolLength-( distance + this.stage.nextPlat.width/2))); //道具顶点与下个站桩中心的距离
        if(num <= 3){
            scoreInterval = Math.floor(this.stage.nextPlat.width/9);
            if(0 <= centerDistance && centerDistance <= 0.5*scoreInterval){
                GameDataManager.nextScore = 5;
                GameDataManager.addScoreGrade = 3;
            }
            else if(0.5*scoreInterval < centerDistance && centerDistance <= 1.5*scoreInterval){
                GameDataManager.nextScore = 4;
                GameDataManager.addScoreGrade = 2;
            }
            else if(1.5*scoreInterval < centerDistance && centerDistance <= 2.5*scoreInterval){
                GameDataManager.nextScore = 3;
                GameDataManager.addScoreGrade = 2;
            }
            else if(2.5*scoreInterval < centerDistance && centerDistance <= 3.5*scoreInterval){
                GameDataManager.nextScore = 2;
                GameDataManager.addScoreGrade = 1;
            }
            else if(3.5*scoreInterval < centerDistance && centerDistance <= 4.5*scoreInterval){
                GameDataManager.nextScore = 1;
                GameDataManager.addScoreGrade = 1;
            }
        }
        else{
            switch(num){
                case 4:
                    scoreInterval = Math.floor(this.stage.nextPlat.width/7);
                    if(0 < centerDistance && centerDistance <= 0.5*scoreInterval){
                        GameDataManager.nextScore = 6;
                        GameDataManager.addScoreGrade = 3;
                    }
                    else if(0.5*scoreInterval <centerDistance && centerDistance <= 1.5*scoreInterval){
                        GameDataManager.nextScore = 5;
                        GameDataManager.addScoreGrade = 2;
                    }
                    else if(1.5*scoreInterval <centerDistance && centerDistance <= 2.5*scoreInterval){
                        GameDataManager.nextScore = 3;
                        GameDataManager.addScoreGrade = 2;
                    }
                    else if(2.5*scoreInterval <centerDistance && centerDistance <= 3.5*scoreInterval){
                        GameDataManager.nextScore = 1;
                        GameDataManager.addScoreGrade = 1;
                    }
                    break;
                case 5:
                    scoreInterval = Math.floor(this.stage.nextPlat.width/5);
                    if(0 < centerDistance && centerDistance <= 0.5*scoreInterval){
                        GameDataManager.nextScore = 7;
                        GameDataManager.addScoreGrade = 3;
                    }
                    else if(0.5*scoreInterval <centerDistance && centerDistance <= 1.5*scoreInterval){
                        GameDataManager.nextScore = 4;
                        GameDataManager.addScoreGrade = 2;
                    }
                    else if(1.5*scoreInterval <centerDistance && centerDistance <= 2.5*scoreInterval){
                        GameDataManager.nextScore = 2;
                        GameDataManager.addScoreGrade = 1;
                    }
                    break;
                case 6:
                    scoreInterval = Math.floor(this.stage.nextPlat.width/3);
                    if(0 < centerDistance && centerDistance <= 0.5*scoreInterval){
                        GameDataManager.nextScore = 8;
                        GameDataManager.addScoreGrade = 3;
                    }
                    else if(0.5*scoreInterval <centerDistance && centerDistance <= 1.5*scoreInterval){
                        GameDataManager.nextScore = 4;
                        GameDataManager.addScoreGrade = 2;
                    }
                    break;
            }
        }
    },
    /**
     * 控制所有节点的移动
     */
    allMove: function (callbacks){
        GameDataManager.move += gameConfig.gameMoveSpeed;
        if (GameDataManager.move > (GameDataManager.moveDistance)) {
            callbacks && callbacks();  //移动完执行
        }
    },
    /**
     * 获取道具长度
     */
    getToolLength:function(){
        if(GameDataManager.toolChoose == 0){
            return this.stick.node.height
        }
        else if(GameDataManager.toolChoose == 1){
            return this.bridge.bridgeY
        }
        else if(GameDataManager.toolChoose == 2){
            return Math.floor(this.energy.energy.height/300*600)
        }
    },
    /**
     * 设置道具
     */
    setTool:function(){
        if(GameDataManager.toolChoose == 0){
            this.stick.setStick(this.stage.currentPlat.x + this.stage.currentPlat.width / 2)
        }
        else if(GameDataManager.toolChoose == 1){
            this.bridge.setBridge(this.stage.currentPlat.x + this.stage.currentPlat.width / 2);
        }
        else if(GameDataManager.toolChoose == 2){
            this.player.stop();
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
            cc.audioEngine.playEffect(_this.gameOverSound,false,1);
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
            if(gameConfig.canResurrectTime == 0){
                this.gameOver.advBtn.active = false;
                this.gameOver.navigateBtn.active = true;
                //this.gameOver.btnGroup.y = -270;
            }
            else{
                this.gameOver.advBtn.active = true;
                this.gameOver.navigateBtn.active = false
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

