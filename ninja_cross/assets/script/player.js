import gameConfig from './gameConfig';
import GameDataManager from './GameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        anim:null,
        jumpHeight:300,
    },
    onLoad(){
        this.anim = this.node.getComponent(cc.Animation);
        this.stop();
        this.configInit();
    },
    //忍者与鲨鱼碰撞后执行事件
    onCollisionEnter(other){
        var currentWidth = this.game.stage.currentPlat.width;
        var currentX = this.game.stage.currentPlat.x;
        var nextWidth = this.game.stage.nextPlat.width;
        var nextX= this.game.stage.nextPlat.x;
        if(currentX-currentWidth/2 < this.node.x && this.node.x < currentX+currentWidth/2){
            console.log('位于当前站桩范围内')
        }
        else if(nextX-nextWidth/2 < this.node.x && this.node.x < nextX+nextWidth/2){
            console.log('位于下一站桩范围内')
        }
        else{
            GameDataManager.isSuccess = false;
            GameDataManager.isMove = false;
            GameDataManager.isGameOver = true;
            this.game.showGameOver();
            this.node.stopAllActions();
            this.game.stick.node.stopAllActions();
            this.game.bridge.node.stopAllActions();
            this.fall();
        }
    },
    configInit:function(){
        this.node.x = -210;
        this.node.y = -295;
    },
    init:function(game){
        this.game = game;
    },
    gameInit:function(){
        this.configInit();
        this.stop();
    },
    //奔跑
    run:function(){
        if(!GameDataManager.isGameOver){
            var animState = this.anim.play('playerRun');
            animState.repeatCount = Infinity;
        }
    },
    //停下
    stop:function(){
        var animState = this.anim.play('playerStand');
        animState.repeatCount = 1;
    },
    //坠落
    drop:function(distance){
        var _this = this;
        var time = (distance/200).toFixed(1);
        var runOver = cc.moveTo(time,cc.v2(-210+distance,-295));
        var finishRun = cc.callFunc(function (){
            var animState = _this.anim.play('playerFall');
            animState.repeatCount = 1;
        })
        var fall = cc.moveTo(1,cc.v2(-210+distance,-1000)).easing(cc.easeIn(2.5));
        var ani = cc.sequence(runOver,finishRun,fall);
        this.node.runAction(ani);
    },
    fall(){
        var animState = this.anim.play('playerFall');
        animState.repeatCount = 1;
        var fall = cc.moveTo(1,cc.v2(this.node.x,-1000)).easing(cc.easeIn(2.5));
        this.node.runAction(fall);
    },
    //成功跳跃
    successJump(distance,jumpHeight){
        var _this = this;
        this.anim.play('playerJump');
        var jump = cc.jumpTo(1,cc.v2(-210+distance,-295),jumpHeight,1);
        var finish = cc.callFunc(function (){
            if(GameDataManager.isSuccess){
                _this.stop();
                GameDataManager.isMove = true;
                _this.game.gainScore();
                _this.game.scoreAni.showScoreFx();
            }
        })
        var ani = cc.sequence(jump,finish)
        this.node.runAction(ani);
    },
    //失败跳跃
    failJump(distance,jumpHeight){
        var _this = this;
        this.anim.play('playerJump');
        var jump = cc.jumpTo(1, cc.v2(-210 + distance, -295), jumpHeight, 1);
        var fninsh1 = cc.callFunc(function () {
            _this.anim.play('playerFall');
            _this.game.showGameOver();
        });
        var fall = cc.moveTo(1.5, cc.v2(-210 + distance, -1000)).easing(cc.easeIn(2));
        var ani = cc.sequence(jump, fninsh1, fall);
        this.node.runAction(ani)
    },
    readyToJump(){ this.anim.play('playerReadyJump');},
    update (dt) {
        if(GameDataManager.toolChoose == 2){
            if (GameDataManager.isSuccess) {
                if (GameDataManager.isMove) {
                    this.node.x -= gameConfig.gameMoveSpeed;
                }
            }
        }
    }
});
